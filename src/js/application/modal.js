import * as PROXY from './proxy';
export let modal = {
    name: 'modal',
    template: require('../../html/modal.html'),
    components: PROXY.plugins,
    data: function(){
        return {
            current: '',
            mask: false,
            class: '',
            status: false,
            pool: 0,
            end: false
        }
    },
    methods: {
        destroy(){
            this.current = '';
            this.mask = false;
            this.class = '';
            this.status = false;
        },
        maskClick(){
            this.$broadcast('modal:maskclick');
        },
        nextTick(fn){
            //++this.pool;
            this.pool = 1;
            typeof fn === 'function' && fn();
        },
        prevTick(fn){
            this.$nextTick(() => {
                typeof fn === 'function' && fn();
                this.pool--;
            });
        }
    },
    transitions:{
        fade: {
            afterLeave(){
                if ( !this.end ) return;
                this.current = '';
                this.class = '';
                this.status = false;
            }
        }
    },
    watch: {
        pool(val){
            if ( val <= 0 ){
                this.end = true;
                if ( this.mask === true ){
                    this.mask = false;
                    //this.$nextTick(() => );
                }else{
                    this.destroy();
                    //this.$nextTick(() => );
                }
            }else{
                if ( this.end == true ){
                    this.end = false;
                }
            }
        }
    }
}
