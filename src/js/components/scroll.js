var utils = require('../utils');
var animationend = require('animationend');
exports.name = 'scroll';
exports.template =
    '<div class="scroll-view" v-el:root>' +
        '<div class="scroll-refresh" :style="rereshTopPx" v-el:refresh><slot name="refresh"></slot></div>' +
        '<div class="scroll-view-content">' +
            '<div class="scroll-view-content-overflow" v-el:content>' +
                '<div class="scroll-view-content-overflow-area" v-el:area>' +
                    '<div>&nbsp;</div>' +
                    '<slot></slot>' +
                    '<div>&nbsp;</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="scroll-more" :style="moreBottomPx" v-el:more><slot name="more"></slot></div>' +
    '</div>';

exports.props = ['refresh', 'loadmore'];

exports.data = function(){
    return {
        refreshTop: 0,
        moreBottom: 0,
        height: 0,
        rootHeight: 0,
        startY: 0,
        startTop: 0,
        moveY: 0,
        offset: 5,
        status: false
    }
}

exports.ready = function(){
    var that = this;
    setTimeout(function(){
        that.refreshTop = that.$els.refresh.clientHeight;
        that.moreBottom = that.$els.more.clientHeight;
        that.height = that.$els.area.clientHeight;
        that.rootHeight = that.$els.root.clientHeight;
        if ( that.refresh == 'on' || that.loadmore == 'on' ){
            utils.on(that.$els.root, 'touchstart', that._touchStart = that.touchStart());
            utils.on(that.$els.root, 'touchmove', that._touchMove = that.touchMove());
            utils.on(that.$els.root, 'touchend', that._touchEnd = that.touchEnd());
        }
        that.$emit('ready');
    });
}

exports.beforeDestroy = function(){
    this._touchStart && utils.off(this.$els.root, 'touchstart', this._touchStart);
    this._touchMove && utils.off(this.$els.root, 'touchmove', this._touchMove);
    this._touchEnd && utils.off(this.$els.root, 'touchend', this._touchEnd);
}

exports.computed = {
    rereshTopPx: function(){
        return 'top:' + (this.refreshTop * -1) + 'px';
    },
    moreBottomPx: function(){
        return 'bottom:' + (this.moreBottom * -1) + 'px';
    }
}

exports.events = {
    refreshprocess: function(y){
        if ( y <= this.refreshTop * 3 ){
            move(this.$els.refresh, y);
            move(this.$els.content, y);
            this.$emit('refreshmove', y, this.refreshTop);
        }
    },
    refreshstart: function(){
        var that = this;
        if ( typeof that.refreshfn === 'function' ){
            if ( this.moveY > this.refreshTop * 2 ){
                that.refreshAnimate(this.refreshTop, function(){
                    that.refreshfn(next);
                });
            }else{
                that.refreshfn(next);
            }
        }else{
            next();
            that.status = false;
            that.windowTouchMoveDisabled = false;
        }

        function next(){
            that.refreshAnimate(0, function(remove){
                that.status = false;
                that.windowTouchMoveDisabled = false;
                remove();
                that.$emit('refreshend');
            });
        }
    },
    refreshback: function(){
        var that = this;
        that.refreshAnimate(0, function(remove){
            that.status = false;
            that.windowTouchMoveDisabled = false;
            remove();
        });
    },
    morestart: function(){
        var that = this;
        if ( typeof that.loadmorefn === 'function' ){
            that.moreAnimate(that.moreBottom * -1, function(){
                that.loadmorefn(next);
            });
        }else{
            that.status = false;
            that.windowTouchMoveDisabled = false;
        }
        function next(){
            that.moreAnimate(0, function(remove){
                that.status = false;
                that.windowTouchMoveDisabled = false;
                remove();
                that.$emit('loadmoreend');
            });
        }
    }
}

exports.methods = {
    touchStart: function(){
        var that = this;
        return function(e){
            if ( that.status || (that.refresh != 'on' && that.loadmore != 'on') ) return;
            that.startY = Y(e);
            that.startTop = that.$els.content.scrollTop;
        }
    },
    touchMove: function(){
        var that = this;
        return function(e){
            if ( that.status || that.refresh != 'on' ) return;
            var y = Y(e);
            that.moveY = y - that.startY - that.startTop;
            if ( that.moveY >= 0 && that.refresh == 'on' ){
                utils.stop(e);
                that.windowTouchMoveDisabled = true;
                that.$emit('refreshprocess', that.moveY);
            }
        }
    },
    touchEnd: function(){
        var that = this;
        return function(){
            if ( that.status ) return;
            if ( that.moveY >= 0 && that.refresh == 'on' ){
                if ( that.moveY >= that.refreshTop * 2 ){
                    that.status = true;
                    that.windowTouchMoveDisabled = true;
                    that.$emit('refreshstart');
                }else{
                    that.status = false;
                    that.windowTouchMoveDisabled = false;
                    that.$emit('refreshback');
                }
            }else if ( that.loadmore == 'on' ){
                if ( that.height <= that.$els.content.scrollTop + that.offset + that.rootHeight ){
                    that.status = true;
                    that.windowTouchMoveDisabled = true;
                    that.$emit('morestart');
                }else{
                    that.status = false;
                    that.windowTouchMoveDisabled = false;
                }
            }
            that.startY = 0;
            that.moveY = 0;
            that.startTop = 0;
        }
    },
    refreshAnimate: function(y, fn){
        var that = this;
        animationend(that.$els.content).then(function(){
            fn(removeClass);
        });
        that.$els.refresh.classList.add('scrolled');
        that.$els.content.classList.add('scrolled');
        move(that.$els.refresh, y);
        move(that.$els.content, y);
        function removeClass(){
            that.$els.refresh.classList.remove('scrolled');
            that.$els.content.classList.remove('scrolled');
        }
    },
    moreAnimate: function(y, fn){
        var that = this;
        animationend(that.$els.content).then(function(){
            fn(removeClass);
        });
        that.$els.more.classList.add('scrolled');
        that.$els.content.classList.add('scrolled');
        move(that.$els.more, y);
        move(that.$els.content, y);
        function removeClass(){
            that.$els.more.classList.remove('scrolled');
            that.$els.content.classList.remove('scrolled');
        }
    },
    onrefresh: function(fn){
        this.refreshfn = fn;
    },
    onloadmore: function(fn){
        this.loadmorefn = fn;
    }
}

function Y(e){
    return e.targetTouches[0].pageY;
}

function move(el, px){
    el.style.webkitTransform = 'translate3d(0,' + px + 'px,0)';
}
