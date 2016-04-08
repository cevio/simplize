export let iframe = {
    template: require('../../../html/webviews/modals/iframe.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () {
                history.back();
            }
            headbar.data.center.text = 'Simplize Modal Iframe';
        }
    },
    methods: {
        click(){
            this.$iframe('http://www.baidu.com/');
        }
    }
}
