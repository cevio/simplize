/**
 *  load modules.
 */
var Vue = require('vue');
var domReady = require('domready');
var querystrings = require('querystrings');
var animationend = require('animationend');
var Promise = require('es6-promise').Promise;
var pathToRegExp = require('path-to-regexp');
var fastClick = require('fastclick');

/**
 *  load deps.
 */
var utils = require('./utils');
var resource = require('./resource');
var toolbar = require('./components/toolbar');
var operators = require('./application/options');
var redirect = require('./application/redirect');
var browser = require('./application/browser');
var layer = require('./application/layer');
var keeper = require('./application/session');
var viewport = require('./application/viewport');
var middlewares = require('./middlewares');
var debug = require('./application/debug');
var os = require('./application/os');

/**
 *  load vars.
 */
var sessions = keeper.pool;
var first = true;

/**
 * 默认模式， 关闭
 */
Vue.config.debug = false;
Vue.config.silent = true;
Vue.config.convertAllProperties = false;
/**
 *  expose proxy.
 */
module.exports = simplize;

Vue.component('middle', require('./components/middle'));
Vue.mixin(require('./application/mixins'));

function simplize(options){
    simplize.$toolbar = simplize.$toolbar || toolbar;
    simplize.init();
    var components = operators(simplize, options, simplize.$toolbar);
    components.toolbar = simplize.$toolbar.component;
    return simplize.app = new Vue({
        el: simplize.$root,
        data: resource,
        components: components,
        methods: {
            $browser: browser.get,
            $use: simplize.use,
            $run: simplize.run,
            $redirect: redirect
        },
        watch: {
            "req.href": simplize.run,
            "env.debug": debug
        },
        events: {
            end: function(){
                if ( keeper.temp ) keeper.temp = null;
            }
        }
    });
}

simplize.nextTick = utils.nextTick;
simplize.Vue = Vue;
simplize.stop = utils.stop;
simplize.util = utils;
simplize.animationend = animationend;
simplize.querystring = querystrings;
simplize.Promise = Promise;
simplize.pathToRegExp = pathToRegExp;
simplize.routeLayer = layer;
simplize.fastClick = fastClick;
simplize.$toolbar = null;
simplize.redirect = redirect;

simplize.plugin = function(object){
    if ( typeof object.install === 'function' ){
        object.install(simplize, resource);
    }
}

simplize.viewport = function(type){
    viewport(type);
    utils.addClass(simplize.$html, 'viewport-' + type);
}

simplize.ready = function(cb){
    for ( var i in middlewares ){
        simplize[i] = middlewares[i];
    }
    domReady(function(){
        simplize.$root = utils.createRoot();
        simplize.$html = utils.$query(document, 'html');
        fastClick(document.body);
        cb();
    });
};

simplize.init = function(){
    var location = window.location,
        search = location.search,
        hash = location.hash,
        href = location.href,
        result, query;

    if ( hash && hash != '#' ){
        result = utils.$rebuildURI(hash.substring(1));
    }else{
        result = utils.$rebuildURI('/');
    }

    if ( search && search != '?' ){
        search = search.substring(1);
        search = result.search + '&' + search;
        search = search.replace(/^\?/, '');
        result.search = search ? '?' + search : search;
        query = querystrings.format(search);
        result.query = query;
        result.href = result.path + result.search;
    }

    resource.req = result;

    os();
    simplize.session();
    utils.setURI(sessions, result.href);

    var _href = location.origin + location.pathname + '#' + result.href;
    if ( _href != href ){
        history.replaceState({ url: _href }, document.title, _href);
    }

    simplize.hashChange();
}

simplize.run = function(newValue, oldValue){
    var that = this;
    simplize.history(newValue, oldValue);
    utils.nextTick(function(){
        that.$next.run();
        if ( first ){
            simplize.nextTick(function(){
                simplize.app.$emit('ready');
                first = false;
            });
        }
    });
}

simplize.push = function(method, path, opts, fn){
    var Layer = new layer(method, path, opts, fn);
    simplize.app.$next.use(function(next){
        if ( Layer.match(this.req.path) ){
            var distURL = this.req.path.replace(Layer.path, '') || '/';
            if ( !/^\//.test(distURL) ) distURL = '/' + distURL;
            this.req.params = Layer.params || {};
            return Layer.handle.call(this, next, distURL);
        }
        next();
    });
}

simplize.use = function(router, brw){
    if ( !brw ){
        brw = router;
        router = '/';
    }

    var type = utils.$type(brw);
    var fn;

    if ( type === 'string' ){
        brw = simplize.app.$browser(brw);
        fn = brw.$run;
    }else if ( type === 'function' ){
        fn = brw;
    }else if ( type === 'object' && brw._isVue ){
        fn = brw.$run;
    }

    typeof fn === 'function'
        && simplize.push('browser', router || '/', utils.$looser, fn);
}

simplize.hashChange = function(){
    utils.on(window, 'hashchange', function(e){
        e.preventDefault();
        var hash = window.location.hash.replace(/^\#/, '');
        var result = utils.$rebuildURI(hash);
        utils.$extend(resource.req, result);
    });
}

simplize.history = function(newValue, oldValue){
    if ( newValue ){
        var o = sessions.length,
            i = -1,
            j = -1,
            result;

        i = sessions.indexOf(newValue);
        if ( oldValue ){
            j = sessions.indexOf(oldValue);
        }

        if ( i == -1 ){
            result = 'left';
            if ( j + 1 < o ){
                sessions = sessions.slice(0, j + 1);
            }
            sessions.push(newValue);
            keeper.temp = function(){
                window.sessionStorage.setItem(utils.sessionValueName, JSON.stringify(sessions));
                keeper.temp = null;
            }
        }else{
            if ( i > j ){
                result = 'left';
            }else if ( i < j ){
                result = 'right';
            }else{
                result = 'slient';
            }
        }
        simplize.app.$history = result;
    }else{
        simplize.app.$history = 'slient';
    }
}

simplize.session = function(){
    var name = window.sessionStorage.getItem(utils.sessionName);
    if ( !name ){
        name =  'simplize-history-' + new Date().getTime();
        window.sessionStorage.setItem(utils.sessionName, name);
    }
    utils.sessionValueName = name;
    var locals = window.sessionStorage.getItem(name);
    if ( locals ){
        try{
            locals = JSON.parse(locals);
        }catch(e){
            locals = [];
        }
    }else{
        locals = [];
    }

    sessions = locals;
}
