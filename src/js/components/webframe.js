module.exports = function(browser){
    return {
        name: 'web-frame',
        template:
            '<div class="webview" name="simplize-browser-web-frame">' +
                '<div class="webview-content" v-if="status">' +
                    '<div v-if="headShow" transition="pageheadbar" class="soe-headbar-place-exist"></div>' +
                    '<iframe :src="src"></iframe>' +
                    '<div v-if="toobarShow" transition="pagetoolbar" class="soe-toolbar-place-exist"></div>' +
                '</div>'+
            '</div>',
        data: function(){
            return {
                reffer: '',
                refferHead: {},
                status: false,
                src: '_blank',
                headShow: !browser.$head._hide,
                toobarShow: !browser._soyie.data.hide
            }
        },
        ready: function(){
            var that = this;
            this.$node = this.$el;
            browser.webviews['simplize-browser-web-frame'].node = this.$node;
            browser.webviews['simplize-browser-web-frame'].vm = this;
            this.$browser = browser;
            this.$browser.$frame = this;
        },
        methods: {
            refresh: function(){
                this.$node.querySelector('iframe').src = this.src;
            },
            back: function(){
                var that = this;
                extend(browser.$head, this.refferHead);
                browser._soyie.res.render(this.reffer, 'left', function(){
                    that.status = false;
                });
            }
        }
    }
}

function extend(a, b){
    for ( var i in b ){
        if ( !a[i] ) a[i] = {};
        if ( typeof b[i] === 'object' ){
            for ( var j in b[i] ){
                a[i][j] = b[i][j];
            }
        }else{
            a[i] = b[i];
        }
    }
    return a;
}
