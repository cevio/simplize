import PICKER from './picker';
export let picker = {
    name: 'picker',
    template: require('./picker.html'),
    props: ['data', 'value'],
    events: {
        "webview:load": function(){
            this.create();
        },
        "webview:unload": function(){
            this.destroy();
        }
    },
    methods: {
        create(){
            this.$picker = new PICKER(this);
        },
        
        destroy(){
            this.$picker._destroy();
        }
    }
}
