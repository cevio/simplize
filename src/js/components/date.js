var utils = require('../utils');
exports.name = 'ui-date';
exports.template = '<span v-el:root>{{value | formatDate}}</span>';
exports.props = ['value', 'format', 'future'];
exports.created = function(){
    if ( !this.value ){
        this.value = new Date();
    }
    if ( !this.format ){
        this.format = 'y-m-d';
    }
    if ( !this.future ){
        this.future = 0;
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

        var yd = that.getYears();
        var md = that.getMonths();
        var dd = that.getDates(y, m);
        var views = [
            { value: y, list: yd },
            { value: m, list: md },
            { value: d, list: dd }
        ];
        var scope = that.$root.$pops(views, function(result){
            that.value = new Date(result.join('/') + ' ' + [h,i,s].join(':'));
        });

        utils.nextTick(function(){
            var selector = scope.$children[0];
            var yc = selector.$children[0];
            var mc = selector.$children[1];
            var dc = selector.$children[2];

            yc.$watch('index', function(value){
                this.$emit('get');
                var result = that.getDates(this.data.value, mc.data.value);
                if ( result.length === dc.data.list.length ) return;
                dc.data.list = result;
                utils.nextTick(function(){
                    dc.$scroller.refresh();
                    dc.$emit('reset');
                });
            });

            mc.$watch('index', function(value){
                this.$emit('get');
                var result = that.getDates(yc.data.value, this.data.value);
                if ( result.length === dc.data.list.length ) return;
                dc.data.list = result;
                utils.nextTick(function(){
                    dc.$scroller.refresh();
                    dc.$emit('reset');
                });
            });
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
        for ( i = 1970 ; i <= year + Number(this.future) ; i++ ){
            result.push({
                text: i + '年',
                value: i
            });
        }
        return result.reverse();
    },
    getMonths: function(){
        var result = [];
        for ( var i = 1; i <= 12 ; i++ ){
            result.push({
                text: utils.mountDate(i) + '月',
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
                text: utils.mountDate(i + 1) + '日',
                value: i + 1
            });
        }
        return result;
    }
}

function getDaysInMonth(year,month){
    month = parseInt(month,10);
    var temp = new Date(year,month,0);
    return temp.getDate();
}
