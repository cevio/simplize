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
            showCancel: false,
            status: false
        }
    },
    methods: {
        $constructor(text = '', title = '') {
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
