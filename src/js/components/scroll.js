var utils = require('../utils');
var animationend = require('animationend');
exports.name = 'scroll';
exports.template =
    '<div class="scroll-view" v-el:root>' +
        '<div class="scroll-refresh scroll-exist" :style="rereshTopPx" v-el:refresh><slot name="refresh"></slot></div>' +
        '<div class="scroll-view-content">' +
            '<div class="scroll-view-content-overflow" v-el:content>' +
                '<div class="scroll-view-content-overflow-area" v-el:area>' +
                    '<slot></slot>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="scroll-more scroll-exist" :style="moreBottomPx" v-el:more><slot name="more"></slot></div>' +
    '</div>';

exports.props = ['refresh', 'loadmore'];

exports.data = function(){
    return {
        isCreated: false,
        refreshTop: 0,
        moreBottom: 0,
        height: 0,
        rootHeight: 0,
        startY: 0,
        startTop: 0,
        moveY: 0,
        offset: 5,
        status: false,
        marginTop: 0,
        marginBottom: 0
    }
}

exports.ready = function(){

}

exports.beforeDestroy = function(){
    this._touchStart && utils.off(this.$els.root, 'touchstart', this._touchStart);
    this._touchMove && utils.off(this.$els.root, 'touchmove', this._touchMove);
    this._touchEnd && utils.off(this.$els.root, 'touchend', this._touchEnd);
    this.$off('refresh');
    this.$off('loadmore');
    this.$off('refreshmove');
    this.$off('refreshend');
    this.$off('loadmoreend');
    this.isCreated = false;
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
    create: function(fn){
        var that = this;
        if ( this.isCreated ) return;
        setTimeout(function(){

            if ( that.loadmore == 'on' ){
                resolveTagMarginTop(that.$els.area.firstChild, that);
                resolveTagMarginBottom(that.$els.area.lastChild, that);
            }

            that.refreshTop = that.$els.refresh.clientHeight;
            that.moreBottom = that.$els.more.clientHeight;
            that.height = that.$els.area.clientHeight;
            that.rootHeight = that.$els.root.clientHeight;

            if ( that.refresh == 'on' || that.loadmore == 'on' ){
                utils.on(that.$els.root, 'touchstart', that._touchStart = that.touchStart());
                utils.on(that.$els.root, 'touchmove', that._touchMove = that.touchMove());
                utils.on(that.$els.root, 'touchend', that._touchEnd = that.touchEnd());
            }
            that.isCreated = true;

            utils.removeClass(that.$els.refresh, 'scroll-exist');
            utils.removeClass(that.$els.more, 'scroll-exist');

            typeof fn === 'function' && fn.call(that);
        });
    },
    refreshprocess: function(y){
        if ( y <= this.refreshTop * 3 ){
            move(this.$els.refresh, y);
            move(this.$els.content, y);
            this.$emit('refreshmove', y, this.refreshTop);
        }
    },
    refreshstart: function(){
        var that = this;
        if ( that._events.refresh && that._events.refresh.length ){
            if ( this.moveY > this.refreshTop * 2 ){
                that.refreshAnimate(this.refreshTop, function(){
                    that.$emit('refresh', next);
                });
            }else{
                that.$emit('refresh', next);
            }
        }else{
            next();
            that.status = false;
            utils.windowTouchMoveDisabled(false);
        }

        function next(){
            that.refreshAnimate(0, function(remove){
                that.status = false;
                utils.windowTouchMoveDisabled(false);
                remove();
                that.$emit('refreshend');
            });
        }
    },
    refreshback: function(){
        var that = this;
        that.refreshAnimate(0, function(remove){
            that.status = false;
            utils.windowTouchMoveDisabled(false);
            remove();
        });
    },
    morestart: function(){
        var that = this;
        if ( that._events.loadmore && that._events.loadmore.length ){
            that.moreAnimate(that.moreBottom * -1, function(){
                that.$emit('loadmore', next);
            });
        }else{
            that.status = false;
            utils.windowTouchMoveDisabled(false);
        }
        function next(){
            that.moreAnimate(0, function(remove){
                that.status = false;
                utils.windowTouchMoveDisabled(false);
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
                if ( !utils.windowTouchMoveDisabledStatus ){
                    utils.windowTouchMoveDisabled(true);
                }
                that.$emit('refreshprocess', that.moveY);
            }else{
                if ( utils.windowTouchMoveDisabledStatus ){
                    utils.windowTouchMoveDisabled(false);
                }
            }
        }
    },
    touchEnd: function(){
        var that = this;
        return function(){
            if ( that.status ) return;
            if ( that.moveY > 0 && that.refresh == 'on' ){
                if ( that.moveY >= that.refreshTop * 2 ){
                    that.status = true;
                    utils.windowTouchMoveDisabled(true);
                    that.$emit('refreshstart');
                }else{
                    that.status = false;
                    utils.windowTouchMoveDisabled(false);
                    that.$emit('refreshback');
                }
            }else if ( that.moveY < 0 && that.loadmore == 'on' ){
                if ( that.height + that.marginTop + that.marginBottom <= that.$els.content.scrollTop + that.offset * that.$root.env.viewScale + that.rootHeight ){
                    that.status = true;
                    utils.windowTouchMoveDisabled(true);
                    that.$emit('morestart');
                }else{
                    that.status = false;
                    utils.windowTouchMoveDisabled(false);
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
        that.$els.refresh.classList.add('active');
        that.$els.content.classList.add('active');
        move(that.$els.refresh, y);
        move(that.$els.content, y);
        function removeClass(){
            that.$els.refresh.classList.remove('active');
            that.$els.content.classList.remove('active');
        }
    },
    moreAnimate: function(y, fn){
        var that = this;
        animationend(that.$els.content).then(function(){
            fn(removeClass);
        });
        that.$els.more.classList.add('active');
        that.$els.content.classList.add('active');
        move(that.$els.more, y);
        move(that.$els.content, y);
        function removeClass(){
            that.$els.more.classList.remove('active');
            that.$els.content.classList.remove('active');
        }
    }
}

function Y(e){
    return e.targetTouches[0].pageY;
}

function move(el, px){
    el.style.webkitTransform = 'translate3d(0,' + px + 'px,0)';
}

function resolveTagMarginTop(el, that){
    if ( !el ) return;
    var type = el.nodeType;
    if ( type == 3 ){
        resolveTagMarginTop(el.nextSibling, that);
    }else if ( type === 1 ){
        var marginTop = Number(utils.style(el, 'marginTop').replace('px', ''));
        if ( marginTop > that.marginTop ){
            that.marginTop = marginTop;
        }
        resolveTagMarginTop(el.firstChild, that);
    }
}

function resolveTagMarginBottom(el, that){
    if ( !el ) return;
    var type = el.nodeType;
    if ( type == 3 ){
        resolveTagMarginBottom(el.previousSibling, that);
    }else if ( type === 1 ){
        var marginTop = Number(utils.style(el, 'marginBottom').replace('px', ''));
        if ( marginTop > that.marginBottom ){
            that.marginBottom = marginTop;
        }
        resolveTagMarginBottom(el.lastChild,that);
    }
}
