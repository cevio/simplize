export let progress = {
    template: require('../../../html/webviews/components/progress.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Radio';
        },
        "webview:load": function(){
            var progress = this.$refs.progress;
            this.move(progress);
        },
        "webview:unload": function(){
            if ( this.timer ){
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    },
    data: {
        value: 0
    },
    methods: {
        move(progress){
            this.timer = setInterval(() => {
                if ( this.value >= 1 ){
                    if ( this.timer ){
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    return;
                }
                this.value += 0.01;
            }, 100);
        }
    }
};
