var Vue = require('vue');
var addClass = Vue.util.addClass;
var removeClass = Vue.util.removeClass;

module.exports = function(fn){
    this.$head = Vue.util.extend(HeaderData(), this._options.$head || {});
    return nav(this, fn);
}

function noop(){}
function HeaderData(){
    return {
        cls: '', hide: false, css: '',
        left: { icon: '', value: '', fn: noop },
        center: { value: '', fn: noop },
        right: { icon: '', value: '', fn: noop }
    }
}


function nav(browser, fn){
    return {
        template:   '<div class="header" v-if="!hide" transition="headbar">' +
                        '<div class="soe-navbar" :class="cls" :style="css">' +
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
                    '</div>',
        methods: {
            animateIn: function(){
                if ( browser.$header && browser.$navgation ){
                    var navbar = query(browser.$header, '.soe-navbar');
                    browser.$header.appendChild(browser.$navgation);
                    return whenAnimateNavbarIn(browser.$navgation, navbar);
                }
            },
            animateOut: function(){
                if ( browser.$header && browser.$navgation ){
                    var navbar = query(browser.$header, '.soe-navbar');
                    browser.$header.appendChild(browser.$navgation);
                    return whenAnimateNavbarOut(browser.$navgation, navbar);
                }
            },
            clone: function(){
                var header = browser.$el.querySelector('.header');

                if ( header )
                {
                    browser.$header = header;
                    browser.$navgation = cloneHeaderElement(header.querySelector('.soe-navbar'));
                }
                else
                {
                    browser.$header = null;
                    browser.$navgation = null;
                }
            },
            reset: function(){
                this.left.icon =
                this.right.icon =
                this.left.value =
                this.right.value =
                this.center.value =
                this.cls =
                this.css = '';
                this.left.fn =
                this.right.fn =
                this.center.fn = noop;
                this.hide = false;
            },
            setFrame: function(title, reffer_icon, reffer_value, reffer_fn, refresh_icon, refresh_value, refresh_fn, cls, css, hide){
                this.left.icon = reffer_icon;
                this.right.icon = refresh_icon;
                this.left.value = reffer_value;
                this.right.value = refresh_value;
                this.center.value = title;
                this.cls = cls || '';
                this.css = css || '';
                this.left.fn = reffer_fn;
                this.right.fn = refresh_fn;
                this.center.fn = noop;
                this.hide = !!hide;
            }
        },
        watch: { hide: fn }
    }
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

function cloneHeaderElement(node){
    if ( !node ) return null;
    var div = document.createElement('div');
    div.appendChild(node.cloneNode(true));
    addClass(div, 'soe-navbar-template');
    return div;
}
