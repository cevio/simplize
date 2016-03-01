var animationend = require('animationend');
var utils = require('../utils');
var keep = require('./session');

module.exports = function(oldbrowser, newBrowser, oldwebview, webview, direction, foo){
    if ( !newBrowser ) return;
    var before, after, canin = true, _in;
    var fixAnimation = webview.env.disableAnimation;

    if ( utils.$type(foo, 'object') ){
        before = foo.before;
        after = foo.after;
    }else if ( typeof foo === 'function' ){
        after = foo;
    }
    var app = newBrowser.$parent;
    var $headbar = newBrowser.$headbar;
    if ( oldbrowser && oldbrowser == newBrowser ){
        $headbar.$emit('before');
    }


    if ( typeof before === 'function' ){
        _in = before.call(webview);
        if ( _in === false ){
            canin = false;
        }
    }

    webview.$emit('beforeload');
    oldwebview && oldwebview.$emit('beforeunload');

    if ( !oldbrowser || oldbrowser != newBrowser ){
        if ( canin ){
            webview.status = true;
            if ( !oldbrowser ){
                webview.$emit('load');
                typeof after === 'function' && after.call(webview);
            }else{
                if ( oldwebview ){
                    oldwebview.$emit('unload');
                }
            }
        }
    }else{
        if ( canin ){
            if ( !fixAnimation ){
                var $direction = app.$history;
                load($headbar, webview, after);
                unload(oldwebview)
                oldwebview.status = false;
                webview.status = true;

                if ( direction != 'history' && direction && $direction != direction ){
                    $direction = direction;
                }

                switch ($direction) {
                    case 'left':
                        oldwebview.direction = webview.direction = 'left';
                        $headbar && $headbar.$emit('left');
                        break;
                    case 'right':
                        oldwebview.direction = webview.direction = 'right';
                        $headbar && $headbar.$emit('right');
                        break;
                    default:
                        oldwebview.direction = webview.direction = 'fade';
                        $headbar && $headbar.$emit('slient');
                }
            }else{
                typeof keep.temp === 'function' && keep.temp();
                oldwebview.status = false;
                webview.status = true;
                $headbar && $headbar.$emit('after');
                webview.$emit('load');
                oldwebview.$emit('unload');
            }
        }
    }
}

function load($headbar, webview, after){
    animationend(webview.$el).then(function(){
        typeof keep.temp === 'function' && keep.temp();
        webview.$emit('load');
        typeof after === 'function' && after.call(webview);
        webview.direction = '';
        $headbar && $headbar.$emit('after');
    });
}
function unload(webview){
    animationend(webview.$el).then(function(){
        webview.direction = '';
        webview.$emit('unload');
    });
}
