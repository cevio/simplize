import * as Animate from './animate';

class Rolling {
    constructor() {
        this._isDragging = this._didDecelerationComplete = this._isAnimating = this._isDecelerating = false;

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

    velocity() {

    }

    stop(animateIns) {
        Animate.stop(animateIns);
    }

    publish(startPoint, endPoint, duration, cb, animating){
        
    }

    easeOutCubic(pos){
        
    }

    easeInOutCubic(pos){
        
    }
}

export function stop(animate){
    Animate.stop(animate);
}


export function publish(startPoint, endPoint, duration, cb, animating) {
    let wasAnimation = animating;
    if(wasAnimation){
        stop(wasAnimation);
    }

    if(duration){
        let oldTop = startPoint;
        let diffTop = endPoint - oldTop;

        let step = function(percent){
            cb && cb(oldTop + (diffTop * percent));
        }.bind(this);

        let verify = function(id){
            return true;
        }.bind(this);

        let completed = function(renderedFramesPerSecond, animationId, wasFinished){
            if(wasFinished){
                cb && cb();
            }
        }.bind(this);

        return Animate.start(step, verify, completed, duration, wasAnimation ? easeOutCubic : easeInOutCubic);
    }
    else {
        this._scrollTop = top;
        this.move(top);
    }
}

function easeOutCubic(pos){
    return (Math.pow((pos - 1), 3) + 1);
}

function easeInOutCubic(pos) {
    if((pos /= 0.5) < 1){
        return 0.5 * Math.pow(pos, 3);
    }
    return 0.5 * (Math.pow((pos - 2), 3) + 2);
}