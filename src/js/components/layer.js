var animationend = require('animationend');
var utils = require('../utils');

exports.name = 'ui-layer';
exports.template = '<div class="ui-model-layer" v-if="status" transition="fade" v-el:masker></div>';
exports.props = ['status'];
exports.watch = {
    status: function(value){
        if ( !value ){
            this.$emit('listen');
        }
    }
}
exports.events = {
    listen: function(){
        var that = this;
        animationend(this.$els.masker).then(function(){
            that.$parent.$emit('destroy');
        });
    }
}

exports.transitions = {
    fade: {
        enter: function(){
            var that = this;
            this._cb = function(){
                that.$parent.$broadcast('destroy');
            }
            utils.nextTick(function(){
                utils.on(that.$els.masker, 'click', that._cb);
            });
        },
        leave: function(){
            if ( typeof this._cb === 'function' ){
                utils.off(this.$els.masker, 'click', this._cb);
            }
        }
    }
}
