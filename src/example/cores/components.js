export let components = {
    template: require('../../html/webviews/components.html'),
    data: {
        components: [
            { text: 'Middle', url: '/component/middle', icon: 'iconfont2 icon-alignmiddle', ok: true },
            { text: 'Ratio', url: '/component/ratio', icon: 'iconfont2 icon-ratio', ok: true },
            { text: 'Datetime', url: '/component/date', icon: 'iconfont2 icon-datetime', ok: true },
            { text: 'Selector', url: '/component/select', icon: 'iconfont2 icon-cc-select', ok: true },
            { text: 'Scroll View', url: '/component/scrollview', icon: 'iconfont2 icon-iconxx2' },
            { text: 'Ago', url: '/component/ago', icon: 'iconfont2 icon-clock' },
            { text: 'Radio', url: '/component/radio', icon: 'iconfont2 icon-radio', ok: true },
            { text: 'Checkbox', url: '/component/checkbox', icon: 'iconfont2 icon-checkbox', ok: true },
            { text: 'switch', url: '/component/switcher', icon: 'iconfont2 icon-switch', ok: true },
            { text: 'Range', url: '/component/range', icon: 'iconfont2 icon-electricrange', ok: true },
            { text: 'Rater', url: '/component/rater', icon: 'iconfont2 icon-star' },
            { text: 'Picker', url: '/component/picker', icon: 'iconfont2 icon-giconpicker', ok: true },
            { text: 'Progress', url: '/component/progress', icon: 'iconfont2 icon-progress' },
            { text: 'Search', url: '/component/search', icon: 'iconfont icon-search' },
            { text: 'Spinner', url: '/component/spinner', icon: 'iconfont2 icon-spinner' },
            { text: 'Circle', url: '/component/circle', icon: 'iconfont2 icon-circle' },
            { text: 'Lazy Image', url: '/component/lazyimage', icon: 'iconfont2 icon-image' }
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
