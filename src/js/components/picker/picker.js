import * as Animate from './animate';
import Scroll from '../../application/scroll';

let noop = function(){};
let Template = require('./picker.html');

function getElement(expr){
    return (typeof expr === 'string') ? document.querySelector(expr) : expr;
}

function getComputedStyle(el, key){
    let computedStyle = window.getComputedStyle(el);
    return computedStyle[key] || '';
}

function easeOutCubic(pos){
    return (Math.pow((pos - 1), 3) + 1);
}

function easeInOutCubic(pos){
    if((pos /= 0.5) < 1){
        return 0.5 * Math.pow(pos, 3);
    }
    return 0.5 * (Math.pow((pos - 2), 3) + 2);
}

const default_options = {
    itemClass: 'SP-picker-item',
    onSelect: noop,
    defaultValue: 0,
    data: {}
};

class Picker extends Scroll {
    constructor(vm, el, options = {}) {
        super(vm, el);

        this._component = this.vm.$els.component;
        this._content = this.vm.$els.content;
        this._indicator = this.vm.$els.indicator;

        this._isAnimating = false;
        this._isSingleTouch = true;


        this.options = options;

        for(let key in default_options){
            if(typeof this.options[key] === 'undefined'){
                this.options[key] = default_options[key];
            }
        }

        this._container = getElement(container);

        let tempContainer = document.createElement('div');
        tempContainer.innerHTML = options.template || Template;

        this._component = tempContainer.querySelector('[data-role=component]');
        this._content = this._component.querySelector('[data-role=content]');
        this._indicator = this._component.querySelector('[data-role=indicator]');

        let data = this.options.data;
        let html = '';

        if(data.length && data[0].constructor === Object){
            html = data.map((row) => {
                return '<div class="' + this.options.itemClass + '" data-value="' + row.value + '">' + row.name + '</div>';
            }).join('');
        }
        else {
            html = data.map((val) => {
                return '<div class="' + this.options.itemClass + '" data-value="' + val + '">' + val + '</div>';
            }).join('');
        }

        this._content.innerHTML = html;

        this._container.appendChild(this._component);

        this._itemHeight = parseInt( getComputedStyle(this._indicator, 'height'), 10 );

        let content = this._content;
        this._callback = this.options.callback || function(top){
                content.style.webkitTransform = 'translate3d(0, ' + (-top) + 'px, 0)';
            };

        this.setDimensions(this._component.clientHeight);

        if(this._component.clientHeight === 0){
            this.setDimensions(238);
        }

        this.select(this.options.defaultValue, false);

        this.scrollIns = new Scroll(this._component, (moveResult) => {
            this._lastTimeStamp = moveResult.currentTimeStamp;
            if(this._isDragging){
                let scrollTop = this._scrollTop;
                if(this._enableScrollY){
                    scrollTop -= moveResult.shiftY;
                    if(scrollTop > this._maxScrollTop || scrollTop < this._minScrollTop) {
                        if(scrollTop > this._maxScrollTop){
                            scrollTop = this._maxScrollTop;
                        }
                        else {
                            scrollTop = this._minScrollTop;
                        }
                    }
                }

                if(this._positions.length > 40){
                    this._positions.splice(0, 20);
                }

                this._positions.push(scrollTop, moveResult.currentTimeStamp);
                this.publish(scrollTop)
            }
            else {
                let minimumTrackingForScroll = 0;
                let minimumTrackingForDrag = 5;

                let distanceY = Math.abs(moveResult.currentY - moveResult.startY);
                this._enableScrollY = distanceY >= minimumTrackingForScroll;
                this._positions.push(this._scrollTop, moveResult.currentTimeStamp);

                this._isDragging = this._enableScrollY && (distanceY >= minimumTrackingForDrag);
            }
        });

        this.scrollIns.on('start', (e, timeStamp) => {
            this._positions = [];
            this._didDecelerationComplete = false;
            this._lastTimeStamp = timeStamp;

            if(this._isDecelerating){
                Animate.stop(this._isDecelerating);
                this._isDecelerating = false;
            }

            if(this._isAnimating){
                Animate.stop(this._isAnimating);
                this._isAnimating = false;
            }
        });

        this.scrollIns.on('end', (timeStamp) => {
            if(this._isDragging){
                this._isDragging = false;

                if(this._isSingleTouch && (timeStamp - this._lastTimeStamp) <= 100){
                    let endPos = this._positions.length - 1;
                    let startPos = endPos;

                    for( var i = endPos; i > 0 && this._positions[i] > (this._lastTimeStamp - 100) ; i -= 2 ){
                        startPos = i;
                    }

                    if(startPos !== endPos){
                        let timeOffset = this._positions[endPos] - this._positions[startPos];
                        let movedTop = this._scrollTop - this._positions[startPos - 1];

                        this._decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
                        let minVelocityToStartDeceleration = 4;

                        if(Math.abs(this._decelerationVelocityY) > minVelocityToStartDeceleration){
                            this.startDeceleration(timeStamp);
                            return;
                        }
                    }
                }
            }

            console.log(this._scrollTop);
            this.scrollingComplete();
            this.select(this.value);
        })
    }

