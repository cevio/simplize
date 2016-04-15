export let range = {
    template: require('../../../html/webviews/components/range.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Range';
        }
    },
    data: {
        value: .5,
        a:.2,
        b:.3,
        c:.4
    }
};
