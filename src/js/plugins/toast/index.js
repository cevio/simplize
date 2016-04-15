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
        $constructor(text='', ...args) {
            let time = this.autoHideGap;
            let icon = '';
            
            if(args.length === 1){
                if(typeof args[0] === 'number'){
                    time = args[0];
                }
                else {
                    icon = args[0]
                }
            }
            
            if(args.length === 2){
                time = args[0];
                icon = args[1];
            }
            this.$parent.nextTick(() => {
                clearTimeout(this.timer);
                this.$parent.mask = false;
                this.text = text;
                this.icon = icon;
                this.status = true;

                this.timer = setTimeout(() => {
                    this._hide();
                }, time);
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
