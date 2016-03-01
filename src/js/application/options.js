var browserComponent = require('../components/browser');
module.exports = function(simplize, options, toolbarComponent){
    var result = {}, innerHTML = [];
    for ( var i in options ){
        var name = 'browser-' + i;
        innerHTML.push('<' + name + ' v-ref:' + name + '></' + name + '>');
        result[name] = browserComponent(name, options[i], toolbarComponent);
    }
    simplize.$root.innerHTML = '<div class="web-browsers">' + innerHTML.join('') + '</div><toolbar v-ref:toolbar></toolbar>';
    return result;
}
