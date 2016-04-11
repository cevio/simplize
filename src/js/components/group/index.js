export let group = {
    name: 'ui-group',
    template: '<div class="sp-cell-group"><slot></slot></div>'
}

export let cell = {
    name: 'ui-cell',
    template: '<div class="sp-cell" :class="{linked:linked}"><slot></slot></div>',
    props: {
        link: {
            type: String,
            default: 'off'
        }
    },
    computed: {
        linked(){
            return this.link == 'on';
        }
    }
}

export let cellHead = {
    name: 'ui-cell-head',
    template: '<div class="sp-cell-hd"><slot></slot></div>'
}

export let cellBody = {
    name: 'ui-cell-body',
    template: '<div class="sp-cell-bd"><slot></slot></div>'
}

export let cellFoot = {
    name: 'ui-cell-foot',
    template: '<div class="sp-cell-ft"><slot></slot></div>'
}
