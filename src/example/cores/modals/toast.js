export let toast = {
    template: require('../../../html/webviews/modals/toast.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Toast';
        }
    },
    methods:{
      openToast1:function(){
        this.$toast("3s后关闭","<i class='iconfont icon-hook f30 line-height-1'></i>")
      },
      openToast2:function(){
        this.$toast("3s后关闭","<i class='iconfont icon-apps f20 line-height-1 '></i>");
      }
    }
}
