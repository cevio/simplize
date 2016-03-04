var utils = require('../utils');
var animationend = require('animationend');
var template =
    '<div class="web-toolbar" v-if="state" transition="toolbar" :class="display" v-el:tool-bar>' +
        '<ul class="clearfix">' +
            '<li v-for="browser in browsers | orderBy \'order\'" :style="{width: width}" :class="active(browser)">' +
                '<ui-middle v-redirect="browser.url">' +
                    '<div class="web-toolbar-icon" v-html="browser.icon"></div>' +
                    '<div class="web-toolbar-text" v-html="browser.title"></div>' +
                '</ui-middle>' +
            '</li>' +
        '</ul>' +
    '</div>';

exports.fix = function(result, data){
    result.name = 'browser';
    if ( result.title ) data.title = result.title;
    if ( result.icon ) data.icon = result.icon;
    if ( result.url ) data.url = result.url;
    if ( result.order != undefined ) {
        data.order = result.order;
    }else{
        data.order = 99;
    }
};

exports.component = {
    name: 'toolbar',
    template: template,
    computed: {
        width: function(){
            return ((1 / this.browsers.length) * 100) + '%';
        }
    },
    methods: {
        active: function(browser){
            return this.$parent.ActiveBrowser == browser ? 'active' : '';
        },
        listen: function(){
            var that = this;
            animationend(this.$els.toolBar).then(function(){
                if ( that.status ){
                    that.$emit('active');
                }else{
                    that.$emit('unactive');
                }
            });
        }
    },
    data: function(){
        return {
            status: true,
            height: 0,
            browsers: this.database(),
            fixHeight: 0,
            state: true,
            display: 'slient'
        }
    },
    events: {
        left: function(){
            this.display = 'move';
            this.listen();
        },
        right: function(){
            this.display = 'move';
            this.listen();
        }
    }
}
