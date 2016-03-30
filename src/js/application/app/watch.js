export let appWatches = {
    "req.path": function(){
        this.$emit('app:route');
    }
}
