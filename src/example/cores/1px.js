export let info = {
    zindex: 3,
        template: require('../../html/1px.html'),
    events: {
    "webview:load": function() {
        console.log('info load')
    },
    "webview:preset": function(head) {
        head.active();
        head.data.left.icon = '<i class="fa fa-send"></i>';
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
