var animationend = require('animationend');
var utils = require('../utils');
var keep = require('./session');

module.exports = function(oldbrowser, newBrowser, oldwebview, webview, direction, foo){
    if ( !newBrowser ) return;

    var fixAnimation = webview.env.disableAnimation;
    var app = newBrowser.$parent;
    var $toolbar = app.$toolbar;
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
    $toolbar && $toolbar.$emit('before');

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
        /**
         *  如果headbar的初始值为false
         *  那么直接销毁headbar
         */
        !$headbar.status && $headbar.$emit('destroy');

        /**
         *  如果toolbar的初始值为false
         *  那么直接销毁toolbar
         */
        !$toolbar.status && $toolbar.$emit('destroy');

        /**
         *  如果禁用动画
         *  需要等待dom更新后触发显示方法
         */
        if ( fixAnimation ){
            return utils.nextTick(function(){
                normalExchange(webview, oldwebview, $toolbar, after);
            });
        }else{
            return normalExchange(webview, oldwebview, $toolbar, after);
        }
    }

    /**
     *  在使用动画状态的时候
     *  监听动画完成
     *  然后触发方法
     */
    utils.nextTick(function(){
        headbarExchange($headbar, $direction);
        toolbarExchange($toolbar, $direction);
        webviewExchange(webview, oldwebview, $direction, after);
    });
}

/**
 *  头部触发
 */
function headbarExchange($headbar, $direction){
    if ( $headbar ){
        $headbar.$emit($direction || 'slient');
        $headbar.$emit('run');
    }
}

/**
 *  工具条触发
 */
function toolbarExchange($toolbar, $direction){
    if ( $toolbar ){
        $toolbar.$emit($direction || 'slient');
        $toolbar.$emit('run');
    }
}

/**
 *  webview切换触发
 */
function webviewExchange(webview, oldwebview, $direction, after, fn){
    webview.$emit('beforeload');
    oldwebview && oldwebview.$emit('beforeunload');
    load(webview, after, fn);
    unload(oldwebview);
    oldwebview.status = false;
    webview.status = true;
    oldwebview.direction = webview.direction = $direction;
}

/**
 *  不使用动画触发方式
 */
function normalExchange(webview, oldwebview, $toolbar, after){
    webview.$emit('beforeload');
    oldwebview && oldwebview.$emit('beforeunload');
    webview.status = true;
    oldwebview && (oldwebview.status = false);
    toolbarExchange($toolbar, 'normal');
    utils.nextTick(function(){
        typeof keep.temp === 'function' && keep.temp();
        webview.$emit('load');
        oldwebview && oldwebview.$emit('unload');
        typeof after === 'function' && after.call(webview);
    });
}

/**
 *  监听webview进入动画
 */
function load(webview, after, fn){
    animationend(webview.$el).then(function(){
        typeof keep.temp === 'function' && keep.temp();
        webview.$emit('load');
        typeof after === 'function' && after.call(webview);
        typeof fn === 'function' && fn();
    });
}

/**
 *  监听webview离开动画
 */
function unload(webview){
    animationend(webview.$el).then(function(){
        webview.$emit('unload');
    });
}
