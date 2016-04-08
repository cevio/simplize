export let IFRAME = {
    name: 'sp-ui-iframe',
    template: require('./iframe.html'),
    data() {
        return {
            text: '',
            title: '',
            showCancel: false,
            status: false
        }
    },
    methods: {
        $constructor(src) {
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.text = text;
                this.title = title;
                this.status = true;
            });
        },

        ok: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('alert:ok');
            });
        }
    }
};
