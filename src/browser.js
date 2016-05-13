export let a = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME',
        url: '/',
        order: 1
    },
    webviews: {
        index: {
            template: `<h3 @click="go">dasf</h3><p @click="t">click</p>`,
            events:{
                "webview:preset": function(head, tool){
                    head.active();
                    tool.active();
                    head.data.center.text = 'a'
                },
                "webview:refresh": function(){
                    console.log('refresh')
                }
            },
            methods:{
                go(){
                    this.$redirect('/two')
                },
                t(){
                    this.$alert('ok').then(function(s){
                        console.log(s);
                    })
                }
            }
        },
        two: {
            template: `<h3 v-reback="'/'">two</h3>`,
            events:{
                "webview:preset": function(head, tool){
                    head.active();
                    tool.active();
                    head.data.center.text = 'two'
                },
                "webview:refresh": function(){
                    console.log('refresh')
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

export let c = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME3',
        url: '/c',
        order: 3
    },
    webviews: {
        index: {
            template: `<h3>tttt</h3>`,
            events:{
                "webview:preset": function(head, tool){
                    head.active();
                    tool.active();
                    head.data.center.text = 'c'
                }
            }
        }
    }
}
