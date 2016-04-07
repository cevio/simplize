export let components = {
    template: require('../../html/webviews/components.html'),
    data: {
        components: [
            { text: 'Middle', url: '/component/middle' },
            { text: 'Ratio', url: '/modal/ratio' },
            { text: 'Datetime', url: '/modal/cp-datetime' },
            { text: 'Selector', url: '/modal/cp-selector' },
            { text: 'Scrollview', url: '/modal/scrollview' },
            { text: 'Ago', url: '/modal/ago' },
            { text: 'Radio', url: '/modal/radio' },
            { text: 'Checkbox', url: '/modal/checkbox' },
            { text: 'switch', url: '/modal/switch' }
        ]
    },
    events: {
        "webview:preset": function(headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Components';
        }
    }
}
