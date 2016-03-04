var animationend = require('animationend');
exports.name = 'ui-loader';
exports.template =
    '<div class="ui-model-loader" v-if="status" transition="fade" v-el:loader>' +
        '<ui-middle>' +
            '<div class="ui-model-loader-inner">' +
                '<div class="ui-model-loader-box" :class="{dark:isblack,wide:iswide}">' +
                    '<div v-if="iswide">' +
                        '<div class="loader-content" v-html="content"></div>' +
                        '<div class="loader-icon"></div>' +
                    '</div>' +
                    '<div v-else>' +
                        '<div class="loader-icon"></div>' +
                        '<div class="loader-content" v-html="content"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</ui-middle>' +
    '</div>';

exports.props = ['status'];

exports.data = function(){
    return {
        iswide: false,
        isblack: true,
        content: ''
    }
}

exports.methods = {
    close: function(){
        this.$emit('close', true);
        this.$off('close');
    }
}

exports.events = {
    close: function(lazy){
        this.$parent.type = 0;
        if ( this.$parent.mask ){
            this.$parent.mask = false;
        }else{
            var that = this;
            animationend(this.$els.loader).then(function(){
                that.$parent.$emit('destroy');
            });
            this.status = false;
        }
        if ( !lazy ){
            this.$off('close');
        }
    }
}
