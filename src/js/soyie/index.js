/**
 * :> 模块依赖
 * @author: evio@vip.qq.com
 * @time: 2016/01/01
 */
var _ = require('../utils');
var Vue = require('vue');
var Browser = require('./browser');
var layer = require('./layer');
var next = require('./next');
var domReady = require('domready');
var EventEmitter = require('events').EventEmitter;
var slice = Array.prototype.slice;
var tostr = Object.prototype.toString;
var request = require('./request');
var response = require('./response');
var componentToolbar = require('../components/toolbar');
var viewport = require('./viewport');
var animationend = require('animationend');
var ajax = require('./ajax');
var cookie = require('./cookie');
var Promise = require('es6-promise').Promise;
var querystring = require('querystrings');
var PathToRegExp = require('path-to-regexp');

// module exports
// return soyie context
module.exports = Soyie;

/**
 * soyie constructor
 * new soyie(element)
 * [soyie].caseSensitive 是否区分大小写 default false
 */
function Soyie(el, options){
    var that = this;
    this.data = Vue.util.extend({ browsers: [], hide: false, actived: 'actived', unactived: '' }, options || {});
    this.url = null;
    this.el = _.query(el);
    this.caseSensitive = false;
    this.constructor = Soyie;
    this.req = new request();
    this.res = new response();
    this.req.res = this.res;
    this.res.req = this.req;
    this.req.app = this.res.app = this;
    this.browsers = [];
    this.looser = { sensitive: this.caseSensitive, strict: false, end: false };
    this.strict = { sensitive: this.caseSensitive, strict: true, end: true };
    this.next = new next(function(){ that.emit('end'); }, this);
    this.current = null;
    this.oldBrowser = null;
    this.unactived = [];
    this.isReffer = false;
    defineSoyieDebugModel(this);
    defineCurrentBrowser(this);
    defineToolbarStatus(this);
    Vue.util.addClass(this.el, 'webapp');
    this.req.init(true);
}

_.osClasses = _.osClass(Soyie);
// bind Vue on soyie
// use soyie.Vue
Soyie.Vue = Vue;
Soyie.animationend = animationend;
Soyie.viewPort = viewport;
Soyie.ajax = ajax;
Soyie.cookie = cookie;
Soyie.Promise = Promise;
Soyie.EventEmitter = EventEmitter;
Soyie.querystring = querystring;
Soyie.PathToRegExp = PathToRegExp;
Soyie.next = next;
Soyie.viewport = viewport;
Soyie.Layer = layer;
Soyie.util = _;

Soyie.ready = function(fn){
    var _windowTouchMoveDisabled;
    Object.defineProperty(Soyie, 'windowTouchMoveDisabled', {
        get: function(){ return _windowTouchMoveDisabled; },
        set: function(value){
            if ( _windowTouchMoveDisabled != value ){
                _windowTouchMoveDisabled = !!value;
                if ( _windowTouchMoveDisabled ){
                    Vue.util.on(window, 'touchmove', windowTouchMoveDisabled);
                }else{
                    try{ Vue.util.off(window, 'touchmove', windowTouchMoveDisabled); }catch(e){}
                }
            }
        }
    });
    Soyie.windowTouchMoveDisabled = false;
    domReady(fn);
};

// 为soyie绑定事件机制
// 使用nodejs原型事件机制
Soyie.prototype = Object.create(EventEmitter.prototype);

/**
 * soyie初始化
 * 将模板解析到我们约定的对象标签中
 * 创建新的app模板
 * 绑定hashchange监听
 */
Soyie.prototype.init = function(){
    this.createBrowsers();
    this.hashChange();
}

/**
 * 浏览器模型路由添加功能
 * @param method 定义方法名为browser
 * @param path  对应的路由表达式
 * @param opts 配置
 * @param fn 回调函数
 */
