/**
 * JS滚动操作
 * 实时返回手指在当前滚动区域的位移量
 */

export default class Scroll {
    /**
     * @param {Element} el 需要响应滚动的区域元素
     * @param {Function} cb touchMove产生的位移信息的返回
     */
    constructor(vm, el){
        this.vm = vm;
        this.el = el;

        this.init();
    }

    /**
     * 初始化滚动操作
     */
    init() {
        this.bindTouchStart();
        this.bindTouchMove();
        this.bindTouchEnd();
    }

    bindTouchStart() {
        this.el.addEventListener('touchstart', this.__eventEmitterTouchStart = (e) => {
            if (e.target.tagName.match(/input|textarea|select/i)) {
                return
            }
            e.preventDefault();
            this.__doTouchStart(e.touches, e.timeStamp);
        }, false)
    }

    bindTouchMove() {
        this.el.addEventListener('touchmove', this.__eventEmitterTouchMove = (e) => {
            this.__doTouchMove(e.touches, e.timeStamp);
        }, false)
    }

    bindTouchEnd() {
        this.el.addEventListener('touchend', this.__eventEmitterTouchEnd = (e) => {
            this.__doTouchEnd(e.timeStamp)
        }, false)
    }

    __doTouchStart(touches, timeStamp) {
        let position = touchesPosition(touches);
        this.startX = this.lastX = position.x;
        this.startY = this.lastY = position.y;
        this.lastTimeStamp = timeStamp;
        this.vm.$emit('scroll:start', timeStamp);
    }

    __doTouchMove(touches, timeStamp) {
        let position = touchesPosition(touches);
        let result = {
            currentX: position.x,
            currentY: position.y,
            currentTimeStamp: timeStamp,
            shiftX: position.x - this.lastX,
            shiftY: position.y - this.lastY,
            startX: this.startX,
            startY: this.startY
        };
        result.speedX = Math.abs(result.shiftX) / (timeStamp - this.lastTimeStamp);
        result.speedY = Math.abs(result.shiftY) / (timeStamp - this.lastTimeStamp);

        this.lastX = position.x;
        this.lastY = position.y;
        this.lastTimeStamp = timeStamp;

        this.vm.$emit('scroll:move', result);
    }

    __doTouchEnd(timeStamp) {
        this.vm.$emit('scroll:end', timeStamp);
    }

    __destroy(){
        removeEventListener(this.el, 'touchstart', this.__eventEmitterTouchStart);
        removeEventListener(this.el, 'touchmove', this.__eventEmitterTouchMove);
        removeEventListener(this.el, 'touchend', this.__eventEmitterTouchEnd);
    }
}

function removeEventListener(el, event, fn){
    if ( el.removeEventListener ) {
        el.removeEventListener(event, fn);
    } else if ( el.detachEvent ) {
        el.detachEvent("on" + event, fn);
    }
}

function touchesPosition(touches){
    let x1 = touches[0].pageX;
    let y1 = touches[0].pageY;

    if(touches.length > 1){
        x1 = (x1 + touches[1].pageX) / 2;
        y1 = (y1 + touches[1].pageY) / 2;
    }

    return {
        x: x1,
        y: y1
    }
}