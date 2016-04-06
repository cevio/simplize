export let info = {
    zindex: 3,
        template: require('../../html/info.html'),
    events: {
    "webview:load": function() {
        console.log('info load')
    },
    "webview:preset": function(head) {
        head.active();
        head.data.left.icon = '<i class="fa fa-send"></i>';
        head.data.left.text = 'Back';
        head.data.right.icon = '<i class="fa fa-map-marker"></i>';
        head.data.right.text = 'options';
        head.data.left.click = () => {
            this.$redirect('/');
        }
        head.data.center.text = 'Simplize info';
        this.SP_webviewContentClass = 'test2';
    },
    "webview:refresh": function() {
        console.log('refresh');
    }
}
}