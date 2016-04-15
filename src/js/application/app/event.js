export let appEvents = {
    "app:route": function(){
        var that = this;
        this.$cache.dispatch(this.req.path, function(err){
            if ( err ){
                that.$emit('app:passerror', err);
            }else{
                that.$emit('app:passend');
            }
        });
    }
}
