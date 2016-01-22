module.exports = function(browser){
    return {
        name: 'webview',
        props: {
            name: {
                type: String,
                required: true
            }
        },
        data: function(){
            return {
                headShow: !browser.$head._hide,
                toobarShow: !browser._soyie.data.hide
            }
        },
        template:
            '<div class="webview" :name="name">' +
                '<div class="webview-content">' +
                    '<div v-if="headShow" transition="pageheadbar" class="soe-headbar-place-exist"></div>' +
                    '<slot></slot>' +
                    '<div v-if="toobarShow" transition="pagetoolbar" class="soe-toolbar-place-exist"></div>' +
                '</div>'+
            '</div>',
        ready: function(){
            this.$node = this.$el;
            browser.webviews[this.name].node = this.$node;
            browser.webviews[this.name].vm = this;
            this.$browser = browser;
        }
    }
}
