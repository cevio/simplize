let data = [];
for(let i = 0; i < 10; i++){
    data.push({
        text: 'popover ' + i
    })
}

export let popover = {
    template: require('../../../html/webviews/modals/popover.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Popover';
        }
    },
    methods: {
        openPopover: function(e){
            this.$popover(e.target, data).then((prompt) => {
                prompt.$on('prompt:ok', (text) => {
                    this.$toast(text, '<i class="iconfont icon-hook f30 line-height-1"></i>');
                })

                prompt.$on('prompt:cancel', () => {
                    this.$toast('prompt cancel', '<i class="iconfont icon-close f30 line-height-1"></i>');
                })
            })
        }
    }
}