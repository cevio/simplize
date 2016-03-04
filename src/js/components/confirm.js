exports.name = 'ui-confirm';
exports.template =
    '<div class="ui-model-confirm" v-if="status" transition="dialog">' +
        '<ui-middle>' +
            '<div class="ui-model-confirm-inner">' +
                '<div class="ui-model-confirm-box dialog">' +
                    '<div class="title" v-html="title"></div>' +
                    '<div class="content" v-html="content"></div>' +
                    '<div class="buttons">' +
                        '<button class="soe-clearflash" @click="cancel">{{cancelText}}</button>' +
                        '<button class="soe-clearflash" @click="ok">{{okText}}</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</ui-middle>' +
    '</div>';
exports.props = ['status'];

exports.data = function(){
    return {
        title: '',
        content: '',
        okText: 'OK',
        cancelText: 'Cancer'
    }
}

exports.methods = {
    ok: function(){
        this.$parent.type = 0;
        this.$parent.mask = false;
        this.$emit('ok');
        this.$off('ok');
        this.$off('cancel');
    },
    cancel: function(){
        this.$parent.type = 0;
        this.$parent.mask = false;
        this.$emit('cancel');
        this.$off('ok');
        this.$off('cancel');
    }
}
