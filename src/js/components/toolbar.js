var utils = require('../utils');
var animationend = require('animationend');
var template =
    '<div class="web-toolbar" v-if="status" :transition="\'toolbar\' | fixAnimation" v-el:tool-bar>' +
        '<ul class="clearfix">' +
            '<li v-for="browser in browsers | orderBy \'order\'" :style="{width: width}" :class="active(browser)">' +
                '<middle v-redirect="browser.url">' +
                    '<div class="web-toolbar-icon" v-html="browser.icon"></div>' +
                    '<div class="web-toolbar-text" v-html="browser.title"></div>' +
                '</middle>' +
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
        }
    },
    ready: function(){
        this.$parent.$toolbar = this;
        if ( this.status ){
            this.height = this.$els.toolBar.clientHeight;
        }
    },
    data: function(){
        var params = Object.keys(this.$parent.$refs);
        var i = params.length;
        var result = [];
        while ( i-- ) {
            var browser = this.$parent.$refs[params[i]];
            if ( browser.$isBrowser ){
                result.push(browser);
            }
        }
        return {
            status: false,
            height: 0,
            browsers: result
        }
    },
    watch: {
        status: function(value){
            var that = this;
            if ( !!value ){
                if ( this.$root.disableAnimation ){
                    this.height = this.$els.toolBar.clientHeight;
                    that.$emit('active');
                }else{
                    animationend(this.$els.toolBar).then(function(){
                        that.$emit('active');
                    });
                    this.height = this.$els.toolBar.clientHeight;
                }
            }else{
                if ( this.$root.disableAnimation ){
                    this.height = 0;
                    that.$emit('active');
                }else{
                    animationend(this.$els.toolBar).then(function(){
                        that.$emit('unactive');
                    });
                    this.height = 0;
                }
            }
        }
    }
}
