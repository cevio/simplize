var utils = require('../utils');
exports.name = 'ui-date';
exports.template = '<span v-el:root>{{value | formatDate}}</span>';
exports.props = ['value', 'format'];
exports.ready = function(){
    var that = this;
    if ( !this.value ){
        this.value = new Date();
    }
    if ( !this.format ){
        this.format = 'y-m-d';
    }
    this._cb = function(e){
        var y = that.value.getFullYear();
        var m = that.value.getMonth() + 1;
        var d = that.value.getDate();
        var yd = that.getYears();
        var md = that.getMonths();
        var dd = that.getDates(y, m);
        var views = [
            { value: y, list: yd, change: 'reday' },
            { value: m, list: md, change: 'reday' },
            { value: d, list: dd }
        ];
        var scope = that.$root.$pops(views, function(result){
            that.value = new Date(result.join('/'));
        });
        scope.class = 'dark';
        scope.$on('reday', function(){
            views[2].list = that.getDates(views[0].value, views[1].value);
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
            var y = value.getFullYear();
            var m = value.getMonth() + 1;
            var d = value.getDate();
            return this.format
                .replace(/y/g, y)
                .replace(/m/g, m)
                .replace(/d/g, d);
        }
    }
}

exports.methods = {
    getYears: function(){
        var result = [];
        var year = Number(new Date().getFullYear());
        for ( i = 1970 ; i <= year ; i++ ){
            result.push({
                text: i,
                value: i
            });
        }
        return result.reverse();
    },
    getMonths: function(){
        var result = [];
        for ( var i = 1; i <= 12 ; i++ ){
            result.push({
                text: i,
                value: i
            });
        }
        return result;
    },
    getDates: function(y, m){
        var days = getDaysInMonth(y, m);
        var result = [];
        for ( var i = 0 ; i < days ; i++ ){
            result.push({
                text: i + 1,
                value: i + 1
            });
        }
        return result;
    }
}

function getDaysInMonth(year,month){
    month = parseInt(month,10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
    var temp = new Date(year,month,0);
    return temp.getDate();
}
