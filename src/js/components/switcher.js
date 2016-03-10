var utils = require('../utils');
exports.name = 'ui-switcher';
exports.template = '<span class="ui-switcher" v-el:root>{{value}}<slot></slot></span>';
exports.data = function(){
    return {
        value: '',
        data: [],
        isSwitcher: true
    }
}

exports.ready = function(){
    var that = this;
    utils.on(this.$els.root, 'click', this._cb = function(){
        that.$root.$selects({
            value: that.value,
            list: that.data
        }, function(result){
            that.value = result[0];
        });
    });
}

exports.beforeDestroy = function(){
    utils.off(this.$els.root, 'click', this._cb);
}