    setDimensions(clientHeight){
        this._clientHeight = clientHeight;

        let itemCount = this.options.data.length;
        //picker区域所能显示的最多的item条数
        let clientItemCount = Math.round(this._clientHeight / this._itemHeight);

        this._minScrollTop = -this._itemHeight * (clientItemCount / 2);
        this._maxScrollTop = this._minScrollTop + itemCount * this._itemHeight - 0.1;
    }

    select(value, animate){
        let children = this._content.children;

        for(let i = 0, len = children.length; i < len; i++){
            if(children[i].dataset.value === value){
                this.selectByIndex(i, animate);
                return;
            }
        }

        self.selectByIndex(0, animate)
    }

    selectByIndex(index, animate){
        if(index < 0 || index > this._content.childElementCount - 1){
            return;
        }

        let scrollTop = this._minScrollTop + index * this._itemHeight;
        this.scrollTo(scrollTop, animate);

        this.selectItem(this._content.children[index]);
    }

    scrollTo(top, animate = true){
        //Todo
        if( this._isDecelerating ){
            Animate.stop(this._isDecelerating);
            this._isDecelerating = false;
        }

        top = Math.round(top / this._itemHeight) * this._itemHeight;
        top = Math.max(Math.min(this._maxScrollTop, top), this._minScrollTop);

        if(top === this._scrollTop || !animate){
            this.publish(top);
            this.scrollingComplete();
            return;
        }
        this.publish(top, 250);
    }

    selectItem(selectedItem){
        let selectedItemClass = this.options.selectedItemClass || 'SP-picker-item-selected';
        let lastSelectedItem = this._content.querySelector('.' + selectedItemClass);

        if(lastSelectedItem){
            lastSelectedItem.classList.remove(selectedItemClass);
        }

        selectedItem.classList.add(selectedItemClass);

        if(this.value !== null){
            this._prevValue = this.value;
        }

        this.value = selectedItem.dataset.value;
    }

    publish(top, duration){
        let wasAnimation = this._isAnimating;
        if(wasAnimation){
            //todo
            Animate.stop(wasAnimation);
            this._isAnimating = false;
        }

        if(duration){
            let oldTop = this._scrollTop;
            let diffTop = top - oldTop;

            console.log(diffTop);

            let step = function(percent){
                this._scrollTop = oldTop + (diffTop * percent);

                this._callback && this._callback(this._scrollTop);
            }.bind(this)

            let verify = function(id){
                return this._isAnimating === id;
            }.bind(this);

            let completed = function(renderedFramesPerSecond, animationId, wasFinished){
                if(animationId === this._isAnimating){
                    this._isAnimating = false;
                }

                if(this._didDecelerationComplete || wasFinished){
                    this.scrollingComplete();
                }
            }.bind(this);

            this._isAnimating = Animate.start(step, verify, completed, duration, wasAnimation ? easeOutCubic : easeInOutCubic);
        }
        else {
            this._scrollTop = top;
            this._callback && this._callback(top);
        }
    }

    scrollingComplete(){
        let index = Math.round((this._scrollTop - this._minScrollTop - this._itemHeight / 2) / this._itemHeight);

        this.selectItem(this._content.children[index]);

        if(this._prevValue !== null && this._prevValue !== this.value){
            this.options.onSelect(this.value);
        }
    }

    startDeceleration(timeStamp){
        this._minDecelerationScrollTop = this._minScrollTop;
        this._maxDecelerationScrollTop = this._maxScrollTop;

        let step = function(percent, now, render){
            this.stepThroughDeceleration(render);
        }.bind(this)

        let minVelocityToKeepDecelerating = 0.5;

        let verify = function(){
            let shouldContinue = Math.abs(this._decelerationVelocityY) >= minVelocityToKeepDecelerating;
            if(!shouldContinue){
                this._didDecelerationComplete = true;
            }
            return shouldContinue;
        }.bind(this);

        let completed = function(){
            this._isDecelerating = false;

            if(this._scrollTop <= this._minScrollTop || this._scrollTop >= this._maxScrollTop){
                this.scrollTo(this._scrollTop);
                return;
            }

            if(this._didDecelerationComplete){
                this.scrollingComplete();
            }
        }.bind(this);

        this._isDecelerating = Animate.start(step, verify, completed);
    }

    stepThroughDeceleration(){
        let scrollTop = this._scrollTop + this._decelerationVelocityY;

        let scrollTopFixed = Math.max(Math.min(this._maxDecelerationScrollTop, scrollTop), this._minDecelerationScrollTop);
        if(scrollTopFixed !== scrollTop){
            scrollTop = scrollTopFixed;
            this._decelerationVelocityY = 0;
        }

        if(Math.abs(this._decelerationVelocityY) <= 1){
            if(Math.abs(scrollTop % this._itemHeight) < 1){
                this._decelerationVelocityY = 0;
            }
        }
        else {
            this._decelerationVelocityY *= 0.95;
        }

        this.publish(scrollTop);
    }
}

export default Picker;
