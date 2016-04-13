import {
    nextTick
} from '../../../js/utils/index';

export let pull = {
    template: require('../../../html/webviews/components/pull.html'),
    events: {
        "webview:preset": function (headbar, toolbar) {
            headbar.active();
            headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function () { history.back(); };
            headbar.data.center.text = 'Simplize Component Pull Refresh';
        },
        'pulldown:loading': function(uuid){
            setTimeout(() => {
                this.pulldowns.unshift(this.pulldowns.length);
                this.$broadcast('pulldown:reset', uuid);
            }, 2000)

        },
        'pullup:loading': function(uuid){
            setTimeout(() => {
                this.pullups.push(this.pullups.length);
                nextTick(() => {
                    this.$broadcast('pullup:reset', uuid);
                })
                
            }, 2000)

        }
    },
    data: {
        pulldowns: [],
        pullups: []
    }
};
