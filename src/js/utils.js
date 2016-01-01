exports.defineFreeze = function(object, name, value){
    Object.defineProperty(object, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
};

exports.duplicate = function(){
    return document.createDocumentFragment();
};

exports.type = function(object, type){
    var _type = toString.call(object).split(' ')[1].replace(/\]$/, '');
    if ( type ){
        return _type == type;
    }else{
        return _type;
    }
};


exports.query = function(el){
    if ( typeof el === 'string' ){
        return document.querySelector(el);
    }
    return el;
}

exports.wrapBrowser = function(name, html){
    var browser = document.createElement('div');
    browser.innerHTML = '<navgation></navgation><div class="webviews" :class="monitorStatus">' + html + '</div>';
    browser.setAttribute('class', 'browser');
    browser.setAttribute('name', name);
    return browser;
}

exports.wrapWebview = function(name, web){
    var params = web.params;
    var keys = Object.keys(params);
    var i = keys.length;
    var attrs = ['name="' + name + '"'];
    while (i--) {
        attrs.push(keys[i] + '="' + params[keys[i]] + '"');
    }
    return '<webview ' + attrs.join(' ') + '><div class="webview" name="' + name + '">' + web.template + '</div></webview>';
}
exports.headData = function(){
    return {
        left: {
            icon: '',
            value: '',
            fn: function(){}
        },
        center: {
            value: '',
            fn: function(){}
        },
        right: {
            icon: '',
            value: '',
            fn: function(){}
        },
        cls: '',
        hide: false,
        css: ''
    }
}
