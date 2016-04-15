export let actionsheet = {
    template: require('../../../html/webviews/modals/actionsheet.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Actionsheet';
        }
    },
    methods:{
      openSheet1:function(){
        this.$actionsheet([{text:'action1'},{text:'action2'}],true).then(function(opt){
          opt.$on("actionsheet:select",function(select){
            alert(select.text);
          });
        });
      },
      openSheet2:function(){
        this.$actionsheet([{text:'action1'},{text:'action2'}],false).then(function(opt){
          opt.$on("actionsheet:select",function(select){
            alert(select.text);
          })
        });
      }
    }
}
