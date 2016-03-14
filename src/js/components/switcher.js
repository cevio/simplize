var utils = require('../utils');
exports.name = 'ui-switcher';
exports.template = '<span class="ui-switcher" v-el:root>{{value}}<slot></slot></span>';
exports.props = ['value'];

exports.ready = function(){
    var that = this;
    utils.on(this.$els.root, 'click', this._cb = function(){
        var trees = [];
        var childrens = that.$children;
        for ( var i = 0 ; i < childrens.length ; i++ ){
            if ( childrens[i].isCaser ){
                trees.push({ text: childrens[i].text, value: childrens[i].value });
            }
        }
        that.$root.$selects({
            value: that.value,
            list: trees
        }, function(result){
            that.value = result[0];
        });
    });
}

exports.beforeDestroy = function(){
    utils.off(this.$els.root, 'click', this._cb);
}
