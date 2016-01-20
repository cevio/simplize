var _ = require('../utils');
var Vue = require('vue');
var next = require('./next');
var layer = require('./layer');
var EventEmitter = require('events').EventEmitter;
var componentWebview = require('../components/webview');
var componentNavgation = require('../components/navgation');
var directiveHref = require('../directives/href');
var ownWebview = require('./webview');
var addClass = Vue.util.addClass;
var removeClass = Vue.util.removeClass;
var _uid = 0;

module.exports = Browser;

function Browser(context, options){
    var that = this;
    this._options = options || {};
    this.uid = _uid++;
    this._soyie = context;
    this.url =
    this.cb = null;
    this.$data = {};
    this.$head = Vue.util.extend(_.headData(), options.$head || {});
    this.webviews = {};
    this.components = {};
    this.directives = {};
    this.current = null;
    this.next = new next(function(){
        typeof that.cb === 'function' &&
        that.cb();
    });
    defineGetBrowserName(this);
    defineBrowserActiveStatus(this);
    defineToolbar(this);
}

Browser.prototype = Object.create(EventEmitter.prototype);

Browser.prototype.init = function(){
    var that = this;
    var components = Vue.util.extend({
        "webview": componentWebview(this),
        "navgation": componentNavgation(this)
    }, this.components);
    var directives = Vue.util.extend({
        "href": directiveHref(this)
    }, this.directives);
    var options = this._options;
    options.el = this.$el;
    options.name = options.browserName || 'browser';
    options.data = this.$data;
    options.components = Vue.util.extend(options.components || {}, components);
    options.directives = Vue.util.extend(options.directives || {}, directives);
    this.Vue = new Vue(options);
}

Browser.prototype.watch = function(url, req, res, done){
    this.req = req;
    this.res = res;
    this.url = url;
    this.cb = done;
    this.next.run();
}

Browser.prototype.push = function(method, path, opts, fn){
    var Layer = new layer(method, path, opts, fn);
    var that = this;
    this.next.use(function(next){
        that.req.$scope = null;
        that.req.$head = null;
        if ( Layer.match(that.url) ){
            var done = next;
            if ( Layer.method === 'active' ) done = undefined;
            Vue.util.extend(that.req.params, Layer.params || {});
            that.req.$scope = that.Vue;
            that.req.$head = that.$head;
            that._soyie.$current = that;
            that.toolbarDigest();
            return Layer.handle(that.req, that.res, done);
        }
        next();
    });
    return this;
}

Browser.prototype.toolbarDigest = function(){
    var name = this.browserName;
    var soyie = this._soyie;
    var browsers = soyie.data.browsers;
    if ( name ){
        browsers.forEach(function(browser){
            if ( browser.name === name ){
                browser.actived = true;
            }else{
                browser.actived = false;
            }
        })
    }
}

Browser.prototype.use = function(path, fn){
    if ( !fn ){
        fn = path;
        path = '/';
    }
    return this.push('use', path, this._soyie.looser, fn);
}

Browser.prototype.active = function(path, fn){
    if ( !fn ){
        fn = path;
        path = '/';
    }
    return this.push('active', path, this._soyie.strict, fn);
}

Browser.prototype.createWebviews = function(){
    var webviews = this.webviews;
    var keys = Object.keys(webviews);
    var i = keys.length;
    var out = [];
    while (i--) {
        out.push(_.wrapWebview(keys[i], webviews[keys[i]]));
    }
    return out.join('');
}

Browser.prototype.webview = function(el){
    el = _.query(el);
    var name = el.getAttribute('name');
    var attributes = el.attributes;
    var i = attributes.length
    var params = {};
    while (i--) {
        var attr = attributes[i];
        params[attr.nodeName] = attr.nodeValue;
    }
    if ( params.name ) delete params.name;
    this.webviews[name] = new ownWebview();
    this.webviews[name].template = el.innerHTML;
    this.webviews[name].params = params;
    el.parentNode.removeChild(el);
    return this.webviews[name];
}

Browser.prototype.component = function(name, value){
    this.components[name] = value;
}
Browser.prototype.directive = function(name, value){
    this.directives[name] = value;
}

function defineGetBrowserName(browser){
    Object.defineProperty(browser, '$name', {
        get: function(){
            return this._options.name || 'browser_' + this.uid;
        }
    });
}

function defineBrowserActiveStatus(browser){
    Object.defineProperty(browser, 'actived', {
        get: function(){
            return this.$el
                ? this.$el.classList.contains('active')
                : false;
        },
        set: function(val){
            if ( !this.$el ) return;
            if ( !!val ){
                addClass(this.$el, 'active');
            }else{
                removeClass(this.$el, 'active');
            }
        }
    });
}

function defineToolbar(browser){
    var soyie = browser._soyie;
    if ( browser._options ){
        var browserName = browser._options.name;
        if ( browserName ){
            browser.browserName = browserName;
            soyie.data.browsers.push({
                name: browserName,
                text: browser._options.text,
                icon: browser._options.icon,
                url: browser._options.url,
                actived: false
            });
        }
    }
}
