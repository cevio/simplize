var utils = require('../utils');
var ISCROLL = require('iscroll');

exports.name = 'scroll';
exports.props = ['refresh', 'loadmore'];
exports.events = {};
exports.methods = {};
exports.template =
    '<div class="scroll-view" v-el:root>' +
        '<div class="scroll-refresh"  v-el:refresher><slot name="refresh"></slot></div>' +
        '<div class="scroll-view-area" v-el:scroller>'+
            '<div class="scroll-page" v-el:animate><slot></slot></div>' +
        '</div>' +
        '<div class="scroll-loadmore" v-el:loadmore><slot name="loadmore"></slot></div>' +
    '</div>';

exports.methods.refresherMove = function(y){
    this.$els.refresher.style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
}

exports.methods.loadmoreMove = function(y){
    this.$els.loadmore.style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
}

exports.events['webview:load'] = function(){
    this.$emit('create');
}

exports.events['webview:unload'] = function(){
    this.scroller.destroy();
    utils.off(this.$els.scroller, this._touchstart);
    utils.off(document, this._touchend);
    this.$off('refresh:trigger');
    this.$off('refresh:before');
    this.$off('refresh:progress');
    this.$off('refresh:overflow');
    this.$off('loadmore:trigger');
    this.$off('loadmore:before');
    this.$off('loadmore:progress');
    this.$off('loadmore:overflow');
}

exports.events['refresh:reset'] = function(){
    if ( this.scroller.y > 0 ){
        this.cmd = 9;
        this.scroller.scrollTo(0, 0, 300, this.scroller.options.bounceEasing);
    }else{
        this.cmd = 0;
        this.scroller.enable();
    }
}

exports.events['loadmore:reset'] = function(){
    if ( this.scroller.y < this.scroller.maxNativeScrollY ){
        this.cmd = 8;
        this.scroller.scrollTo(0, this.scroller.maxNativeScrollY, 300, this.scroller.options.bounceEasing);
    }else{
        this.cmd = 0;
        this.scroller.enable();
    }
}

exports.events.create = function(){
    this.canRefresh = this.refresh === 'on';
    this.canLoadmore = this.loadmore === 'on';

    if ( this.canRefresh ) {
        this.refresherHeight = this.$els.refresher.offsetHeight;
        this.$els.refresher.style.top = this.refresherHeight * -1;
    }
    if ( this.canLoadmore ) {
        this.loadmoreHeight = this.$els.loadmore.offsetHeight;
        this.$els.loadmore.style.bottom = this.loadmoreHeight * -1;
    }

    this.cmd = 0;
    this.$emit('build');
}

exports.events.build = function(){
    var that = this;
    var options = {
        mouseWheel: true,
        scrollbars: false
    };

    if ( this.canRefresh ) {
        options.offsetTopY = this.refresherHeight;
    }

    if ( this.canLoadmore ) {
        options.offsetBottomY = this.loadmoreHeight * -1;
    }

    if ( this.canRefresh || this.canLoadmore ){
        options.probeType = 3;
    }

    this.scroller = new ISCROLL(this.$els.scroller, options);

    this.scroller.on('scroll', function(){
        that.y = this.y;
        if ( that.y > 0 && that.canRefresh ){
            that.refresherMove(that.y);
            if ( that.y <= that.refresherHeight ){
                that.$emit('refresh:before');
            }
            else if ( that.y <= that.refresherHeight  * 2  ){
                that.$emit('refresh:progress', that.y / that.refresherHeight - 1 );
            }
            else if ( that.y > that.refresherHeight  * 2 ){
                that.$emit('refresh:overflow');
            }
        }
        else if ( that.y < this.maxNativeScrollY && that.canLoadmore ){
            that.loadmoreMove(that.y - this.maxNativeScrollY);
            if ( that.y >= this.maxScrollY ){
                that.$emit('loadmore:before');
            }
            else if ( that.y >= this.maxNativeScrollY - that.loadmoreHeight * 2 ){
                that.$emit('loadmore:progress', 1 - (that.y - ( this.maxNativeScrollY - that.loadmoreHeight * 2 )) / that.loadmoreHeight );
            }
            else if ( that.y < this.maxNativeScrollY - that.loadmoreHeight * 2 ){
                that.$emit('loadmore:overflow');
            }
        }
        else if ( that.y < 0 && that.y > this.maxNativeScrollY && that.canLoadmore ){
            that.loadmoreMove(0);
        }
    });

    this.scroller.on('scrollEnd', function(){
        if ( !that.canRefresh && !that.canLoadmore ) return;
        if ( that.y < this.maxNativeScrollY && that.cmd != 3 ){
            return that.scroller.scrollTo(0, that.scroller.maxNativeScrollY, 300, that.scroller.options.bounceEasing);
        }
        switch (that.cmd) {
            case 2:
                if ( that._events['refresh:trigger'] && that._events['refresh:trigger'].length ){
                    that.$emit('refresh:trigger');
                }
                else{
                    that.$emit('refresh:reset');
                }
                break;
            case 3:
                if ( that._events['loadmore:trigger'] && that._events['loadmore:trigger'].length ){
                    that.$emit('loadmore:trigger');
                }
                else{
                    that.$emit('loadmore:reset');
                }
                break;
            case 8:
            case 9:
                that.cmd = 0;
                that.scroller.enable();
                break;
        }
    });

    utils.on(this.$els.scroller, 'touchstart', this._touchstart = function(){
        if ( !that.canRefresh && !that.canLoadmore ) return;
        that.cmd = 1; // 确定滚动
    });

    utils.on(document, 'touchend', this._touchend = function(){
        if ( !that.canRefresh && !that.canLoadmore ) return;
        if ( that.cmd = 1 ){
            if ( that.y >= 0 ){
                that.scroller.disable();
                if ( that.y > that.refresherHeight * 2 ){
                    that.cmd = 2; // 刷新
                    that.scroller.scrollTo(0, that.refresherHeight, 300, that.scroller.options.bounceEasing);
                }else{
                    if ( that.scroller.y == 0 ){
                        that.cmd = 0;
                        that.scroller.enable();
                    }else{
                        that.cmd = 9;
                        that.scroller.scrollTo(0, 0, 300, that.scroller.options.bounceEasing);
                    }
                }
            }
            else if ( that.y <= that.scroller.maxNativeScrollY ){
                that.scroller.disable();
                if ( that.y < that.scroller.maxNativeScrollY - that.loadmoreHeight * 2 ){
                    that.cmd = 3; // 加载更多
                    that.scroller.scrollTo(0, that.scroller.maxScrollY, 300, that.scroller.options.bounceEasing);
                }else{
                    if ( that.y === that.scroller.maxNativeScrollY ){
                        that.cmd = 0;
                        that.scroller.enable();
                    }else{
                        that.cmd = 8;
                        that.scroller.scrollTo(0, that.scroller.maxNativeScrollY, 300, that.scroller.options.bounceEasing);
                    }
                }
            }
        }
    });
}
