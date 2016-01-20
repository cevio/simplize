module.exports = function(browser){
    console.log(browser)
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
                '<div v-if="headShow" transition="headbar" class="soe-headbar-place-exist"></div>' +
                '<slot></slot>' +
                '<div v-if="toobarShow" transition="toolbar" class="soe-toolbar-place-exist"></div>' +
            '</div>',
        ready: function(){
            this.$node = this.$el;
            browser.webviews[this.name].node = this.$node;
            browser.webviews[this.name].vm = this;
            this.$browser = browser;
        }
    }
}
