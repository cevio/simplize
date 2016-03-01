var utils = require('../utils');
var redirect = require('./redirect');
var webview = require('../components/webview');
exports.create = function(webviews){
    var result = {}, html = [];
    for ( var i in webviews ){
        var name = 'webview-' + i;
        var webviewResults = webview(name, webviews[i], i);
        result[name] = webviewResults.component;
        html.push(webviewResults.html);
    }
    return {
        result: result,
        html: html.join('')
    }
}

exports.get = function(name){
    return this.$refs[utils.camelize('webview-' + name)];
}
