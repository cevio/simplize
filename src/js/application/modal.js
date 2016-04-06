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
            status: false
        }
    },
    methods: {
        destroy(){
            this.current = '';
            this.mask = false;
            this.class = '';
        },

        maskClick: function(){
            this.$broadcast('modal:maskclick')
        }
    },
    transitions: {
        fade: {
            afterLeave(){
                this.current === '' && (this.status = false);
            },

            leaveCancelled(){
                console.log('leave cancel');
            }
        }
    }
}
