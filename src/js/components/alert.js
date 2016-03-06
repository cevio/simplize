exports.name = 'ui-dialog';
exports.template =
    '<div class="ui-model-alert" v-if="status" transition="dialog">' +
        '<middle>' +
            '<div class="ui-model-alert-inner">' +
                '<div class="ui-model-alert-box dialog">' +
                    '<div class="title" v-html="title"></div>' +
                    '<div class="content" v-html="content"></div>' +
                    '<button class="buttons clearflash" @click="ok">{{button}}</button>' +
                '</div>' +
            '</div>' +
        '</middle>' +
    '</div>';
exports.props = ['status'];

exports.data = function(){
    return {
        title: '',
        content: '',
        button: 'OK'
    }
}

exports.methods = {
    ok: function(){
        this.$parent.type = 0;
        this.$parent.mask = false;
        this.$emit('ok');
        this.$off('ok');
    }
}
