export let datetime = {
    template: require('../../../html/webviews/modals/datetime.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Datetime';
        }
    },
    methods: {
        click(){
            this
            .$datetime(new Date(), 'ymdhis')
            .then((obj) => {
                obj.$on('datetime:ready', (selector) => {
                    selector.$on('select:ok', (vals) => {
                        this.$alert(vals.join('-'));
                    })
                });
            })
        }
    }
}
