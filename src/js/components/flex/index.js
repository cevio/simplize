const number = 3;

export let flex = {
    name: 'flex',
    template: '<div class="sp-flex-box sp-flex-row"><slot></slot></div>'
}

export let flexs = {}

for ( let i = 1 ; i <= number ; i++ ){
    flexs['flex-' + i] = {
        name: 'flex-' + i,
        template: '<div class="sp-flex-item sp-flex-' + i + '"><slot></slot></div>'
    }
}

flexs['flex-col'] = {
    name: 'flex-col',
    template: '<div class="sp-flex-box sp-flex-col"><slot></slot></div>'
}
