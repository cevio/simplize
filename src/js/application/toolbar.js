import * as PROXY from './proxy';
export let Toolbar = {
    name: 'toolbar',
    template: require('../../html/toolbar.html'),
    data(){
        return {
            data: this.GetDataFromSimplizeCache(),
            status: false,
            height: 0,
            current: ''
        }
    },
    computed: {
        width(){
            return (100 / this.data.length).toFixed(4) + '%';
        },
        transition(){
            return this.$root.env.stopAnimate
                ? ''
                : (
                    this.$root.SP_firstEnter
                    ? 'none'
                    : 'sp-toolbar'
                );
        }
    },
    events: {
        "browser:added": function(){
            this.data = this.GetDataFromSimplizeCache();
        },
        "toolbar:before": function(){
            this.status = false;
        }
    },
    methods: {
        GetDataFromSimplizeCache(){
            let browsers = PROXY.simplizeCache.childrens;
            let results = [];
            let keys = Object.keys(browsers);
            let i = keys.length;
            while ( i-- ) {
                if (browsers[keys[i]]._isSync) continue;
                let order = browsers[keys[i]].inject.order;
                if ( order === undefined ){
                    order = 99;
                }
                results.push({
                    name: keys[i],
                    icon: browsers[keys[i]].inject.icon,
                    text: browsers[keys[i]].inject.text,
                    url: browsers[keys[i]].inject.url,
                    order: order
                })
            }
            return results;
        },
        active(){
            this.status = true;
        },
        remove(){
            this.status = false;
        }
    },
    watch: {
        status(state){
            if ( state ){
                this.height = this.$els.root.offsetHeight;
            }else{
                this.height = 0;
            }
        }
    }
}
