export let select = {
    template: require('../../../html/webviews/components/select.html'),
    data: {
        list: [
            { text: '魔兽世界', value: 'wow' },
            { text: '传奇霸业', value: 'cqby' },
            { text: '武神赵子龙', value: 'zhaoyun' },
            { text: '大天使之剑', value: 'anglina' },
            { text: '英雄联盟', value: 'lol' },
            { text: '反恐精英', value: 'cs' },
            { text: '星际争霸', value: 'wowstar' },
            { text: '剑侠情缘3', value: 'jx3' },
            { text: '龙之谷', value: 'dn' }
        ],
        value: 'lol'
    },
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Select';
        }
    }
};
