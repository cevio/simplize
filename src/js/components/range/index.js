import SCROLL from '../../application/scroll';

export let range = {
    name: 'range',
    template: '<div class="sp-range" v-el:root><dt :style="trigger" v-el:trigger :class="class"></dt><dl v-el:line :class="class"></dl></div>',
    props: {
        value: {
            type: Number
        },
        mode: {
            type: String,
            default: 'lazy'
        }
    },
    data(){
        return {
            width: 0,
            offset: 0,
            distence: 0,
            now: 0,
            class: 'move',
            moved: 0,
            moving: false
        }
    },
    methods: {
        create(){
            this.width = this.$els.root.offsetWidth;
            this.offset = this.$els.trigger.offsetWidth / 2;
            this.distence = this.width - this.offset * 2;
            this.now = this.value * this.distence;
            this.move(this.now);
            this.post(this.now);
            this.scroller = new SCROLL(this, this.$els.trigger);
        },
        destroy(){
            this.scroller && this.scroller.__destroy();
            this.scroller = null;
        },
        move(left){
            this.$els.trigger.style.webkitTransform = 'translate3d(' + left + 'px, 0, 0)';
        },
        post(left){
            this.$els.line.style.width = (left + this.offset) + 'px';
        }
    },
    events: {
        "webview:load": function(){
            this.create();
        },
        "scroll:start": function(){
            this.moving = true;
            this.class = '';
        },
        "scroll:move": function(e){
            this.moved = this.now + (e.currentX - e.startX);
            if ( this.moved < 0 ){
                this.moved = 0;
            }

            if ( this.moved > this.distence ){
                this.moved = this.distence;
            }

            this.move(this.moved);
            this.post(this.moved);

            if ( this.mode != 'lazy' ){
                this.value = this.moved / this.distence;
            }
        },
        "scroll:end": function(){
            this.class = 'move';
            this.moving = false;
            this.now = this.moved;
            this.moved = 0;
            if ( this.mode === 'lazy' ){
                this.value = this.now / this.distence;
            }
        }
    },
    watch: {
        value(val){
            if ( !this.moving ){
                this.now = this.distence * this.value;
                this.move(this.now);
                this.post(this.now);
            }
        }
    }
}
