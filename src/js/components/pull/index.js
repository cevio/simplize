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
            this.startY = 0;
            this.currentY = 0;
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
            this.startY = 0;
            this.currentY = 0;
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
                    typeof cb === 'function' && cb();
                });
                this.isAnimating = true;
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
        },
        slow(y){
            const h = this.refresher.height;
            const H = this.height;
            const m = H - 2 * h;
            const max = ((2 * m * h + 4 * pow(h)) * -1 - ( pow(4 * h + m) / (-4) )) / m + 2 * h;
            const a = (4 * h + m) / 2;

            let r;

            if ( y > a ){
                r = max;
            }else{
                r = (1 - (y - 2 * h) / (H - 2 * h)) * (y - 2 * h) + 2 * h;
            }

            this.move(r);
        }
    },
    events: {
        "webview:load": function(){ this.create(); },
        "webview:unload": function(){ this.destroy(); },
        "scroll:start": function(){
            this._positions = [];
        },

        "scroll:move": function(e){
            this.startY = e.startY;
            this.currentY = e.currentY;
            this.y = e.currentY - e.startY + this._y;
            if ( this.y > 0 ){
                const percent = this.y / (this.refresher.height * 2);
                if ( this.y >= this.refresher.height * 2 ){
                    this.slow(this.y);
                    this.$emit('refresh:release', percent);
                }
                else if ( this.y >= this.refresher.height ){
                    this.move(this.y);
                    this.$emit('refresh:continue', percent);
                }
                else{
                    this.move(this.y);
                    this.$emit('refresh:start', percent);
                }
            }else{
                this.move(this.y);
            }

            if(this._positions.length > 40){
                this._positions.splice(0, 20);
            }

            this._positions.push(this.y, e.currentTimeStamp);
        },


        "scroll:end": function(timeStamp){
            this._y = this.y;
            let minTop = this.height - this.$els.page.offsetHeight;
            if ( this.y > 0 ){
                if ( this.y >= this.refresher.height * 2 ){
                    this.refresh();
                }
                else{
                    this.reset();
                }
            }
            else if ( this.y < 0 ){
                if ( this.startY < this.currentY ){
                    
                }
                let lastTop;
                console.log('end');
                let ins = Deceleration(this._y, this._positions, timeStamp, minTop, 0, (top, dtop) => {
                    if(top === true){
                        this._y = lastTop;
                    }
                    else if(top === false){
                        if(dtop){
                            this.y = dtop;
                        }
                        this.move(minTop, Math.max(maxTime * (Math.abs(this.y - minTop)) / this.height, minTime));
                        console.log('no decelerate')
                    }
                    else {
                        lastTop = top;
                        this.move(top);
                    }
                })
            }

            this.startY = 0;
            this.currentY = 0;
        }
    }
}

function pow(val){
    return Math.pow(val, 2);
}
