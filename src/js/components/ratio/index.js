export let ratio = {
    name: 'ratio',
    template: '<div class="sp-ratio" :class="much"><div class="sp-ratio-content"><slot></slot></div></div>',
    props: {
        scale: {
            type: Number,
            required: true
        }
    },
    computed: {
        much: function(){
            return 'sp-ratio-' + (this.scale * 100);
        }
    }
}
