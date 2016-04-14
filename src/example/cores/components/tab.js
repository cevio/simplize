export let tab = {
    template: require('../../../html/webviews/components/tab.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Tab';
        },

        "tab:selected": function(){
            this.tab1 = this.$refs.tab1.index;
            this.tab2 = this.$refs.tab2.index;
            this.tab3 = this.$refs.tab3.index;
            this.tab4 = this.$refs.tab4.index;
        }
    },
    
    data: {
        tab1: null,
        tab2: null,
        tab3: null,
        tab4: null
    }
};
