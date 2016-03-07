var utils = require('../utils');
exports.name = "ui-checkbox";
exports.props = ['raw', 'value', 'disvalue'];
exports.template =
    '<div class="ui-checkbox clearflash" :class="{active:compute}" v-el:root>' +
        '<label></label>' +
    '</div>';

exports.ready = function(){
    var that = this;
    if ( !this.value ) this.value = '1';
    if ( !this.disvalue ) this.disvalue = '';
    this._cb = function(e){
        if ( that.compute ){
            that.raw = that.disvalue;
        }else{
            that.raw = that.value;
        }
    }
    utils.on(this.$els.root, 'click', this._cb);
}

exports.beforeDestroy = function(){
    this._cb && utils.off(this.$els.root, 'click', this._cb);
}

exports.computed = {
    compute: function(){
        return this.raw == this.value;
    }
}
