var Vue = require('vue');
var next = require('../soyie/next');

module.exports = function(browser){
    return {
        priority: 3000,
        deep: true,
        _url: null,
        bind: function(){
            var that = this;
            if ( !this.el._hrefNexts ){
                this.el._hrefNexts = new next(function(){
                    that._url && browser.res.redirect(that._url);
                });
                this.el._hrefNexts.om = this;
            }
            this._cb = function(){ that.el._hrefNexts.run(); };
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
