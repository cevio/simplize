export let TIP = {
    name: 'tip',
    template: require('./tip.html'),
    data(){ return { html: '', status: false } },
    methods: {
        $constructor(html){
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.status = true;
                this.html = html;
            });
        },
        close(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.html = '';
                this.$emit('tip:close');
            })
        }
    },
    events: {
        "modal:maskclick": function(){
            this.close();
        }
    }
}
