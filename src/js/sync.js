define(function(require, exports, module){
    return {
        options: {
            data: {
                icon: '<i class="fa fa-send"></i>',
                text: 'sync',
                url: '/'
            }
        },
        webviews: {
            index: {
                template: '<div class="test1 ">1</div>',
                events: {
                    "webview:load": function(){
                        console.log('load')
                    }
                }
            },
            info: {
                template: '2'
            }
        }
    }
})
