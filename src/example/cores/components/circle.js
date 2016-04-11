
export let circle = {
        template: require('../../../html/webviews/components/circle.html'),
        events: {
            "webview:preset": function (headbar, toolbar) {
                headbar.active();
                headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
                headbar.data.left.text = 'Back';
                headbar.data.left.click = function () {
                    history.back();
                };
                headbar.data.center.text = 'Simplize Component Circle';
            }
        },
        data: {
            height: 200,
            width: 200,
            strokeWidth: 4,
            trailWidth: 10,
            percent: 40
        },
        methods: {
            task: function(){
                setInterval(() => {
                    this.percent = Math.round( Math.random() * 100 );
                }, 2000)
            }
        },
        ready: function(){
            this.task();
        }
    }
;
