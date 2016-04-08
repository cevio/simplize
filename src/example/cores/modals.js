export let modals = {
    template: require('../../html/webviews/modals.html'),
    data: {
        components: [
            { text: 'Alert', url: '/modal/alert', icon: 'iconfont icon-info', ok: true },
            { text: 'Confirm', url: '/modal/confirm', icon: 'iconfont icon-roundcheck', ok: true },
            { text: 'Prompt', url: '/modal/prompt', icon: 'iconfont2 icon-prompt', ok: true  },
            { text: 'ActionSheet', url: '/modal/actionsheet', icon: 'iconfont2 icon-sheet', ok:true },
            { text: 'Toast', url: '/modal/toast', icon: 'iconfont icon-squarecheck', ok:true },
            { text: 'Loading', url: '/modal/loading', icon: 'iconfont icon-iconloading-copy', ok:true },
            { text: 'Selector', url: '/modal/selector', icon: 'iconfont2 icon-cc-select', ok: true },
            { text: 'Datetime', url: '/modal/datetime', icon: 'iconfont2 icon-datetime', ok: true },
            { text: 'Tip', url: '/modal/tip', icon: 'iconfont2 icon-tip', ok: true },
            { text: 'Popup', url: '/modal/popup', icon: 'iconfont2 icon-pragpopup', ok: false },
            { text: 'Popover', url: '/modal/popover', icon: 'iconfont2 icon-pop', ok: true }
        ]
    },
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modals';
        }
    }
}
