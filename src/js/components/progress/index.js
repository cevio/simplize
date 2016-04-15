export let progress = {
    name: 'progress',
    template: '<div class="sp-progress"><dl role="progress-bar" :style="{width:width}" class="move"></dl></div>',
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    computed: {
        width(){
            return (this.value * 100) + '%';
        }
    }
}
