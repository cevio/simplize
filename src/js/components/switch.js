var utils = require('../utils');

exports.name = 'ui-switch';
exports.template = '<div class="ui-switch clearflash" :class="{active:value==1}" v-el:switcher><input type="hidden" name="{{name}}" value="{{value}}" v-if="name" /></div>';
exports.props = ['value', 'name'];
exports.ready = function(){
    var that = this;
    this._cb = function(e){
        that.value = !!that.value ? 0 : 1;
    }
    utils.on(this.$els.switcher, 'click', this._cb);
}
exports.watch = {};
exports.watch.value = function(newValue, oldValue){
    this.$on('change', newValue, oldValue);
}
exports.beforeDestroy = function(){
    this._cb && utils.off(this.$els.switcher, 'click', this._cb);
}
