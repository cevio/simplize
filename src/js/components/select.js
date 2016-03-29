var utils = require('../utils');
var animationend = require('animationend');
var iscroll = require('iscroll');
exports.name = 'pop-component-select';
exports.props = ['data', 'value'];
exports.template =
'<div class="ui-select" v-el:root>' +
    '<ul v-el:box>' +
        '<li>&nbsp;</li><li>&nbsp;</li>' +
        '<li v-for="item in data.list" @click="click($index)" :class="{active:index==$index}">{{item.text}}</li>' +
        '<li>&nbsp;</li><li>&nbsp;</li>' +
    '</ul>' +
    '<div class="checked"></div>'+
'</div>';

exports.data = function(){
    return {
        height: 0,
        index: -1
    }
}

exports.ready = function(){
    var that = this;
    this.height = this.$els.root.offsetHeight / 5;
    this.$scroller = new iscroll(this.$els.root, { scrollbars: false, snap: 'li', probeType: 3,
        linear: {
            style: 'cubic-bezier(0,0,1,1)',
            fn: function (k) { return k; }
        }
    });
    this.$scroller.on('scroll', function(e){
        that.index = getIndex(this.y, that.height) - 2;
    });
    this.$scroller.on('scrollEnd', function(){
        that.$emit('get');
        that.$emit('scroll:end');
    });
    this.index = findIndex(this.data.list, this.data.value);
    utils.nextTick(function(){
        that.$emit('scrollto');
    });
}

exports.methods = {
    click: function(index){
        this.index = index;
        this.$emit('scrollto');
    }
}

exports.events = {
    scrollto: function(){
        if ( this.index < 0 ){ this.index = 0; }
        if ( this.index >= this.data.list.length ){ this.index = this.data.list.length - 1; }
        var p = (2 - this.index - 2) * this.height;
        this.$scroller.scrollTo(0, p, 300, iscroll.utils.ease.linear);
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
    this.$scroller.destroy();
    this.$scroller = null;
}

function getIndex(y, h){
    return Math.round(2 - ( y / h ))
}

function findIndex(list, value){
    for ( var i = 0 ; i < list.length ; i++ ){
        if ( list[i].value == value ){
            return i;
        }
    }
    return -1;
}
