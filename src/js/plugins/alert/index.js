export let ALERT = {
    name: 'sp-ui-alert',
    template: require('./alert.html'),
    data: function(){
        return {
            text: '',
            title: ''
        }
    },
    methods: {
        entry(text = '', title = ''){
            this.text = text;
            this.title = title;
        }
    }
}
