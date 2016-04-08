export let IFRAME = {
    name: 'sp-ui-iframe',
    template: require('./iframe.html'),
    data(){ return { src: '', status: false } },
    methods: {
        $constructor(src){
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.src = src;
                this.status = true;
            });
        },
        close(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.src = '';
                this.$emit('iframe:close');
            })
        }
    },
    events: {
        "modal:maskclick": function(){
            this.close();
        }
    }
}
