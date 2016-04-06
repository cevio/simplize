let picker_data = [];
for (let pi = 0; pi < 10; pi++) {
    picker_data.push({
        value: pi + 1,
        text: "第" + (pi + 1) + '个数据'
    })
}
let picker_data2 = [];
for (let pi = 0; pi < 150; pi++) {
    picker_data2.push({
        value: pi + 1,
        text: "第" + (pi + 1) + '个数据'
    })
}

export let picker = {
    template: require('../../html/picker.html'),
        data: {
    list: picker_data2,
        index: 3
},
    events: {
        "webview:preset": function(headbar, toolbar) {
            headbar.active();
            toolbar.active();
            headbar.data.left.icon = '<i class="fa fa-angle-left"></i>';
            headbar.data.left.text = 'Back';
            headbar.data.left.click = function() {
                history.back();
            }
            headbar.data.center.text = 'Picker scroller';
            this.SP_webviewContentClass = 'test2';
        },
        'webview:load': function() {
            this.$refs.picker.$on('scroll:selected', function(data, index) {
                console.log(data, index)
            });
        },
        "webview:unload": function() {
            this.$refs.picker.$off('scroll:selected');
        }
    }
}