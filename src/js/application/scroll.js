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
        this.el = vm.$els[el];

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
        this.el.addEventListener('touchstart', (e) => {
            if (e.target.tagName.match(/input|textarea|select/i)) {
                return
            }
            e.preventDefault();
            this.__doTouchStart(e.touches, e.timeStamp);
        }, false)
    }

    bindTouchMove() {
        this.el.addEventListener('touchmove', (e) => {
            this.__doTouchMove(e.touches, e.timeStamp);
        }, false)
    }

    bindTouchEnd() {
        this.el.addEventListener('touchend', (e) => {
            this.__doTouchEnd(e.timeStamp)
        }, false)
    }

    __doTouchStart(touches, timeStamp) {
        this.startX = this.lastX = touches[0].pageX;
        this.startY = this.lastY = touches[0].pageY;
        this.lastTimeStamp = timeStamp;
        this.vm.$emit('scroll:start', this);
    }

    __doTouchMove(touches, timeStamp) {
        let result = {
            currentX: touches[0].pageX,
            currentY: touches[0].pageY,
            currentTimeStamp: timeStamp,
            shiftX: touches[0].pageX - this.lastX,
            shiftY: touches[0].pageY - this.lastY,
            startX: this.startX,
            startY: this.startY
        };
        result.speedX = Math.abs(result.shiftX) / (timeStamp - this.lastTimeStamp);
        result.speedY = Math.abs(result.shiftY) / (timeStamp - this.lastTimeStamp);

        this.lastX = touches[0].pageX;
        this.lastY = touches[0].pageY;
        this.lastTimeStamp = timeStamp;

        this.vm.$emit('scroll:move', this, result);
    }

    __doTouchEnd(timeStamp) {
        this.vm.$emit('scroll:end', this);
    }
}
