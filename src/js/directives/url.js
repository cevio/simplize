var Vue = require('vue');

module.exports = function(browser){
    return {
        priority: 3001,
        deep: true,
        _title: '',
        _url: '_blank',
        bind: function(){
            var that = this;
            this._cb = function(){
                browser._soyie.$frame.status = true;
                browser._soyie.$frame.center.value = that._title;
                browser._soyie.$frame.src = that._url;
            };
            Vue.util.on(this.el, 'click', this._cb);
        },

        update: function(newValue){
            if ( typeof newValue === 'object' ){
                this._title = newValue.title || '新窗口';
                this._url = newValue.url || '_blank';
            }else{
                this._title = '新窗口';
                this._url = newValue || '_blank';
            }
        },

        unbind: function(){
            Vue.util.off(this.el, 'click', this._cb);
        }
    }
}

module.exports.webTitle = function(url, title){
    return {
        url: url,
        title: title
    }
}
