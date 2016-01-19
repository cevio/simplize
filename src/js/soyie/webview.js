var EventEmitter = require('events').EventEmitter;

module.exports = webview;

function webview(){
    this.template = null;
    this.params = {};
}

webview.prototype = Object.create(EventEmitter.prototype);
