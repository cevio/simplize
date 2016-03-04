var animationend = require('animationend');

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
