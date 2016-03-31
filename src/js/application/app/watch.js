export let appWatches = {
    "req.path": function(){
        console.log('in')
        this.$emit('app:route');
    }
}