Soyie.prototype.push = function(method, path, opts, fn){
    var Layer = new layer(method, path, opts, fn);
    var that = this;
    this.next.use(function(next){
        that.req.params = {};
        that.req.$scope = null;
        that.req.$head = null;
        if ( Layer.match(that.url) ){
            var distURL = that.url.replace(Layer.path, '') || '/';
            if ( !/^\//.test(distURL) ) distURL = '/' + distURL;
            that.req.params = Layer.params || {};
            return Layer.handle(distURL, that.req, that.res, next);
        }
        next();
    });
    return this;
}

/**
 * 创建一个新的浏览器对象
 * @param options 配置参数
 * @returns {Browser|exports|module.exports}
 */
Soyie.prototype.browser = function(options){
    return new Browser(this, options || {});
}

/**
 * 匹配当前地址对应的浏览器对象
 * 进入中间件队列
 * @param url
 */
Soyie.prototype.match = function(url){
    this.url = url;
    this.next.run();
}

/**
 * 绑定浏览器对象对应的路由表达式
 * @param path 表达式
 * @param browserify 浏览器对象
 * @returns {Soyie}
 */
Soyie.prototype.use = function(path, browserify){
    if ( !browserify ){
        browserify = path;
        path = '/';
    }
    this.push(
        'browser',
        path || '/',
        this.looser,
        browserify.watch.bind(browserify)
    );
    this.browsers.push(browserify);
    return this;
}

/**
 * 初始化soyie
 * 监听soyie事件队列
 */
Soyie.prototype.listen = function(){
    this.init();
    this.match(this.req.path);
}

/**
 * 创建浏览器模板实例方法
 * 同时初始化浏览器
 */
Soyie.prototype.createBrowsers = function(){
    var that = this;
    this.browsers.forEach(function(browser){
        var el = _.wrapBrowser( browser.$name, browser.createWebviews() );
        that.el.appendChild(el);
        browser.$el = el;
        browser.init();
    });

    // toolbar config
    var toolbar = document.createElement('toolbar');
    var toolbarComponentExtendtions = componentToolbar(this);
    toolbarComponentExtendtions.el = toolbar;
    if ( this.$toolbarTemplate ){
        toolbarComponentExtendtions.template = this.$toolbarTemplate;
    }
    toolbarComponentExtendtions.data = this.data;
    toolbarComponentExtendtions.methods = toolbarComponentExtendtions.methods || {};
    toolbarComponentExtendtions.filters = toolbarComponentExtendtions.filters || {};
    toolbarComponentExtendtions.methods.redirect = function(value){ that.res.redirect(value); }
    toolbarComponentExtendtions.filters.add = function(fn, value){
        return function(){
            fn(value)
        }
    }

    this.el.appendChild(toolbar);
    this.$toolbar = new Vue(toolbarComponentExtendtions);
    this.$toolbar.$watch('hide', function(newValue, oldValue){
        if ( newValue != oldValue ){
            that.browsers.forEach(function(browser){
                var webviews = browser.webviews;
                var keys = Object.keys(webviews);
                var i = keys.length;
                while ( i-- ) {
                    webviews[keys[i]].vm.toobarShow = !newValue;
                }
            });
        }
    });
    this.data.browsers.forEach(function(browser, index){
        that.$toolbar.$watch('browsers[' + index + '].actived', function(newValue, oldVlaue){
            that.changeToolbar(browser, index, newValue, oldVlaue);
        });
    });

    // web frame
    var webframe = document.createElement('div');
    var webframes = {};
    this.el.appendChild(webframe);
    Vue.util.addClass(webframe, 'webframe');
    webframe.innerHTML = _.webframeHTML;
    webframes.el = webframe;
    webframes.methods = {
        back: function(){
            webframes.data.status = false;
            webframes.data.left = { icon: '<i class="icon icon-back"></i>', value: '', fn: webframes.methods.back };
            webframes.data.right = { icon: '<i class="icon icon-refresh"></i>', value: '', fn: webframes.methods.refresh };
            webframes.data.center = { value: '新窗口', fn: _.noop };
        },
        refresh: function(){
            webframe.querySelector('iframe').src = webframes.data.src;
        }
    }
    webframes.data = {
        status: false,
        src: '',
        left:   { icon: '<i class="icon icon-back"></i>', value: '', fn: webframes.methods.back },
        right:  { icon: '<i class="icon icon-refresh"></i>', value: '', fn: webframes.methods.refresh },
        center: { value: '新窗口', fn: _.noop }
    }

    this.$frame = new Vue(webframes);
}

Soyie.prototype.changeToolbar = function(browser, index, newValue, oldVlaue){
    this.emit('browserchange', browser, index, newValue, oldVlaue);
}

/**
 * 绑定hashchange事件
 * 无论什么方式,只要改变了hash
 * 都会触发该方法
 * 进入soyie中间件机制
 */
Soyie.prototype.hashChange = function(){
    var that = this;
    Vue.util.on(window, 'hashchange', function(){
        that.req.init();
        that.match(that.req.path);
    });
}

Soyie.prototype.openWebView = function(url, title){
    this.$frame.status = true;
    this.$frame.src = url;
    if ( title ){
        this.$frame.center.value = title;
    }
    return this.$frame;
}

/**
 * 定义soyie调试模式方法
 * @param soyie
 */
function defineSoyieDebugModel(soyie){
    Object.defineProperty(soyie, 'debug', {
        get: function(){ return Vue.config.debug; },
        set: function(debug){
            Vue.config.debug = debug;
            Vue.config.silent = !debug;
        }
    });
}

/**
 * 定义soyie当前浏览器对象方法的Getter与setter
 * @param soyie
 */
function defineCurrentBrowser(soyie){
    Object.defineProperty(soyie, '$current', {
        get: function(){ return this.current; },
        set: function(br){
            var lefts = [];
            this.current = br;
            this.browsers.forEach(function(browser){
                if ( browser !== br ){
                    lefts.push(browser);
                }
            });
            this.unactived = lefts;
        }
    });
}


function defineToolbarStatus(soyie){
    Object.defineProperty(soyie, 'hideToolbar', {
        get: function(){ return this.data.hide; },
        set: function(value){
            this.data.hide = !!value; //webviewShowToolbar
        }
    });
}

function windowTouchMoveDisabled(e){
    e.preventDefault();
}
