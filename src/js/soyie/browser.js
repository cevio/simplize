var _ = require('../utils');
var Vue = require('vue');
var next = require('./next');
var layer = require('./layer');
var EventEmitter = require('events').EventEmitter;
var componentWebview = require('../components/webview');
var componentNavgation = require('../components/navgation');
var directiveHref = require('../directives/href');
var directiveURL = require('../directives/url');
var uiMiddle = require('../components/uiMiddle');
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
    this._navcomponent =
    this.url =
    this.cb = null;
    this.$data = Vue.util.extend({}, this._options.data || {});
    this.$head = {};
    this.webviews = {};
    this.components = {};
    this.directives = {};
    this.filters = {};
    this.Aevents = {};
    this.computeds = {};
    this.methods = {};
    this.watches = {};
    this.current = null;
    this.next = new next(function(){
        typeof that.cb === 'function' &&
        that.cb();
    }, this);
    defineGetBrowserName(this);
    defineBrowserActiveStatus(this);
    defineToolbar(this);
    this.$nav(componentNavgation);
}

Browser.prototype = Object.create(EventEmitter.prototype);

Browser.prototype.init = function(){
    var components = Vue.util.extend({
        "webview": componentWebview(this),
        "navgation": this._navcomponent,
        "middle": uiMiddle
    }, this.components);

    var directives = Vue.util.extend({
        "href": directiveHref(this),
        "url": directiveURL(this)
    }, this.directives);


    var options = this._options;

    options.el = this.$el;
    options.name = options.browserName || 'browser';
    options.data = this.$data;
    options.components = Vue.util.extend(options.components || {}, components);
    options.directives = Vue.util.extend(options.directives || {}, directives);
    options.filters = Vue.util.extend(options.filters || {}, this.filters);
    options.events = Vue.util.extend(options.events || {}, this.Aevents);
    options.computed = Vue.util.extend(options.computed || {}, this.computeds);
    options.methods = Vue.util.extend(options.methods || {}, this.methods);
    options.watch = Vue.util.extend(options.watch || {}, this.watches);

    options.filters.webTitle = directiveURL.webTitle;

    this.Vue = new Vue(options);
    this.Vue.$browser = this;
}

Browser.prototype.$nav = function(modules){
    var result = modules.call(this, changeWebviewEvent(this)),
        that = this,
        ready = result.ready;

    if ( !result.name ){ result.name = 'navgation'; }
    result.data = function(){ return that.$head; }
    result.ready = function(){
        that.navgation = this;
        ready && ready.call(this);
    }
    this._navcomponent = result;
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
            that.req.$head = that.navgation;
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

Browser.prototype.component =
Browser.prototype.$component = function(name, value){
    this.components[name] = value;
}
Browser.prototype.directive =
Browser.prototype.$directive = function(name, value){
    this.directives[name] = value;
}
Browser.prototype.$filter = function(name, value){
    this.filters[name] = value;
}
Browser.prototype.$event = function(name, value){
    this.Aevents[name] = value;
}
Browser.prototype.$watch = function(name, value){
    this.watches[name] = value;
}
Browser.prototype.$computed = function(name, value){
    this.computeds[name] = value;
}
Browser.prototype.$method = function(name, value){
    this.methods[name] = value;
}

Browser.prototype.plugin = function(plugin){
    if ( typeof plugin === 'function' ){
        plugin.call(this, this._soyie, this._soyie.constructor);
    }
    else{
        this._options = Vue.util.extend(this._options, plugin || {});
    }
    return this;
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

function changeWebviewEvent(browser){
    return function(newValue, oldValue){
        if ( newValue != oldValue ){
            var webviews = browser.webviews;
            var keys = Object.keys(webviews);
            var i = keys.length;
            while ( i-- ) {
                webviews[keys[i]].vm.headShow = !newValue;
            }
        }
    }
}
