export let radio = {
    template: require('../../../html/webviews/components/radio.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Ratio';
        }
    },
    data: {
        value: 'wow',
        list: [
            { text: '魔兽世界', value: 'wow', border: 0 },
            { text: '传奇霸业', value: 'cqby', border: 1 },
            { text: '武神赵子龙', value: 'zhaoyun', border: 0 },
            { text: '大天使之剑', value: 'anglina', border: 1 },
            { text: '英雄联盟', value: 'lol', border: 0 },
            { text: '反恐精英', value: 'cs', border: 1 },
            { text: '星际争霸', value: 'wowstar', border: 0 },
            { text: '剑侠情缘3', value: 'jx3', border: 1 },
            { text: '龙之谷', value: 'dn', border: 0 }
        ]
    }
};
