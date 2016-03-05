var utils = require('../utils');
exports.name = "ui-checkbox";
exports.props = ['raw', 'value', 'shape', 'type', 'disvalue'];
exports.template =
    '<div class="ui-checkbox" :class="classes" v-el:root>' +
        '<label></label>' +
    '</div>';

exports.ready = function(){
    var that = this;
    if ( !this.checked ) this.value = '1';
    if ( !this.shape ) this.shape = 'round'; // round square
    if ( !this.type ) this.type = 'hook'; // hook round
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
    },
    classes: function(){
        var classes = [this.shape, this.type];
        if ( this.compute ){
            classes.push('active');
        }
        return classes.join(' ');
    }
}
