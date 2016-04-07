import {
    on,
    off
} from '../../utils/index';
export let TOAST = {
    name: 'sp-ui-toast',
    template: require('./toast.html'),
    data() {
        return {
            icon:'',
            text: '',
            status: false
        }
    },
    methods: {
        $constructor(text = '', icon = '') {
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.text = text;
                this.icon = icon;
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
