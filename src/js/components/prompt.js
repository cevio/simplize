exports.name = 'ui-prompt';
exports.template =
    '<div class="ui-model-prompt" v-if="status" transition="dialog">' +
        '<middle>' +
            '<div class="ui-model-prompt-inner">' +
                '<div class="ui-model-prompt-box dialog">' +
                    '<div class="title" v-html="title"></div>' +
                    '<div class="content">' +
                        '<div v-html="content"></div>' +
                        '<input class="prompt-input" :type="type" :placeholder="placeholder" v-model="value" />' +
                    '</div>' +
                    '<div class="buttons">' +
                        '<button class="clearflash" @click="cancel">{{cancelText}}</button>' +
                        '<button class="clearflash" @click="ok">{{okText}}</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</middle>' +
    '</div>';
exports.props = ['status'];

exports.data = function(){
    return {
        title: '',
        content: '',
        value: '',
        placeholder: '',
        type: 'text',
        okText: 'OK',
        cancelText: 'Cancel'
    }
}

exports.methods = {
    ok: function(){
        this.$parent.type = 0;
        this.$parent.mask = false;
        this.$emit('ok', this.value);
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
