export let prompt = {
    template: require('../../../html/webviews/modals/prompt.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Prompt';
        }
    },
    methods: {
        openPrompt: function(){
            this.$prompt('请输入一段文字').then(function(prompt){
                prompt.$on('prompt:ok', function(text){
                    console.log(text);
                })
                
                prompt.$on('prompt:cancel', function(){
                    console.log('prompt cancel');
                })
            })
        }
    }
}
