export let CONFIRM = {
    name: 'sp-ui-confirm',
    template: require('../alert/alert.html'),
    data: function(){
        return {
            text: '',
            title: '',
            showCancel: true
        }
    },
    methods: {
        $constructor(text = '', title = '') {
            this.$parent.mask = true;
            this.text = text;
            this.title = title;
        },

        ok: function(){
            this.$emit('confirm:ok');
            this.$parent.destroy();
        },

        cancel: function(){
            this.$emit('confirm:cancel');
            this.$parent.destroy();
        }
    }
};
