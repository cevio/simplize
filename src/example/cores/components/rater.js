
export let rater = {
        template: require('../../../html/webviews/components/rater.html'),
        events: {
            "webview:preset": function (headbar, toolbar) {
                headbar.active();
                headbar.data.left.icon = '<i class="iconfont icon-back"></i>';
                headbar.data.left.text = 'Back';
                headbar.data.left.click = function () {
                    history.back();
                };
                headbar.data.center.text = 'Simplize Component Rater';
            }
        },
        data: {
            data1: 0,
            data2: 5,
            data3: 5,
            data4: 3,
            data41: 3.7,
            data42: 3.5,
            data5: 3,
            data6: 3
        }
    }
;
