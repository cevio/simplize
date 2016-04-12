import PULL from './pull';
export let pull = {
    name: 'pull',
    template: require('./pull.html'),
    methods: {
        create(){
            this.$Scroller = new PULL(this, this.$els.page);
        },
        destroy(){

        }
    },
    events: {
        "webview:load": function(){
            this.create();
        },
        "scroll:move": function(e){
            console.log(e);
        }
    }
}
