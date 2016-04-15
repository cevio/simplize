const number = 3;

export let flex = {
    name: 'flex',
    props: { col: Boolean },
    template: '<div class="sp-flex-box" :class="class"><slot></slot></div>',
    computed: {
        class: function(){
            return this.col ? 'sp-flex-col' : 'sp-flex-row';
        }
    }
}

export let flexs = {}

for ( let i = 1 ; i <= number ; i++ ){
    flexs['flex-' + i] = {
        name: 'flex-' + i,
        template: '<div class="sp-flex-item sp-flex-' + i + '"><slot></slot></div>'
    }
}
