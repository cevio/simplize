import * as Animate from './animate';
import Scroll from '../../application/scroll';

export default class PICKER extends Scroll {
    constructor(vm){
        super(vm, vm.$els.component);
        this._clientHeight = this.el.clientHeight;
        this._itemHeight = vm.$els.indicator.clientHeight;
        this.setDimensions();
        vm.$on('scroll:start', this._doScrollStart());
        vm.$on('scroll:move', this._doScrollMove());
        vm.$on('scroll:end', this._doScrollEnd());
    }

    _destroy(){
        this.vm.$off('scroll:start');
        this.vm.$off('scroll:move');
        this.vm.$off('scroll:end');
        this.__destroy();
    }

    _doScrollStart(){
        var picker = this;
        return function(){}
    }

    _doScrollMove(){
        var picker = this;
        return function(e){

        }
    }

    _doScrollEnd(){
        var picker = this;
        return function(){}
    }

    setDimensions(){
        let itemCount = this.vm.data.length;
        let clientItemCount = Math.round(this._clientHeight / this._itemHeight);

        this._minScrollTop = -this._itemHeight * (clientItemCount / 2);
        this._maxScrollTop = this._minScrollTop + itemCount * this._itemHeight - 0.1;
    }

    move(top){
        this.vm.$els.content.style.webkitTransform = 'translate3d(0, ' + (top * -1) + 'px, 0)';
    }
}
