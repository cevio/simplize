export let switcher = {
    name: 'switcher',
    template: '<div class="sp-ui-switch" @click="click" :class="{active:active}"></div>',
    props: ['pattern', 'value'],
    methods: {
        click(){
            if ( this.active ){
                this.pattern = null;
            }else{
                this.pattern = this.value;
            }
        }
    },
    computed: {
        active(){
            return this.pattern == this.value;
        }
    }
}
