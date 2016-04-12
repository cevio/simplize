import PULL from './pull';
import TRANSITIONEND from '../../application/transitionend';
const maxTime = 700;
const minTime = 200;

export let pull = {
    name: 'pull',
    template: require('./pull.html'),
    methods: {
        create(){
            this.$scroller = new PULL(this, this.$els.root);
            this.isAnimating = false;
            this.y = 0;
            this._y = 0;
            this.height = this.$els.root.offsetHeight;
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
        move(top, time, cb){
            if ( time ){
                this.setAnimate(time);
                TRANSITIONEND(this.$els.page).bind(() => {
                    TRANSITIONEND(this.$els.page).unbind();
                    this._y = top;
                    this.stopAnimate();
                    this.isAnimating = false;
                    typeof cb && cb();
                });
                this.isAnimating = true;
            }
            this.$els.page.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
        },
        setAnimate(time){ this.$els.page.style.webkitTransition = 'transform ' + time + 'ms ease'; },
        stopAnimate(){ this.$els.page.style.webkitTransition = ''; }
    },
    events: {
        "webview:load": function(){ this.create(); },
        "webview:unload": function(){ this.destroy(); },
        "scroller:start": function(){},


        "scroll:move": function(e){
            this.y = e.currentY - e.startY + this._y;
            this.move(this.y);
            if ( this.y > 0 ){
                const percent = this.y / (this.refresher.height * 2);
                if ( this.y >= this.refresher.height * 2 ){
                    this.$emit('refresh:release', percent);
                }
                else if ( this.y >= this.refresher.height ){
                    this.$emit('refresh:continue', percent);
                }
                else{
                    this.$emit('refresh:start', percent);
                }
            }
        },


        "scroll:end": function(){
            this._y = this.y;
            if ( this.y > 0 ){
                if ( this.y >= this.refresher.height * 2 ){
                    this.move(
                        this.refresher.height,
                        Math.max(maxTime * (this.y - this.refresher.height) / this.height, minTime),
                        () => { this.$emit('refresh'); }
                    );
                }
                else{
                    this.move(
                        0,
                        Math.max(maxTime * (this.y - 0) / this.height, minTime),
                        () => { this.$emit('refresh:reset'); }
                    );
                }
            }
        }
    }
}
