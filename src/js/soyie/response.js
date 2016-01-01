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

ServerResponse.prototype.render = function(name){
    var browser = this.app.$current; // 当前浏览器
    var useAnimate = true;
    if ( browser ){
        var actived = browser.actived;
        if ( !actived ){
            useAnimate = false;
            browser.actived = true;
            this.app.unactived.forEach(function(br){
                br.actived = false;
            });
        }
        var webview = browser.webviews[name];
        if ( webview ){
            var oldWebview = browser.current;
            var newWebview = webview;
            var AnimateFn = !useAnimate ? animate : slideAnimate;

            AnimateFn.call(
                this.req,
                oldWebview,
                newWebview,
                browser,
                whenAnimateDone(browser, webview)
            );
        }
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

function animate(olds, news, browser, exchange){
    if ( olds ){
        removeClass(olds.node, 'active');
    }
    addClass(news.node, 'active');
    exchange();
}

function slideAnimate(olds, news, browser, exchange){
    var method = this.history.method;
    if ( olds ){
        var currentElement = olds.node;
        var targetElement = news.node;
        var animEnd = null;
        animationend(targetElement).then(function(){
            animEnd && animEnd();
            exchange();
        });
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

function animateIn(currentElement, targetElement, browser){
    if ( currentElement === targetElement ) return;

    var NabarAnimateEnd = null;
    if ( browser.$header && browser.$navgation ){
        var navbar = query(browser.$header, '.soe-navbar');
        browser.$header.appendChild(browser.$navgation);
        NabarAnimateEnd = whenAnimateNavbarIn(browser.$navgation, navbar);
    }


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

    var NabarAnimateEnd = null;
    if ( browser.$header && browser.$navgation ){
        var navbar = query(browser.$header, '.soe-navbar');
        browser.$header.appendChild(browser.$navgation);
        NabarAnimateEnd = whenAnimateNavbarOut(browser.$navgation, navbar);
    }

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

function whenAnimateDone(browser, webview){
    return function(){
        browser.current = webview;
        setTimeout(function(){
            var header = browser.$el.querySelector('header');
            if ( header ){
                browser.$header = header;
                browser.$navgation = cloneHeaderElement(header.querySelector('.soe-navbar'));
            }else{
                browser.$header = null;
                browser.$navgation = null
            }
        });
    }
}

function cloneHeaderElement(node){
    if ( !node ) return null;
    var div = document.createElement('div');
    div.appendChild(node.cloneNode(true));
    addClass(div, 'soe-navbar-template');
    return div;
}

function whenAnimateNavbarIn(node, navbar){
    if ( node ){
        // 副本层的对象
        var lefticon = query(node, '.soe-navbar-left-area .soe-navbar-icon');
        var lefttext = query(node, '.soe-navbar-left-area .soe-navbar-text');
        var righticon = query(node, '.soe-navbar-right-area .soe-navbar-icon');
        var righttext = query(node, '.soe-navbar-right-area .soe-navbar-text');
        var title = query(node, '.soe-navbar-center-area .soe-navbar-text');

        // 操作副本层
        addClass(lefttext, 'soe-navbar-center-to-left');
        addClass(righttext, 'soe-navbar-center-to-left');
        addClass(title, 'soe-navbar-center-to-left');
        addClass(lefticon, 'soe-navbar-fadeout');
        addClass(righticon, 'soe-navbar-fadeout');
        addClass(node, 'soe-navbar-fadeout');
    }

    if ( navbar ){
        // 原始层对象
        var _lefticon = query(navbar, '.soe-navbar-left-area .soe-navbar-icon');
        var _lefttext = query(navbar, '.soe-navbar-left-area .soe-navbar-text');
        var _righticon = query(navbar, '.soe-navbar-right-area .soe-navbar-icon');
        var _righttext = query(navbar, '.soe-navbar-right-area .soe-navbar-text');
        var _title = query(navbar, '.soe-navbar-center-area .soe-navbar-text');
        // 操作原始层
        addClass(_lefttext, 'soe-navbar-right-to-center');
        addClass(_righttext, 'soe-navbar-right-to-center');
        addClass(_title, 'soe-navbar-right-to-center');
        addClass(_lefticon, 'soe-navbar-fadein');
        addClass(_righticon, 'soe-navbar-fadein');
        addClass(navbar, 'soe-navbar-fadein');
    }

    return function(){
        if ( !navbar ) return;
        removeClass(_lefttext, 'soe-navbar-right-to-center');
        removeClass(_righttext, 'soe-navbar-right-to-center');
        removeClass(_title, 'soe-navbar-right-to-center');
        removeClass(_lefticon, 'soe-navbar-fadein');
        removeClass(_righticon, 'soe-navbar-fadein');
        removeClass(navbar, 'soe-navbar-fadein');
    }
}

function whenAnimateNavbarOut(node, navbar){
    if ( node ){
        // 副本层的对象
        var lefticon = query(node, '.soe-navbar-left-area .soe-navbar-icon');
        var lefttext = query(node, '.soe-navbar-left-area .soe-navbar-text');
        var righticon = query(node, '.soe-navbar-right-area .soe-navbar-icon');
        var righttext = query(node, '.soe-navbar-right-area .soe-navbar-text');
        var title = query(node, '.soe-navbar-center-area .soe-navbar-text');
        // 操作副本层
        addClass(lefttext, 'soe-navbar-center-to-right');
        addClass(righttext, 'soe-navbar-center-to-right');
        addClass(title, 'soe-navbar-center-to-right');
        addClass(lefticon, 'soe-navbar-fadeout');
        addClass(righticon, 'soe-navbar-fadeout');
        addClass(node, 'soe-navbar-fadeout');
    }

    if ( navbar ){
        // 原始层对象
        var _lefticon = query(navbar, '.soe-navbar-left-area .soe-navbar-icon');
        var _lefttext = query(navbar, '.soe-navbar-left-area .soe-navbar-text');
        var _righticon = query(navbar, '.soe-navbar-right-area .soe-navbar-icon');
        var _righttext = query(navbar, '.soe-navbar-right-area .soe-navbar-text');
        var _title = query(navbar, '.soe-navbar-center-area .soe-navbar-text');
        // 操作原始层
        addClass(_lefttext, 'soe-navbar-left-to-center');
        addClass(_righttext, 'soe-navbar-left-to-center');
        addClass(_title, 'soe-navbar-left-to-center');
        addClass(_lefticon, 'soe-navbar-fadein');
        addClass(_righticon, 'soe-navbar-fadein');
        addClass(navbar, 'soe-navbar-fadein');
    }

    return function(){
        if ( !navbar ) return;
        removeClass(_lefttext, 'soe-navbar-left-to-center');
        removeClass(_righttext, 'soe-navbar-left-to-center');
        removeClass(_title, 'soe-navbar-left-to-center');
        removeClass(_lefticon, 'soe-navbar-fadein');
        removeClass(_righticon, 'soe-navbar-fadein');
        removeClass(navbar, 'soe-navbar-fadein');
    }
}

function query(node, exp){
    return node.querySelector(exp);
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
