var querystrings = require('querystrings');
var Vue = require('vue');
var cookie = require('./cookie');
module.exports = ServerRequest;

function ServerRequest(){
    var location = window.location;
    this.hash =
    this.search =
    this.query = null;
    this.path = '/';
    this.params = {};
    this.store = makeStorages('local');
    this.session = makeStorages('session');
    this.cookie = cookie.get() || {};
    this.sessionSpace = 'webview';
    this.history = {
        method: 'refresh',
        browserRedirect: true
    }
}

ServerRequest.prototype.inspect = function(){
    var location = window.location;
    var search = location.search;
    var hash = location.hash;

    if ( search ){
        search = search.substring(1);
    }
    this.search = search || '';
    if ( hash ){
        hash = hash.substring(1);
        if ( hash.indexOf('?') > -1 ){
            var splitor = hash.split('?');
            var left = splitor[0];
            var right = splitor[1];
            this.path = left || '/';
            this.search += right
                ? (this.search ? '&' : '') + right
                : '';
        }else{
            this.path = hash;
        }
    }

    this.query = querystrings.format(this.search);
    this.search = this.search ? "?" + this.search : '';
    this.href = this.path + this.search;
    this.hash = hash;
}

ServerRequest.prototype.init = function(first){
    var oldhref = this.href;
    this.inspect();
    this.firstEnter(first);
    this.status(oldhref, this.href);
}

ServerRequest.prototype.firstEnter = function(first){
    if ( this.hash != this.href || first){
        var location = window.location;
        var replaceURL = location.origin + location.pathname + '#' + this.href;
        history.replaceState({
            url: this.href
        }, document.title, replaceURL);
        if ( !this.session[this.sessionSpace] ){
            this.res.session.set(this.sessionSpace, []);
        }
        if ( this.session[this.sessionSpace].indexOf(this.href) === -1 ){
            var value = this.session[this.sessionSpace];
            value.push(this.href);
            this.res.session.set(this.sessionSpace, value);
        }
    }
}

ServerRequest.prototype.status = function(oldValue, newValue){
    if ( oldValue && newValue && this.history.browserRedirect ){
        var p = this.session[this.sessionSpace].length;
        var i = this.session[this.sessionSpace].indexOf(oldValue);
        var j = this.session[this.sessionSpace].indexOf(newValue);
        var method = null, dist;
        if ( j == -1 ){
            method = 'goNew';
            if ( i + 1 < p ){ dist = this.session[this.sessionSpace].slice(0, i + 1); }
            else{ dist = this.session[this.sessionSpace]; }
            dist.push(newValue);
            this.res.session.set(this.sessionSpace, dist);
        }else{
            if ( i < j ){
                method = 'goAhead';
            }else if ( i > j ){
                method = 'goBack';
            }else{
                method = 'refresh';
            }
        }
        this.history.method = method;
    }else{
        this.history.browserRedirect = true;
    }
}

function makeStorages(type){
    var object = window[type + 'Storage'], objs = {};
    if ( object ){
        for ( var i in object ){
            try{
                objs[i] = JSON.parse(object.getItem(i));
            }catch(e){}
        }
    }
    return objs;
}
