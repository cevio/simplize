var cookie = require('./cookie');
var _ = require('../utils');
var Vue = require('vue');
var animationend = require('animationend');
var addClass = Vue.util.addClass;
var removeClass = Vue.util.removeClass;
var htmlElement = document.querySelector('html');
var ajax = require('./ajax');
module.exports = ServerResponse;

var store = function(res){
    return {
        set: function(name, value){
            var dist = value;
            value = JSON.stringify(value);
            window.localStorage.setItem(name, value);
            res.req.store[name] = dist;
        },
        remove: function(name){
            if ( res.req.store[name] ){
                window.localStorage.removeItem(name);
                delete res.req.store[name];
            }
        }
    };
};

var session = function(res){
    return {
        set: function(name, value){
            var dist = value;
            value = JSON.stringify(value);
            window.sessionStorage.setItem(name, value);
            res.req.session[name] = dist;
        },
        remove: function(name){
            if ( res.http.request.session[name] ){
                window.sessionStorage.removeItem(name);
                delete res.req.session[name];
            }
        }
    };
};

var cookies = function(res){
    return {
        set: function(name, value){
            cookie.set(name, value);
            res.req.cookie[name] = value;
        },
        remove: function(name){
            if ( res.http.request.cookie[name] ){
                cookie.remove(name);
                delete res.req.cookie[name];
            }
        }
    };
};

function ServerResponse(){
    this.req =
    this.app = null;
    _.defineFreeze(this, 'defineFreeze', function(name, value){
        _.defineFreeze(this, name, value);
    });
    this.defineFreeze('cookie', cookies(this));
    this.defineFreeze('store', store(this));
    this.defineFreeze('session', session(this));
    this.ajax = ajax;
    this.title = setTitle;
}

ServerResponse.prototype.render = function(name, direction, fn){
    var browser = this.app.$current; // 当前浏览器
    var useAnimate = true;
    var that = this;

    if ( typeof direction === 'function' ){
        fn = direction;
        direction = 'none';
    }
    if ( !direction ){
        direction = 'none';
    }

    if ( this.app.oldBrowser ) this.app.oldBrowser.emit('leave');
    if ( browser ){
        var actived = browser.actived;
        if ( !actived ){
            useAnimate = false;
            browser.actived = true;
            this.app.unactived.forEach(function(br){
                br.actived = false;
            });
        }
        if ( useAnimate && browser.stopAnimate ){
            useAnimate = false;
        }
        browser.emit('enter', this.req, this);
        var webview = browser.webviews[name];
        var oldWebview = browser.current;
        var newWebview = webview;

        var AnimateFn = !useAnimate ? animate : slideAnimate;

        if ( oldWebview && oldWebview !== newWebview ){
            oldWebview.emit('beforeLeave', this.req, this);
        }
        newWebview.emit('beforeEnter', this.req, this);
        Vue.util.nextTick(function(){
            AnimateFn(
                that.req,
                that,
                oldWebview,
                newWebview,
                browser,
                direction,
                whenAnimateDone(that.req, that, browser, webview, name, oldWebview, fn)
            );
        });
    }
}

ServerResponse.prototype.redirect = function(url){
    var href = this.req.href;
    var p = this.req.session[this.req.sessionSpace].length;
    var i = this.req.session[this.req.sessionSpace].indexOf(href);
    var j = this.req.session[this.req.sessionSpace].indexOf(url);
    var method = null, step = 0;

    if ( j == -1 ){
        method = 'goNew';
        if ( i + 1 < p ){
            this.session.set(this.req.sessionSpace, this.req.session[this.req.sessionSpace].slice(0, i + 1));
        }
    }else{
        if ( i < j ){
            method = 'goAhead';
            step = j - i;
        }else if ( i > j ){
            method = 'goBack';
            step = j - i;
        }else{
            method = 'refresh';
        }
    }

    this.req.history.method = method;
    this.req.history.browserRedirect = false;

    switch ( method ) {
        case 'goNew':
            window.location.href = '#' + url;
            this.req.session[this.req.sessionSpace].push(url);
            this.session.set(this.req.sessionSpace, this.req.session[this.req.sessionSpace]);
            break;
        case 'goAhead':
        case 'goBack':
            history.go(step);
            break;
    }
}

function animate(req, res, olds, news, browser, direction, exchange){
    if ( olds && olds !== news ){
        removeClass(olds.node, 'active');
        olds.emit('leave', req, res);
    }
    addClass(news.node, 'active');
    news.emit('enter', req, res);
    exchange();
}

