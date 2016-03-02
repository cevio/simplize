var animationend = require('animationend');
var utils = require('../utils');
var keep = require('./session');

module.exports = function(oldbrowser, newBrowser, oldwebview, webview, direction, foo){
    if ( !newBrowser ) return;

    var fixAnimation = webview.env.disableAnimation;
    var app = newBrowser.$parent;
    var $headbar = newBrowser.$headbar;
    var $direction = app.$history;
    var before,
        after,
        exchangeWithAnimation = !fixAnimation, // 是否使用动画过度
        exchange = !!oldbrowser && oldbrowser == newBrowser; // 是否同一层browser之间webview切换

    /**
     *  判断broser之间的切换是否需要动画
     *  如果旧的browser不存在 就不需要动画
     */
    if ( exchangeWithAnimation && !oldbrowser ) exchangeWithAnimation = false;
    /**
     *  如果不通browser之间切换
     *  也不需要动画
     */
    if ( exchangeWithAnimation && oldbrowser != newBrowser ) exchangeWithAnimation = false;

    /**
     *  before 进入webview前执行的方法
     *  after  webview加载完毕后执行的方法
     */
    if ( utils.$type(foo, 'object') ){
        before = foo.before;
        after = foo.after;
    } else if ( typeof foo === 'function' ) { after = foo; }

    /**
     *  判断动画方向
     *  如果在exchangeWithAnimation＝=true情况下才具有方向
     */
    if ( !exchangeWithAnimation ){ $direction = ''; }
    else {
        // 如果不是根据history切换动画
        // 同时默认切换不相同
        if ( direction != 'history' && direction && $direction != direction ){
            $direction = direction;
        }
    }

    $headbar && $headbar.$emit('before');

    /**
     *  开始执行before方法
     *  可能会涉及到headbar和toolbar之间状态的切换
     *  引起我们必须滞后加载页面动画
     */
    typeof before === 'function' && before.call(webview);

    /**
     *  如果不使用动画切换
     *  直接切换
     *  同时退出
     */
    if ( !exchangeWithAnimation ){
        return normalExchange(webview, oldwebview, after);
    }

    utils.nextTick(function(){
        headbarExchange($headbar, $direction);
        webviewExchange(webview, oldwebview, $direction, after);
    });
}

function headbarExchange($headbar, $direction){
    if ( $headbar ){
        $headbar.$emit($direction || 'slient');
        $headbar.$emit('run');
    }
}

function webviewExchange(webview, oldwebview, $direction, after, fn){
    webview.$emit('beforeload');
    oldwebview && oldwebview.$emit('beforeunload');
    load(webview, after, fn);
    unload(oldwebview);
    oldwebview.status = false;
    webview.status = true;
    oldwebview.direction = webview.direction = $direction;
}

function normalExchange(webview, oldwebview, after){
    webview.$emit('beforeload');
    oldwebview && oldwebview.$emit('beforeunload');
    webview.status = true;
    utils.nextTick(function(){
        typeof keep.temp === 'function' && keep.temp();
        webview.$emit('load');
        oldwebview && oldwebview.$emit('unload');
        typeof after === 'function' && after.call(webview);
    });
}

function load(webview, after, fn){
    animationend(webview.$el).then(function(){
        typeof keep.temp === 'function' && keep.temp();
        webview.$emit('load');
        typeof after === 'function' && after.call(webview);
        typeof fn === 'function' && fn();
        console.log('webview load')
    });
}
function unload(webview){
    animationend(webview.$el).then(function(){
        webview.$emit('unload');
    });
}

/*
if ( oldbrowser && oldbrowser == newBrowser ){
    $headbar.$emit('before');
}

typeof before === 'function' && before.call(webview);

webview.$emit('beforeload');
oldwebview && oldwebview.$emit('beforeunload');

if ( !oldbrowser || oldbrowser != newBrowser ){
    webview.status = true;
    if ( !oldbrowser ){
        webview.$emit('load');
        typeof after === 'function' && after.call(webview);
    }else{
        if ( oldwebview ){
            oldwebview.$emit('unload');
        }
    }
}else{
    if ( !fixAnimation ){
        var $direction = app.$history;
        load($headbar, webview, after);
        unload(oldwebview);
        oldwebview.status = false;
        webview.status = true;

        if ( direction != 'history' && direction && $direction != direction ){
            $direction = direction;
        }

        switch ($direction) {
            case 'left':
                $headbar && $headbar.$emit('left');
                oldwebview.direction = webview.direction = 'left';
                break;
            case 'right':
                $headbar && $headbar.$emit('right');
                oldwebview.direction = webview.direction = 'right';
                break;
            default:
                $headbar && $headbar.$emit('slient');
                oldwebview.direction = webview.direction = 'fade';
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
*/
