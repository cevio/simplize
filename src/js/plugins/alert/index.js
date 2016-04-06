import {
    on,
    off
} from '../../utils/index';
export let ALERT = {
    name: 'sp-ui-alert',
    template: require('./alert.html'),
    data() {
        return {
            text: '',
            title: '',
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
            this.$emit('alert:ok');
            this.$parent.destroy();
        }
    }
};