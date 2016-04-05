export let CONFIRM = {
    name: 'sp-ui-confirm',
    template: require('./confirm.html'),
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
};