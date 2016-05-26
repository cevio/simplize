export let appWatches = {
    "req.href": function(){
        this.$emit('app:route');
    },
    "env.time": function(val){
        if ( val ){
            this.env.now = new Date();
            this.env.timer = setInterval(() => {
                this.env.now = new Date();
            }, 1000);
        }
        else {
            if ( this.env.timer ){
                clearInterval(this.env.timer);
            }
        }
    }
}
