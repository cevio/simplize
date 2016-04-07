export let components = {
    template: require('../../html/webviews/components.html'),
    data: {
        components: [
            { text: 'Middle', url: '/component/middle' },
            { text: 'Ratio', url: '/component/ratio' },
            { text: 'Datetime', url: '/component/cp-datetime' },
            { text: 'Selector', url: '/component/cp-selector' },
            { text: 'Scroll View', url: '/component/scrollview' },
            { text: 'Ago', url: '/component/ago' },
            { text: 'Radio', url: '/component/radio' },
            { text: 'Checkbox', url: '/component/checkbox' },
            { text: 'switch', url: '/component/switch' },
            { text: 'Range', url: '/component/range' },
            { text: 'Rater', url: '/component/rater' },
            { text: 'Picker', url: '/component/picker' },
            { text: 'Progress', url: '/component/progress' },
            { text: 'Search', url: '/component/search' },
            { text: 'Spinner', url: '/component/spinner' },
            { text: 'Circle', url: '/component/circle' },
            { text: 'Lazy Image', url: '/component/lazyimage' }
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
