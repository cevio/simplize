import PICKER from './picker';
export let picker = {
    name: 'picker',
    template: require('./picker.html'),
    props: ['data', 'value', 'title'],
    events: {
        "webview:load": function(){
            this.create();
        },
        "webview:unload": function(){
            this.destroy();
        },
        "scroll:selected": function(data, index){
            this.value = data.value;
        }
    },
    methods: {
        create(){
            this.$picker = new PICKER(this);
        },

        destroy(){
            this.$picker._destroy();
            this.$picker = null;
        }
    },
    watch: {
        data: function(){
            this.destroy();
            this.create();
        }
    }
}