function slideAnimate(req, res, olds, news, browser, direction, exchange){
    var method = req.history.method;
    if ( olds ){
        var currentElement = olds.node;
        var targetElement = news.node;
        var animEnd = null;

        animationend(targetElement).then(function(){
            olds !== news && olds.emit('leave', req, res);
            news.emit('enter', req, res);
            animEnd && animEnd();
            exchange();
        });

        if ( direction === 'left' ) {
            animEnd = animateOut(currentElement, targetElement, browser);
        }

        else if ( direction === 'right' ) {
            animEnd = animateIn(currentElement, targetElement, browser);
        }

        else {
            switch (method) {
                case 'goNew':
                case 'goAhead':
                    animEnd = animateIn(currentElement, targetElement, browser);
                    break;
                case 'goBack':
                    animEnd = animateOut(currentElement, targetElement, browser);
                    break;

            }
        }
    }
}

function animateIn(currentElement, targetElement, browser){
    if ( currentElement === targetElement ) return;

    var NabarAnimateEnd = browser.navgation.animateIn();

    addClass(htmlElement, 'soe-full-screen');
    addClass(targetElement, 'active');
    addClass(currentElement, 'soe-zindex-lower');
    addClass(targetElement, 'soe-zindex-higher');
    addClass(currentElement, 'soe-animate-center-to-left');
    addClass(targetElement, 'soe-animate-right-to-center');
    return function(){
        removeClass(htmlElement, 'soe-full-screen');
        removeClass(currentElement, 'active');
        removeClass(currentElement, 'soe-zindex-lower');
        removeClass(targetElement, 'soe-zindex-higher');
        removeClass(currentElement, 'soe-animate-center-to-left');
        removeClass(targetElement, 'soe-animate-right-to-center');
        if ( browser.$navgation ){
            browser.$navgation.parentNode.removeChild(browser.$navgation);
            NabarAnimateEnd && NabarAnimateEnd();
        }
    }
}

function animateOut(currentElement, targetElement, browser){
    if ( currentElement === targetElement ) return;

    var NabarAnimateEnd = browser.navgation.animateOut();

    addClass(htmlElement, 'soe-full-screen');
    addClass(targetElement, 'active');
    addClass(currentElement, 'soe-zindex-higher');
    addClass(targetElement, 'soe-zindex-lower');
    addClass(currentElement, 'soe-animate-center-to-right');
    addClass(targetElement, 'soe-animate-left-to-center');
    return function(){
        removeClass(htmlElement, 'soe-full-screen');
        removeClass(currentElement, 'active');
        removeClass(currentElement, 'soe-zindex-higher');
        removeClass(targetElement, 'soe-zindex-lower');
        removeClass(currentElement, 'soe-animate-center-to-right');
        removeClass(targetElement, 'soe-animate-left-to-center');
        if ( browser.$navgation ){
            browser.$navgation.parentNode.removeChild(browser.$navgation);
            NabarAnimateEnd && NabarAnimateEnd();
        }
    }
}

function findActivedWebview(browser){
    var i = browser.webviews.length;
    while ( i-- ) {
        var webview = browser.webviews[i];
        var node = webview.node;
        if ( node.hasAttribute('active') ){
            return webview;
        }
    }
}

function whenAnimateDone(req, res, browser, webview, name, oldWebview, callback){
    return function(){
        browser.current = webview;
        Vue.util.nextTick(function(){
            browser.navgation.clone();
            var classes = Array.prototype.slice.call(_.osClasses);
            classes.push('webview-' + name);
            classes = classes.concat(_.htmlClassList);
            htmlElement.setAttribute('class', classes.join(' '));
            browser._soyie.oldBrowser = browser;
            oldWebview && oldWebview !== webview && oldWebview.emit('afterLeave', req, res);
            webview.emit('afterEnter',req, res);
            typeof callback === 'function' && callback.call(webview.vm);
            browser.$activeWebviewName = name;
        });
    }
}

function setTitle(title){
    var $body = document.body;
    document.title = title;
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = document.createElement('iframe');
    $iframe.src = '/favicon.ico';
    $iframe.onload = function(){
        setTimeout(function() {
            $iframe.parentNode.removeChild($iframe);
        }, 0);
    };
    $body.appendChild($iframe);
}
