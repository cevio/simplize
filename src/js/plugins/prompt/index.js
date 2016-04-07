export let PROMPT = {
    name: 'sp-ui-prompt',
    template: require('./prompt.html'),
    data: function(){
        return {
            title: '',
            status: false,
            value: ''
        }
    },
    methods: {
        $constructor(title = '请输入内容'){
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.title = title;
                this.value = '';
                this.status = true;
            });
        },
        
        cancel: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('prompt:cancel');
            });
        },
        
        ok: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('prompt:ok', this.value);
            });
        }
    }
};
