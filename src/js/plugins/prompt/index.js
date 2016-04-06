export let PROMPT = {
    name: 'sp-ui-prompt',
    template: require('./prompt.html'),
    data: function(){
        return {
            text: '',
            title: ''
        }
    },
    methods: {
        $constructor(text = '', title = ''){
            this.text = text;
            this.title = title;
        }
    }
};
