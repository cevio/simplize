module.exports = function(browser){
    return {
        name: 'webview',
        props: {
            name: {
                type: String,
                required: true
            }
        },
        ready: function(){
            this.$node = this.$el.nextSibling;
            browser.webviews[this.name].node = this.$node;
            browser.webviews[this.name].vm = this;
            this.$browser = browser;
        }
    }
}
