exports.data = {
  radio:'未选中',
  checkbox:[],
  switch:{
    a:1
  }
}
exports.watch = {
  checkbox:function(newVal){
    console.log(newVal.join(','))
  },
  radio:function(newVal){
    console.log(newVal);
  }
}
exports.methods ={
  toggle:function(tag,source){

  }
}
exports.events = {
    beforeload: function() {
        this.$headbar.$reset();
        this.$headbar.center.text = 'CELL';
        this.$headbar.left.text = '返回';
        this.$headbar.left.icon = '<i class="fa fa-angle-double-left"></i>';
        this.$headbar.left.fn = function(){
          history.go(-1);
        };
        this.$headbar.class = '';
        this.$toolbar.status = false;
    }
}
