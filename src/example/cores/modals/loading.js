export let loading = {
    template: require('../../../html/webviews/modals/loading.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Loading';
        }
    },
    methods: {
      openLoading:function(){
        this.$loading().then(function(loading){
          setTimeout(function(){
            loading.hide();
          },3000)

        })
      },
      openLoading1:function(){
        this.$loading('已完成').then(function(loading){
          setTimeout(function(){
            loading.hide();
          },3000)
        });

      }
    }
}
