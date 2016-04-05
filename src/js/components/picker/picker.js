import * as Animate from './animate';
import Scroll from '../../application/scroll';

export default class PICKER extends Scroll {
    constructor(vm){
        super(vm, vm.$els.component);
        this._clientHeight = this.el.clientHeight;
        this._itemHeight = vm.$els.indicator.clientHeight;
        this.setDimensions();
        
        this._positions = [];
        this._isDragging = this._didDecelerationComplete = this._isAnimating = this._isDecelerating = false;
        this._enableScrollY = false;
        this._lastTimeStamp = null;
        this._scrollTop = 0;
        this._isSingleTouch = true;

        this.select(vm.value, false);
        
        vm.$on('scroll:start', this._doScrollStart.bind(this));
        vm.$on('scroll:move', this._doScrollMove.bind(this));
        vm.$on('scroll:end', this._doScrollEnd.bind(this));
    }

    _destroy(){
        this.vm.$off('scroll:start');
        this.vm.$off('scroll:move');
        this.vm.$off('scroll:end');
        this.__destroy();
    }

    _doScrollStart(timeStamp){
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
    }

    _doScrollMove(moveResult){
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
    }

    _doScrollEnd(timeStamp){
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
        
        this.scrollingComplete();
        this.select(this.value);
    }

    setDimensions(){
        let itemCount = this.vm.data.length;
        let clientItemCount = Math.round(this._clientHeight / this._itemHeight);

        this._minScrollTop = -this._itemHeight * (clientItemCount / 2);
        this._maxScrollTop = this._minScrollTop + itemCount * this._itemHeight - 0.1;
    }
    
    select(index, animate){
        if(index < 0 || index > this.vm.data.length - 1){
            return;
        }

        let scrollTop = this._minScrollTop + index * this._itemHeight;
        this.scrollTo(scrollTop, animate);

        this.selectValue(index);
    }

    move(top){
        this.vm.$els.content.style.webkitTransform = 'translate3d(0, ' + (top * -1) + 'px, 0)';
    }
    
    publish(top, duration){
        let wasAnimation = this._isAnimating;
        if(wasAnimation){
            Animate.stop(wasAnimation);
            this._isAnimating = false;
        }

        if(duration){
            let oldTop = this._scrollTop;
            let diffTop = top - oldTop;

            let step = function(percent){
                this._scrollTop = oldTop + (diffTop * percent);

                this.move(this._scrollTop);
            }.bind(this);

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

            this._isAnimating = Animate.start(step, verify, completed, duration, wasAnimation ? this.easeOutCubic : this.easeInOutCubic);
        }
        else {
            this._scrollTop = top;
            this.move(top);
        }
    }

    scrollTo(top, animate = true){
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

    scrollingComplete(){
        let index = Math.round((this._scrollTop - this._minScrollTop - this._itemHeight / 2) / this._itemHeight);

        this.selectValue(index);
    }
    
    selectValue(index){
        if(this.value !== null){
            this._prevValue = this.value;
        }
        this.value = index;

        if(this._prevValue !== null && this._prevValue !== this.value){
            this.vm.$emit('scroll:selected', this.value);
        }
    }

    startDeceleration(){
        this._minDecelerationScrollTop = this._minScrollTop;
        this._maxDecelerationScrollTop = this._maxScrollTop;

        let step = function(percent, now, render){
            this.stepThroughDeceleration(render);
        }.bind(this);

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

    easeOutCubic(pos){
        return (Math.pow((pos - 1), 3) + 1);
    }

    easeInOutCubic(pos){
        if((pos /= 0.5) < 1){
            return 0.5 * Math.pow(pos, 3);
        }
        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    }
}
