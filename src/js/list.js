define(function(require, exports, module){
    return {
        template: '<div class="test1 ">2</div>',
        events: {
            "webview:load": function(){
                console.log('list load')
            }
        }
    }
})
