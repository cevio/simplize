import * as Animate from './animate';

class Decelerating {
    constructor(currentTop, positions, endTimeStamp, minTop, maxTop, stopCallback) {
        this.stopCallback = stopCallback;
        this._minScrollTop = minTop;
        this._maxScrollTop = maxTop;
        this._positions = positions;
        this._scrollTop = currentTop;
        this._lastTimeStamp = positions[positions.length -1];
        this._itemHeight = 1;
        this._isAnimating = null;
        this.prepare(endTimeStamp);
    }
    
    prepare(timeStamp) {
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

    startDeceleration () {
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

    scrollTo(top, animate = true){
        if( this._isDecelerating ){
            Animate.stop(this._isDecelerating);
            this._isDecelerating = false;
        }
        
        top = Math.max(Math.min(this._maxScrollTop, top), this._minScrollTop);

        if(top === this._scrollTop || !animate){
            this.publish(top);
            this.scrollingComplete();
            return;
        }
        this.publish(top, 250);
    }

    scrollingComplete() {
        this.stopCallback(true);
    }
    
    stopAnimate(animate) {
        Animate.stop(animate);
    }

    publish(top, duration){
        console.trace();
        let wasAnimation = this._isAnimating;
        if(wasAnimation){
            console.log(this._isAnimating);
            Animate.stop(wasAnimation);
            this._isAnimating = false;
        }
        
        if(duration){
            let oldTop = this._scrollTop;
            let diffTop = top - oldTop;

            let step = function(percent){
                this._scrollTop = oldTop + (diffTop * percent);

                this.stopCallback && this.stopCallback(this._scrollTop);
            }.bind(this);

            let verify = function(id){
                console.log(this._isAnimating, id);
                return true;
                //return this._isAnimating === id;
            }.bind(this);

            let completed = function(renderedFramesPerSecond, animationId, wasFinished){
                if(animationId === this._isAnimating){
                    this._isAnimating = false;
                }

                if(this._didDecelerationComplete || wasFinished){
                    this.scrollingComplete();
                }
            }.bind(this);

            this.isAnimating = Animate.start(step, verify, completed, duration, wasAnimation ? easeOutCubic : easeInOutCubic);
            console.log(this.isAnimating)
        }
        else {
            this._scrollTop = top;
            this.stopCallback && this.stopCallback(top);
        }
    }

    stepThroughDeceleration(){
        let scrollTop = this._scrollTop + this._decelerationVelocityY;
        let rate = 0.95;
        if(scrollTop > this._maxScrollTop || scrollTop < this._minScrollTop){
            if(!this._critical){
                this._critical = Math.abs(this._decelerationVelocityY / 2);
            }

            if(Math.abs(this._decelerationVelocityY) < this._critical){
                Animate.stop(this._isAnimating);
                Animate.stop(this._isDecelerating);
                this._decelerationVelocityY = 0;
                return;
            }
            rate *= 0.75;
        }
        else {
            this._critical = null;
        }

        // let scrollTopFixed = Math.max(Math.min(this._maxDecelerationScrollTop, scrollTop), this._minDecelerationScrollTop);
        // if(scrollTopFixed !== scrollTop){
        //     scrollTop = scrollTopFixed;
        //     this._decelerationVelocityY = 0;
        // }

        if(Math.abs(this._decelerationVelocityY) <= 1){
            if(Math.abs(scrollTop % this._itemHeight) < 1){
                this._decelerationVelocityY = 0;
            }
        }
        else {
            this._decelerationVelocityY *= rate;
        }

        this.publish(scrollTop);
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

export function Deceleration(currentTop, positions, endTimeStamp, minTop, maxTop, stopCallback) {
    return new Decelerating(currentTop, positions, endTimeStamp, minTop, maxTop, stopCallback);
}