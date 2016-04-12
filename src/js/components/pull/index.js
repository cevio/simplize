import PULL from './pull';
export let pull = {
    name: 'pull',
    template: require('./pull.html'),
    methods: {
        create(){
            this.$scroller = new PULL(this, this.$els.root);
            this.y = 0;
            this._y = 0;
            this.refresher = {
                height: this.$els.refresh.offsetHeight
            }
        },
        destroy(){
            this.$scroller.__destroy();
            this.$scroller = null;
            this.y = 0;
            this._y = 0;
            this.refresher = null;
        },
        move(top){
            this.$els.page.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
        },
    },
    events: {
        "webview:load": function(){
            this.create();
        },
        "scroll:move": function(e){
            this.y = e.currentY - e.startY + this._y;
            this.move(this.y);
            console.log(this.y, this.refresher.height)
        },
        "scroll:end": function(){
            this._y = this.y;
        }
    }
}
