var utils = require('../utils');
var animationend = require('animationend');
exports.name = 'pop-component-select';
exports.props = ['data', 'value'];
exports.template =
'<div class="ui-select" v-el:root>' +
    '<ul v-el:box>' +
        '<li v-for="item in data.list" @click="click($index)" :class={active:index===$index}>{{item.text}}</li>' +
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
        b: 0
    }
}

exports.ready = function(){
    var that = this;
    this.height = this.$els.root.clientHeight / 5;
    utils.on(this.$els.root, 'touchstart', this._touchStart = this.touchStart());
    utils.on(this.$els.root, 'touchmove', this._touchMove = this.touchMove());
    utils.on(this.$els.root, 'touchend', this._touchEnd = this.touchEnd());
    this.index = findIndex(this.data.list, this.data.value);
    this.a = this.height * 2;
    this.b = this.height * (that.data.list.length - 3) * -1;
    console.log(this.a, this.b)
    utils.nextTick(function(){
        that.$emit('scrollto');
    });
}

exports.methods = {
    touchStart: function(){
        var that = this;
        return function(e){
            that.startY = Y(e);
        }
    },
    touchMove: function(){
        var that = this;
        return function(e){
            utils.stop(e);
            that.y = Y(e);
            that.moveY = that.y - that.startY + that.distence;

            if ( that.moveY > that.a ){
                that.moveY = that.a;
            }
            if ( that.moveY < that.b ){
                that.moveY = that.b;
            }

            move(that.$els.box, that.moveY);
            that.index = Math.round(2 - ( that.moveY / that.height ));
        }
    },
    touchEnd: function(){
        var that = this;
        return function(){
            that.distence = that.moveY;
            that.startY = 0;
            that.moveY = 0;
            //that.index = Math.round(2 - ( that.distence / that.height ));
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
