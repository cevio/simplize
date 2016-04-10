export let checkbox = {
    name: 'checkbox',
    template: '<div class="sp-radio" :class="status" @click="click"><i class="iconfont icon-radio"></i></div>',
    props: {
        border: {
            default: 0
        },
        pattern: {
            type: Array,
            required: true
        },
        value: {
            required: true
        }
    },
    methods: {
        click(){
            const index = this.pattern.indexOf(this.value);
            if ( index == -1 ){
                this.pattern.push(this.value);
            }else{
                this.pattern.splice(index, 1);
            }
        }
    },
    computed: {
        status(){
            let result = [];
            if ( this.border == 0 ){
                result.push('sp-radio-noborder');
            }
            if( this.pattern.indexOf(this.value) > -1 ){
                result.push('checked');
            }
            return result.join(' ');
        }
    }
}
