import PICKER from './picker';
export let picker = {
    name: 'picker',
    isPicker: true,
    template: require('./picker.html'),
    props: ['data', 'value', 'title'],
    events: {
        "webview:load": function(){
            this.create();
        },
        "webview:unload": function(){
            this.destroy();
        },
        "scroll:select": function(data, index){
            this.value = data.value;
            this.$emit('scroll:selected', data, index);
        }
    },
    methods: {
        create(){
            this.$picker = new PICKER(this);
        },

        destroy(){
            if ( !this.$picker ) return;
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
