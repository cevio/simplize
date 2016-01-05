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

// module exports
// return soyie context
module.exports = Soyie;

/**
 * soyie constructor
 * new soyie(element)
 * [soyie].caseSensitive 是否区分大小写 default false
 */
function Soyie(el){
    var that = this;
    this.data = { browsers: [], hide: false, actived: 'actived', unactived: '' };
    this.url = null;
    this.el = _.query(el);
    this.caseSensitive = false;
    this.req = new request();
    this.res = new response();
    this.req.res = this.res;
    this.res.req = this.req;
    this.req.app = this.res.app = this;
    this.browsers = {};
    this.looser = { sensitive: this.caseSensitive, strict: false, end: false };
    this.strict = { sensitive: this.caseSensitive, strict: true, end: true };
    this.next = new next(function(){ that.emit('end'); });
    this.current = null;
    this.oldBrowser = null;
    this.unactived = [];
    this.isReffer = false;
    defineSoyieDebugModel(this);
    defineCurrentBrowser(this);
    Vue.util.addClass(this.el, 'webapp');
    this.req.init(true);
    Object.defineProperty(this, 'hideToolbar', {
        get: function(){ return this.data.hide; },
        set: function(value){ this.data.hide = !!value; }
    });
}

// bind Vue on soyie
// use soyie.Vue
Soyie.Vue = Vue;
Soyie.ready = function(fn){
    _.osClasses = _.osClass();
    document.querySelector('html').setAttribute('class', _.osClasses.join(' '));
    domReady(fn);
};
Soyie.setViewPort = function(base, scalable){
    var view = document.querySelector('meta[name=viewport]');
    var bodyWidth = document.body.clientWidth;
    var percent = (bodyWidth / base).toFixed(2);
    var string = 'width=device-width, ' +
                'initial-scale=' + percent + ', ' +
                'maximum-scale=' + percent + ', ' +
                'minimum-scale=' + percent + ', ' +
                'user-scalable=' + (scalable ? 'yes': 'no');

    if ( !view ){
        view = document.createElement('meta');
        document.querySelector('head').appendChild(view);
        view.setAttribute('name', 'viewport');
    }

    view.setAttribute('content', string);
}

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
    this.browsers[browserify.uid] = browserify;
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
    var browsers = this.browsers;
    var keys = Object.keys(browsers);
    var i = keys.length;
    while (i--) {
        var el = _.wrapBrowser(
            browsers[keys[i]].$name,
            browsers[keys[i]].createWebviews()
        );
        this.el.appendChild(el);
        this.browsers[keys[i]].$el = el;
        this.browsers[keys[i]].init();
    }

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
            this.current = br;
            var keys = Object.keys(this.browsers);
            var i = keys.length;
            var lefts = [];
            while (i--){
                if ( this.browsers[keys[i]] !== br ){
                    lefts.push(this.browsers[keys[i]]);
                }
            }
            this.unactived = lefts;
        }
    });
}
