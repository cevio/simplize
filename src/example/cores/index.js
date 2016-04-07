export let index = {
    zindex: 2,
    template: require('../../html/index.html'),
    events: {
        "webview:preset": function(head, tool) {
            head.active();
            head.data.left.icon = '<i class="iconfont icon-sort"></i>';
            head.data.right.icon = '<i class="iconfont icon-more"></i>';
            head.data.center.text = 'Simplize Application Builder';
            this.SP_webviewContentClass = 'test1';
        }
    }
}
