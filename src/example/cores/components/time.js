export let time = {
    template: require('../../../html/webviews/components/time.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Switch';
        },
        "webview:load": function(){
            this.$root.env.time = true;
        },
        "webview:unload": function(){
            this.$root.env.time = false;
        }
    }
};
