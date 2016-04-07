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
        $constructor(text='加载中', autoHide=true, icon='<i class="iconfont icon-loading"></i>') {
            this.$parent.nextTick(() => {
                clearTimeout(this.timer);
                this.$parent.mask = true;
                this.text = text;
                this.icon = icon;
                this.status = true;

                if(autoHide){
                    this.timer = setTimeout(() => {
                        this.hide();
                    }, this.autoHideGap);
                }
            });
        },

        hide: function(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('toast:hide');
            });
        }
    }
};
