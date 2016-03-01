var directiveRedirect = require('../directives/redirect');
var resource = require('../resource');
var utils = require('../utils');
var next = require('../next');

var windowTouchMoveDisabled = false; // 禁止window的touchmove事件 默认false（可以move）
var windowTouchMoveDisabledEventFunction = null;

exports.created = function(){
    this.$next = new next(function(){
        this.$emit('end');
    }, this);
}
exports.directives = {
    redirect: directiveRedirect
}
exports.filters = {
    fixAnimation: function(cls){
        if ( resource.env.disableAnimation ){ return ''; }
        else{ return cls; }
    }
}
exports.computed = {
    windowTouchMoveDisabled: {
        get: function(){ return !!windowTouchMoveDisabled; },
        set: function(value){
            windowTouchMoveDisabled = !!value;
            if ( !!value ){
                if ( typeof windowTouchMoveDisabledEventFunction != 'function' ){
                    windowTouchMoveDisabledEventFunction = utils.stop;
                    utils.on(window, 'touchmove', windowTouchMoveDisabledEventFunction);
                }
            }else{
                if ( typeof windowTouchMoveDisabledEventFunction !== 'function' ) return;
                utils.off(window, 'touchmove', windowTouchMoveDisabledEventFunction);
                windowTouchMoveDisabledEventFunction = null;
            }
        }
    }
}
exports.methods = {
    $Go: function(i){ history.go(i) },
    $Goback: function(){ history.back(); },
    $GoForward: function(){ history.forward(); }
}
