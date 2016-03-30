export let filters = {
    rem: function(val){
        return val / this.$root.env.viewScale;
    }
}
