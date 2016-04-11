export let spinner = {
    name: 'spinner',
    template: require('./spinner.html'),
    props: {
        mode: {
            type: String,
            default: 'ios'
        }
    }
}
