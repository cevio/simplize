var utils = require('../utils');
var animationend = require('animationend');

exports.name = 'ui-slider';
exports.props = ['progress'];
exports.template = '<div class="ui-slider clearflash" v-el:root><div class="progress active clearflash" v-el:progress></div><div>';

exports.data = function(){
    return {
        width: 0,
        radius: 0,
        isCreated: false,
        startX: 0,
        x: 0,
        moveX: 0,
        distence: 0,
        precent: 0,
        can: false
    }
}

exports.events = {
    "webview:load": function(fn){
        if ( !this.isCreated ){
            var that = this;
            setTimeout(function(){
                that.width = that.$els.root.clientWidth;
                that.radius = that.$els.progress.clientWidth / 2;
                utils.on(that.$els.progress, 'touchstart', that._touchStart = that.touchStart());
                utils.on(document.body, 'touchmove', that._touchMove = that.touchMove());
                utils.on(document.body, 'touchend', that._touchEnd = that.touchEnd());
                that.distence = (that.width - that.radius * 2) * Number(that.progress || 0);
                if ( that.distence > 0 ){
                    animationend(that.$els.progress).then(function(){
                        utils.removeClass(that.$els.progress, 'active');
                    });
                    move(that.$els.progress, that.distence);
                }else{
                    utils.removeClass(that.$els.progress, 'active');
                }
                typeof fn === 'function' && fn.call(that);
                that.isCreated = true;
            });
        }
    },
    "webview:unload": function(){
        this._touchStart && utils.off(this.$els.progress, 'touchstart', this._touchStart);
        this._touchMove && utils.off(this.$els.progress, 'touchmove', this._touchMove);
        this._touchEnd && utils.off(this.$els.progress, 'touchend', this._touchEnd);
    }
}

exports.methods = {
    touchStart: function(){
        var that = this;
        return function(e){
            that.startX = X(e);
            that.can = true;
            utils.stop(e);
        }
    },
    touchMove: function(){
        var that = this;
        return function(e){
            if ( !that.can ) return;
            that.x = X(e);
            that.moveX = that.x - that.startX + that.distence;
            if ( that.moveX >= 0 && that.moveX <= that.width - that.radius * 2 ){
                that.percent = that.moveX / (that.width - that.radius * 2);
                that.$emit('slidermove', that.percent);
            }else{
                if ( that.moveX < 0 ){
                    that.percent = 0;
                    that.moveX = 0;
                }else{
                    that.percent = 1;
                    that.moveX = that.width - that.radius * 2;
                }
            }
            move(that.$els.progress, that.moveX);
            that.progress = that.percent;
        }
    },
    touchEnd: function(){
        var that = this;
        return function(){
            if ( !that.can ) return;
            that.distence = that.moveX;
            that.startX = 0;
            that.x = 0;
            that.moveX = 0;
            that.progress = that.percent;
            that.can = false;
            that.$emit('sliderend', that.percent);
        }
    }
}

function X(e){
    return e.targetTouches[0].pageX;
}

function move(el, px){
    el.style.webkitTransform = 'translate3d(' + px + 'px,0,0)';
}
