export let buttons = {
    template: require('../../html/webviews/buttons.html'),
    events: {
        "webview:preset": function(headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Buttons';
        }
    }
}
