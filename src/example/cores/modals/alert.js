export let alert = {
    template: require('../../../html/webviews/modals/alert.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Alert';
        }
    },
    methods: {
        openAlert(){
            this.$alert('Simple警告信息')
        },
        
        openAlertWithTitle(){
            this.$alert('Simple警告信息', '自定义Title');
        }
    }
};

