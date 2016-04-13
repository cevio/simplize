import SCROLL from '../../application/scroll';
import * as Animate from '../../application/animate';
import TRANSITIONEND from '../../application/transitionend';

export default class Puller extends SCROLL {
    constructor(el, root){
        super(null, el);
        this.root = root;
        this.positions = [];

        this.y = 0;
        this._y = 0;
        this.ratioSpeedY = 0;
        this._didDecelerationComplete = true;
        this._isDecelerating = null;

        Object.defineProperty(this, 'minScrollTop', {
            get: function(){
                return this.root.offsetHeight - this.el.offsetHeight;
            }
        });
    }

    // 滚动结束
    complete(){
        console.log('exchange')
        this._y = this.y;
    }

    setScrollStart(timeStamp){
        this.positions = [];
    }
    setScrollMove(e){
        this.move(e.currentY - e.startY + this._y);
        if(this.positions.length > 40){
            this.positions.splice(0, 20);
        }
        this.positions.push(this.y, e.currentTimeStamp);
    }
    setScrollEnd(timeStamp){
        this._y = this.y;
        if ( this.prepare() ){
            console.log('in')
            this.startDeceleration();
        }else{
            // 没有惯性
        }
    }

    move(top, time, cb){
        this.y = top;
        if ( time ){
            this.setAnimate(time);
            TRANSITIONEND(this.el).bind(() => {
                TRANSITIONEND(this.el).unbind();
                this._y = top;
                this.stopAnimate();
                typeof cb === 'function' && cb();
            });
        }
        this.el.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
    }

    dmove(top, time){
        this._y = this.y = top;
        this.el.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
    }

    setAnimate(time){ this.el.style.webkitTransition = 'transform ' + time + 'ms ease'; }
    stopAnimate(){ this.el.style.webkitTransition = ''; }

    startDeceleration(){
        let step = function(){
            this.stepThroughDeceleration();
        }.bind(this);

        let minVelocityToKeepDecelerating = 0.5;

        let verify = function(){
            let shouldContinue = Math.abs(this.ratioSpeedY) >= minVelocityToKeepDecelerating;
            if(!shouldContinue){
                this._didDecelerationComplete = true;
            }
            return shouldContinue;
        }.bind(this);

        let completed = function(){
            this._isDecelerating = null;
            if( this.y <= this.minScrollTop || this.y >= 0){
                // 超出边界
                //this.scrollTo(this.y);
                return;
            }

            if(this._didDecelerationComplete){
                this.complete();
            }
        }.bind(this);

        this._isDecelerating = Animate.start(step, verify, completed);
    }

    // 是否存在惯性
    prepare() {
        let endPos = this.positions.length - 1;
        let startPos = endPos;
        let lastTimeStamp = this.positions[endPos];

        for( var i = endPos; i > 0 && this.positions[i] > (lastTimeStamp - 100) ; i -= 2 ){
            startPos = i;
        }

        if(startPos !== endPos){
            let timeOffset = this.positions[endPos] - this.positions[startPos];
            let movedTop = this._y - this.positions[startPos - 1];

            this.ratioSpeedY = movedTop / timeOffset * (1000 / 60);
            let minVelocityToStartDeceleration = 4;

            if( Math.abs(this.ratioSpeedY) > minVelocityToStartDeceleration ){
                return true;
            }
        }

        return false;
    }

    stepThroughDeceleration(){
        let scrollTop = this.y + this.ratioSpeedY;
        let rate = 0.95;
        if( scrollTop > 0 || scrollTop < this.minScrollTop ){

            if( !this._critical ){
                this._critical = Math.abs(this.ratioSpeedY / 1.5);
            }

            if(Math.abs(this.ratioSpeedY) < this._critical){
                this._isDebounce = true;
                Animate.stop(this._isAnimating);
                Animate.stop(this._isDecelerating);
                this.ratioSpeedY = 0;
                const top = this.y > 0 ? 0 : this.minScrollTop;
                this.publish(top, 500);

                return;
            }

            rate *= 0.75;
        }
        else {
            this._critical = 0;
        }

        // let scrollTopFixed = Math.max(Math.min(this._maxDecelerationScrollTop, scrollTop), this._minDecelerationScrollTop);
        // if(scrollTopFixed !== scrollTop){
        //     scrollTop = scrollTopFixed;
        //     this._decelerationVelocityY = 0;
        // }

        if(Math.abs(this.ratioSpeedY) <= 1){
            this.ratioSpeedY = 0;
        }
        else {
            this.ratioSpeedY *= rate;
        }

        this.publish(scrollTop);
    }

    publish(top, duration){
        let wasAnimation = this._isAnimating;
        if( wasAnimation ){
            Animate.stop(wasAnimation);
            this._y = this.y;
            this._isAnimating = null;
        }

        if(duration){
            let oldTop = this.y;
            let diffTop = top - oldTop;

            let step = function(percent){
                this.dmove(oldTop + (diffTop * percent))
            }.bind(this);

            let verify = function(id){
                //return true;
                return this._isAnimating === id;
            }.bind(this);

            let completed = function(renderedFramesPerSecond, animationId, wasFinished){
                if(animationId === this._isAnimating){
                    this._isAnimating = null;
                }

                if(this._didDecelerationComplete || wasFinished){
                    this.complete();
                }
            }.bind(this);

            this._isAnimating = Animate.start(step, verify, completed, duration, wasAnimation ? easeOutCubic : easeInOutCubic);
        }
        else {
            this.dmove(top);
        }
    }
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
