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
            title: ''
        }
    },
    methods: {
        entry(text = '', title = '') {
            this.$parent.mask = true;
            this.text = text;
            this.title = title;
        }
    }
}