var Vue = require('vue');

module.exports = function(browser){
    return {
        deep: true,
        _url: null,
        bind: function(){
            var that = this;

            this._cb = function(){
                that._url &&
                browser.res.redirect(that._url);
            };

            Vue.util.on(this.el, 'click', this._cb);
        },

        update: function(newValue){
            this._url = newValue;
        },

        unbind: function(){
            Vue.util.off(this.el, 'click', this._cb);
        }
    }
}
