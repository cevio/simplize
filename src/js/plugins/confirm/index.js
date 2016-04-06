export let CONFIRM = {
    name: 'sp-ui-confirm',
    template: require('../alert/alert.html'),
    data: function(){
        return {
            text: '',
            title: '',
            showCancel: true,
            status: false
        }
    },
    methods: {
        entry(text = '', title = '') {
            this.$parent.mask = true;
            this.text = text;
            this.title = title;
            this.status = true;
        },

        ok: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('confirm:ok');
            });
        },
        
        cancel: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('confirm:cancel');
            });
        }
    }
};
