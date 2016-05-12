export let a = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME',
        url: '/',
        order: 1
    },
    webviews: {
        index: {
            template: `<h3>dasf</h3>`,
            events:{
                "webview:preset": function(head, tool){
                    head.active();
                    tool.active();
                    head.data.center.text = 'a'
                }
            }
        }
    }
}
export let b = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME2',
        url: '/b',
        order: 2
    },
    webviews: {
        index: {
            template: `<h3>asdf3333</h3>`,
            events:{
                "webview:preset": function(head, tool){
                    head.active();
                    tool.active();
                    head.data.center.text = 'b'
                }
            }
        }
    }
}
