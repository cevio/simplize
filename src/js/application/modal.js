import * as PROXY from './proxy';
export let modal = {
    name: 'modal',
    template: require('../../html/modal.html'),
    components: PROXY.plugins,
    data: function(){
        return {
            current: '',
            mask: false
        }
    }
}
