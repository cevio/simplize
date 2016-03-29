exports.data = {

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
