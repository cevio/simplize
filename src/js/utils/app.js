exports.getTemplate = getTemplate;
function getTemplate(value){
    var html = '';
    if ( typeof value != 'string' ){
        html = value.innerHTML || '';
    }else{
        try{
            var node = this.$query(document, value);
            html = node.innerHTML;
            this.removeChild(node);
        }catch(e){
            html = value;
        }
    }
    return html;
}

exports.sessionName = 'simplize-history-name';
exports.sessionValueName = null;

exports.setURI = function(uri, href){
    var index = uri.indexOf(href);
    if ( index == -1 ){
        uri.push(href);
        window.sessionStorage.setItem(this.sessionValueName, JSON.stringify(uri));
    }
}

exports.createRoot = function(){
    var root = document.createElement('div');
    document.body.insertBefore(root, document.body.firstChild);
    this.addClass(root, 'web-app');
    return root;
}
exports.stop = EventStop;
function EventStop(e){
    e.preventDefault();
    e.stopPropagation();
}
exports.windowTouchMoveDisabledStatus = false;
exports.windowTouchMoveDisabledListenner = null
exports.windowTouchMoveDisabled = function(value){
    this.windowTouchMoveDisabledStatus = !!value;
    if ( !!value ){
        if ( typeof this.windowTouchMoveDisabledListenner != 'function' ){
            this.windowTouchMoveDisabledListenner = EventStop;
            this.on(window, 'touchmove', this.windowTouchMoveDisabledListenner);
        }
    }else{
        if ( typeof this.windowTouchMoveDisabledListenner !== 'function' ) return;
        this.off(window, 'touchmove', this.windowTouchMoveDisabledListenner);
        this.windowTouchMoveDisabledListenner = null;
    }
}
exports.style = getStyle;
function getStyle(obj, attr){
    if( obj.currentStyle ){ return obj.currentStyle[attr]; }
    else{
        return document.defaultView.getComputedStyle(obj, null)[attr];
    }
}
