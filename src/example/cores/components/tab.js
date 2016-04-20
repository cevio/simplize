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
        "webview:load": function(){
            const tab1 = this.$refs.tab1;
            const tab2 = this.$refs.tab2;
            const tab3 = this.$refs.tab3;
            const tab4 = this.$refs.tab4;
            [ tab1, tab2, tab3, tab4 ]
            .forEach((tab, index) => {
                tab.$on('tab:select', (vm, _index) => {
                    this['tab' + (index + 1)] = _index;
                });
            });
        }
    },

    data: {
        tab1: null,
        tab2: null,
        tab3: null,
        tab4: null
    }
};
