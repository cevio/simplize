export let button = {
    template: require('../../html/webviews/button.html'),
    data: {
    },
    events: {
        "webview:preset": function(headbar, toolbar) {
            headbar.active();
            toolbar.active();
            headbar.data.left.icon = '<i class="fa fa-angle-left"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function() {
                history.back();
            }
            headbar.data.center.text = 'Button';
        },
        'webview:load': function() {


        },
        "webview:unload": function() {

        }
    },
    methods: {

    }
}
