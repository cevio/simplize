export let radio = {
    name: 'radio',
    template: '<div class="sp-radio" :class="status" @click="click"><i class="iconfont icon-radio"></i></div>',
    props: ['border', 'pattern', 'value'],
    computed: {
        status(){
            let result = [];
            if ( this.border == 0 ){
                result.push('sp-radio-noborder');
            }
            if( this.pattern == this.value ){
                result.push('checked');
            }
            return result.join(' ');
        }
    },
    methods: {
        click(){
            if ( this.pattern != this.value ){
                this.pattern = this.value;
            }
        }
    }
}
