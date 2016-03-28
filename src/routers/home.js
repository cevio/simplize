exports.data = {

}
exports.events = {
    beforeload: function() {
        this.$headbar.$reset();
        this.$headbar.center.text = 'Simplize UI for Wechat';
        this.$headbar.class = '';
        this.$toolbar.status = false;
    }
}
