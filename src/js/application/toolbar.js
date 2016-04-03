import * as PROXY from './proxy';
export let Toolbar = {
    name: 'toolbar',
    template: require('../../html/toolbar.html'),
    data: function(){
        return {
            data: this.GetDataFromSimplizeCache(),
            status: false,
            height: 0,
            current: ''
        }
    },
    computed: {
        width: function(){
            return (100 / this.data.length).toFixed(4) + '%';
        }
    },
    events: {
        "browser:added": function(){
            this.data = this.GetDataFromSimplizeCache();
        }
    },
    methods: {
        GetDataFromSimplizeCache: function(){
            let browsers = PROXY.simplizeCache.childrens;
            let results = [];
            let keys = Object.keys(browsers);
            let i = keys.length;
            console.log(i)
            while ( i-- ) {
                if (browsers[keys[i]]._isSync) continue;
                results.push({
                    name: keys[i],
                    icon: browsers[keys[i]].inject.icon,
                    text: browsers[keys[i]].inject.text,
                    url: browsers[keys[i]].inject.url,
                    order: browsers[keys[i]].inject.order
                })
            }
            return results;
        }
    }
}
