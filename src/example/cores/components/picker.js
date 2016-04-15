let strs = [];

for ( let i = 1; i < 11 ; i++ ){
    strs.push({ text: '第' + i + '个', value: i });
}

export let picker = {
    template: require('../../../html/webviews/components/picker.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Middle';
        }
    },
    data: {
        data: strs,
        value: 3
    }
};
