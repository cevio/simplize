export let confirm = {
    template: require('../../../html/webviews/modals/confirm.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Confirm';
        }
    },
    methods: {
        openConfirm(){
            this.$confirm('Simple提示信息').then(function(confirm){
                confirm.$on('confirm:ok', function(){
                    console.log('confirm ok')
                });

                confirm.$on('confirm:cancel', function(){
                    console.log('confirm cancel')
                })
            })
        },

        openConfirmWithTitle(){
            this.$confirm('Simple提示信息', '自定义Title').then(function(confirm){
                confirm.$on('confirm:ok', function(){
                    console.log('confirm ok')
                })

                confirm.$on('confirm:cancel', function(){
                    console.log('confirm cancel')
                })
            });
        }
    }
}
