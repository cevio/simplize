export let modal = {
    template: require('../../html/webviews/modal.html'),
    data: {},
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            toolbar.active();
            headbar.data.left.icon = '<i class="fa fa-angle-left"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () {
                history.back();
            }
            headbar.data.center.text = 'ActionSheet';
        },
        'webview:load': function () {

        },
        "webview:unload": function () {

        }
    },
    methods: {
        openSheet: function (needCancel) {
            this.$actionsheet([{text: "wwww"}, {text: "aaaaa"}], needCancel).then((obj) => {
                obj.$on("actionsheet:cancel", function () {
                    //console.log('cancle');
                });
                obj.$on("actionsheet:select", (select) => {
                    //console.log('in')
                    //setTimeout(() => {
                    this.$alert("dsafa")
                    //}, 100);

                })
            })
        },
        openToast: function () {
            this.$toast('数据加载中', false).then((Toast) => {
                Toast.$on('toast:hide', function(){
                    console.log('toastHide');
                })
                
                setTimeout(function(){
                    Toast.hide();
                }, 2000)
            })
        }
    }
}
