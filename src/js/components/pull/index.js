import XScroll from 'sp-scroll'
import PULLDOWN from './pull-down';
import PULLUP from './pull-up';
import LAZYLOAD from 'sp-scroll/plugins/lazyload';


export let pull = {
    name: 'pull',
    template: require('./pull.html'),
    props: {
        "refresh": Boolean,
        "loadmore": Boolean,
        "lazyload": Boolean
    },
    methods: {
        create(){
            let content = null, that = this;
            const slotChildren = this.$els.page.childNodes
            for (let i = 0; i < slotChildren.length; i++) {
                if (slotChildren[i].nodeType === 1) {
                    content = slotChildren[i]
                    break
                }
            }
            if (!content) {
                throw new Error('no content is found');
            }

            this.$puller = new XScroll({
                renderTo: this.$els.root,
                container: this.$els.page,
                content: content,
                lockX: true,
                lockY: false,
                scrollbarX: false,
                scrollbarY: false,
                useTransition: true,
                bounce: true,
                useOriginScroll: false,
                boundryCheck: true,
                preventDefault: true,
                gpuAcceleration: true
            });

            this.$puller.on('scroll', (arg) => {
                this.$emit('scroll', arg);
            });

            if ( this.lazyload ){
                this.$puller.plug(new LAZYLOAD({
                    imgSetter(img) {
            			var src = img.getAttribute("data-src");
                        img.onload = function(){
                            img.style.opacity = '1';
                            that.reset();
                        }
                        img.src = src;
            		}
                }));
            }

            let rendered = false;

            if ( this.refresh ){
                let pulldown = new PULLDOWN({
                    el: this.$els.refresh,
                    cb_start(scrollTop, percent){ that.$emit('refresh:start', scrollTop, percent); },
                    cb_move(scrollTop, percent){ that.$emit('refresh:move', scrollTop, percent); },
                    cb_over(scrollTop, percent){ that.$emit('refresh:over', scrollTop, percent); },
                    cb_refresh(){ that.$emit('refresh'); }
                 });
                 this.$puller.plug(pulldown);
                 this.$pulldown = pulldown;
                 rendered = true;
            }

            if ( this.loadmore ){
                let pullup = new PULLUP({
                    el: this.$els.loadmore,
                    cb_start(scrollTop, percent){ that.$emit('loadmore:start', scrollTop, percent); },
                    cb_move(scrollTop, percent){ that.$emit('loadmore:move', scrollTop, percent); },
                    cb_over(scrollTop, percent){ that.$emit('loadmore:over', scrollTop, percent); },
                    cb_loadmore(){ that.$emit('loadmore'); }
                 });
                 this.$puller.plug(pullup);
                 this.$pullup = pullup;
                 rendered = true;
            }

            !rendered && this.$puller.render();
        },
        destroy(){
            this.$puller && this.$puller.destroy();
            this.$puller =
            this.$pulldown =
            this.$pullup = null;
        },
        reset(){
            if ( this.timer ){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.$puller.resetSize();
            },10);
        }
    },
    events: {
        "webview:load": function(){
            this.create();
        },
        "webview:preunload": function(){
            this.destroy();
        },
        "refresh:reset": function(){
            this.$pulldown.reset();
        },
        "loadmore:reset": function(){
            this.$pullup.reset();
        }
    }
}
