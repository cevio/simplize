export let tip = {
    template: require('../../../html/webviews/modals/tip.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); }
            headbar.data.center.text = 'Simplize Modal Tip';
        }
    },
    methods: {
        click(){
            this.$tip('<div class="p10 f8"><p>燕子去了，有再来的时候；杨柳枯了，有再青的时候；桃花谢了，有再开的时 候。但是，聪明的，你告诉我，我们的日子为什么一去不复返呢？——是有人偷了他 们罢：那是谁？又藏在何处呢？是他们自己逃走了罢——如今又到了哪里呢？</p><p>我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。</p></div>');
        }
    }
}
