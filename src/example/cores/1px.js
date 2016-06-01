export let pxborder = {
    zindex: 3,
        template: require('../../html/webviews/1px.html'),
    events: {
    "webview:load": function() {

    },
    "webview:preset": function(head) {
        head.active();
        head.data.left.icon = '<i class="iconfont icon-back"></i>';
        head.data.left.text = 'Back';
        head.data.right.icon = '';
        head.data.right.text = '';
        head.data.left.click = () => {
            this.$redirect('/');
        }
        head.data.center.text = '1px Border';
    },
    "webview:refresh": function() {
        console.log('refresh');
    }
}
}
