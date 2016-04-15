export default {
    events: {
        "webview:preset": function(headbar){
            headbar.active();
            headbar.data.center.text = 'simplize builder';
        },
        "webview:load": function(){
            console.log('webview[index] loaded!');
        }
    }
}
