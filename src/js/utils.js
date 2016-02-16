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
    browser.innerHTML = '<navgation></navgation><div class="webviews">' + html + '</div>';
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
    return '<webview ' + attrs.join(' ') + ' v-ref:' + name + '>' + web.template + '</webview>';
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

exports.os = function(){
    var u = navigator.userAgent;
    return {
		trident: u.indexOf('Trident') > -1, //IE内核
		presto: u.indexOf('Presto') > -1, //opera内核
		webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
		mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
		iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
		iPad: u.indexOf('iPad') > -1, //是否iPad
		webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
		weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
		qq: u.match(/\sQQ/i) == " qq", //是否QQ
        wp: u.indexOf('Windows Phone 8.') > -1, // wp
        wp8: u.indexOf('Windows Phone 8.') > -1, // wp8
        enniu: u.indexOf('EnNiu') > -1 || u.indexOf('Enniu') > -1, // enniu
        weibo: u.match(/\sWeiBo/i) == " weibo" // weibo
	}
}

exports.osClass = function(soyie){
    var os = this.os();
    var keys = Object.keys(os);
    var i = keys.length;
    var classes = [];
    while (i--){
        if ( soyie ){
            soyie['is' + keys[i]] = os[keys[i]];
        }
        if ( os[keys[i]] ){
            classes.push(keys[i]);
        }
    }
    return classes;
}

exports.htmlClassList = [];

exports.noop = function(){};

exports.webframeHTML =
    '<div class="webframe-wrap" v-if="status" transition="webframe">' +
        '<div class="header">' +
            '<div class="soe-navbar">' +
                '<div class="soe-navbar-left-area  soe-clearflash tl" @click="left.fn">' +
                    '<div class="soe-navbar-icon " v-html="left.icon"></div>' +
                    '<div class="soe-navbar-text " v-html="left.value"></div>' +
                '</div>' +
                '<div class="soe-navbar-right-area  soe-clearflash tr" @click="right.fn">' +
                    '<div class="soe-navbar-text " v-html="right.value"></div>' +
                    '<div class="soe-navbar-icon " v-html="right.icon"></div>' +
                '</div>' +
                '<div class="soe-navbar-center-area">' +
                    '<div class="soe-navbar-text soe-clearflash" v-html="center.value" @click="center.fn"></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="body"><iframe :src="src"></iframe></div>' +
    '</div>';
