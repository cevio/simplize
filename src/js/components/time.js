var utils = require('../utils');
exports.name = 'ui-date';
exports.template = '<span v-el:root>{{value | formatDate}}</span>';
exports.props = ['value', 'format'];
exports.created = function(){
    if ( !this.value ){
        this.value = new Date();
    }
    if ( !this.format ){
        this.format = 'h:i:s';
    }
}

exports.ready = function(){
    var that = this;
    this._cb = function(e){
        var y = that.value.getFullYear();
        var m = that.value.getMonth() + 1;
        var d = that.value.getDate();

        var h = that.value.getHours();
        var i = that.value.getMinutes();
        var s = Math.round(that.value.getTime() % 60000 / 1000);

        var hd = that.getHours();
        var id = that.getMinutes();
        var sd = that.getSeconds();

        var views = [
            { value: h, list: hd },
            { value: i, list: id },
            { value: s, list: sd }
        ];
        var scope = that.$root.$pops(views, function(result){
            that.value = new Date([y,m,d].join('/') + ' ' + result.join(':'));
        });
    }
    utils.on(this.$els.root, 'click', this._cb);
}

exports.beforeDestroy = function(){
    this._cb && utils.off(this.$els.root, 'click', this._cb);
}

exports.filters = {
    formatDate: function(value){
        if ( utils.$type(value, 'date') ){
            var h = this.value.getHours();
            var i = this.value.getMinutes();
            var s = Math.round(this.value.getTime() % 60000 / 1000);
            return this.format
                .replace(/h/g, h)
                .replace(/i/g, i)
                .replace(/s/g, s);
        }
    }
}

exports.methods = {
    getHours: function(){
        var result = [];
        for ( i = 0 ; i <= 23 ; i++ ){
            result.push({
                text: i + '时',
                value: i
            });
        }
        return result;
    },
    getMinutes: function(){
        var result = [];
        for ( var i = 0; i <= 59 ; i++ ){
            result.push({
                text: i + '分',
                value: i
            });
        }
        return result;
    },
    getSeconds: function(y, m){
        var result = [];
        for ( var i = 0; i <= 59 ; i++ ){
            result.push({
                text: i + '秒',
                value: i
            });
        }
        return result;
    }
}
