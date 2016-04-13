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
        "webview:load": function(){
            let scroller = this.$refs.pull;
            scroller.$on('refresh:start', (t, p) => {
                this.a = p * 100;
                this.at = '下拉刷新数据';
                this.ia = '<i class="iconfont icon-down"></i>';
                this.ac = '';
            });
            scroller.$on('refresh:move', (t, p) => {
                this.a = p * 100;
                this.at = '继续下拉将刷新';
                this.ia = '<i class="iconfont icon-down"></i>';
                this.ac = '';
            });
            scroller.$on('refresh:over', (t, p) => {
                this.a = p * 100;
                this.at = '松开刷新数据';
                this.ia = '<i class="iconfont icon-down"></i>';
                this.ac = 'up';
            });
            scroller.$on('refresh', () => {
                this.a = 100;
                this.at = '正在刷新数据';
                this.ia = '<i class="iconfont icon-down"></i>';
                this.ac = 'up';
                console.log('refreshing');
                setTimeout(() => {
                    scroller.$emit('refresh:reset');
                }, 3000);
            });
            scroller.$on('loadmore', () => {
                console.log('loadmoreing');
                setTimeout(() => {
                    scroller.$emit('loadmore:reset');
                }, 3000);
            })
        }
    },
    data: {
        list: ["http://www.jq22.com/demo/tuupola-jquery_lazyload/img/bmw_m1_hood.jpg", "http://www.jq22.com/demo/tuupola-jquery_lazyload/img/bmw_m1_side.jpg", "http://www.jq22.com/demo/tuupola-jquery_lazyload/img/viper_1.jpg", "http://www.jq22.com/demo/tuupola-jquery_lazyload/img/viper_corner.jpg", "http://www.jq22.com/demo/tuupola-jquery_lazyload/img/bmw_m3_gt.jpg", "http://www.jq22.com/demo/tuupola-jquery_lazyload/img/corvette_pitstop.jpg"],
        a:0,
        b:0,
        at: '',
        bt: '',
        ia: '',
        ib: '',
        ac: '',
        bc: ''
    }
};
