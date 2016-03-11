var utils = require('../utils');
var animationend = require('animationend');
exports.name = 'pop-component-select';
exports.props = ['data', 'value'];
exports.template =
'<div class="ui-select" v-el:root>' +
    '<ul v-el:box>' +
        '<li v-for="item in data.list" @click="click($index)" :class="{active:index==$index,prev:index-1==$index,next:index+1==$index,prevs:index-2==$index,nexts:index+2==$index}">{{item.text}}</li>' +
    '</ul>' +
    '<div class="checked"></div>'+
'</div>';

exports.data = function(){
    return {
        height: 0,
        distence: 0,
        startY:0,
        moveY: 0,
        y:0,
        index: -1,
        a: 0,
        b: 0,
        t: false
    }
}

exports.ready = function(){
    var that = this;
    this.height = this.$els.root.clientHeight / 5;
    utils.on(this.$els.root, 'touchstart', this._touchStart = this.touchStart());
    utils.on(document.body, 'touchmove', this._touchMove = this.touchMove());
    utils.on(document.body, 'touchend', this._touchEnd = this.touchEnd());
    this.index = findIndex(this.data.list, this.data.value);
    utils.nextTick(function(){
        that.$emit('scrollto');
    });
}

exports.methods = {
    touchStart: function(){
        var that = this;
        return function(e){
            that.startY = Y(e);
            that.t = true;
        }
    },
    touchMove: function(){
        var that = this;
        return function(e){
            if ( !that.t ) return;
            utils.stop(e);
            that.y = Y(e);
            that.moveY = that.y - that.startY + that.distence;

            var a = that.height * 2;
            var b = that.height * (that.data.list.length - 3) * -1;

            if ( that.moveY > a ){
                that.moveY = a;
            }
            if ( that.moveY < b ){
                that.moveY = b;
            }

            move(that.$els.box, that.moveY);
            that.index = Math.round(2 - ( that.moveY / that.height ));
        }
    },
    touchEnd: function(){
        var that = this;
        return function(){
            if ( !that.t ) return;
            that.distence = that.moveY;
            that.startY = 0;
            that.moveY = 0;
            that.t = false;
            that.$emit('scrollto');
        }
    },
    click: function(index){
        this.index = index;
        this.$emit('scrollto');
    }
}

exports.events = {
    scrollto: function(){
        if ( this.index < 0 ){
            this.index = 0;
        }
        if ( this.index >= this.data.list.length ){
            this.index = this.data.list.length - 1;
        }
        var p = (2 - this.index) * this.height;
        var that = this;
        animationend(this.$els.box).then(function(){
            utils.removeClass(that.$els.box, 'active');
            that.distence = p;
        });
        utils.addClass(this.$els.box, 'active');
        move(this.$els.box, p);
    },
    get: function(){
        if ( this.index > -1 && this.index < this.data.list.length ){
            this.data.value = this.data.list[this.index].value;
        }
    },
    reset: function(){
        this.$emit('scrollto');
    }
}

exports.beforeDestroy = function(){
    this._touchStart && utils.off(this.$els.root, 'touchstart', this._touchStart);
    this._touchMove && utils.off(this.$els.root, 'touchmove', this._touchMove);
    this._touchEnd && utils.off(this.$els.root, 'touchend', this._touchEnd);
}

function Y(e){
    return e.targetTouches[0].pageY;
}

function move(el, px){
    el.style.webkitTransform = 'translate3d(0,' + px + 'px,0)';
}

function findIndex(list, value){
    for ( var i = 0 ; i < list.length ; i++ ){
        if ( list[i].value == value ){
            return i;
        }
    }
    return -1;
}
