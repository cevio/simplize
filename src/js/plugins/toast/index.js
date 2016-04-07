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
            autoHideGap: 3000,
            timer: null,
            status: false
        }
    },
    methods: {
        $constructor(text='', icon='') {
            this.$parent.nextTick(() => {
                clearTimeout(this.timer);
                this.$parent.mask = false;
                this.text = text;
                this.icon = icon;
                this.status = true;

                this.timer = setTimeout(() => {
                    this._hide();
                }, this.autoHideGap);
            });
        },

        _hide: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('toast:hide');
            });
        }
    }
};
