import PULL from './pull';
import TRANSITIONEND from '../../application/transitionend';
import { Deceleration } from '../../application/decelerate';
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
            this._positions = [];
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
            }else if ( time == 0 ){
                this._y = top;
            }
            this.$els.page.style.webkitTransform = 'translate3d(0, ' + top + 'px, 0)';
        },
        setAnimate(time){ this.$els.page.style.webkitTransition = 'transform ' + time + 'ms ease'; },
        stopAnimate(){ this.$els.page.style.webkitTransition = ''; },
        reset(){
            this.move(
                0,
                Math.max(maxTime * (this.y - 0) / this.height, minTime),
                () => { this.$emit('refresh:reset'); }
            );
        },
        refresh(){
            this.move(
                this.refresher.height,
                Math.max(maxTime * (this.y - this.refresher.height) / this.height, minTime),
                () => { this.$emit('refresh'); }
            );
        }
    },
    events: {
        "webview:load": function(){ this.create(); },
        "webview:unload": function(){ this.destroy(); },
        "scroll:start": function(){
            this._positions = [];
        },
        
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

            if(this._positions.length > 40){
                this._positions.splice(0, 20);
            }

            this._positions.push(this.y, e.currentTimeStamp);
        },


        "scroll:end": function(timeStamp){
            this._y = this.y;
            if ( this.y > 0 ){
                if ( this.y >= this.refresher.height * 2 ){
                    this.refresh();
                }
                else{
                    this.reset();
                }
            }
            else {
                let minTop = this.height - this.$els.page.offsetHeight;
                let ins = Deceleration(this._y, this._positions, timeStamp, minTop, 0, (top) => {
                    this.move(top, 0);
                })
            }
        }
    }
}
