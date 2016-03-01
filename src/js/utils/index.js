var Vue = require('vue');
var lang = require('./lang');
var url = require('./url');
var app = require('./app');

extend(exports, Vue.util);
extend(exports, lang);
extend(exports, url);
extend(exports, app);

exports.$extend = extend;
function extend(source, target){
    for ( var i in target ){
        source[i] = target[i];
    }
}

exports.$looser = { sensitive: false, strict: false, end: false };
exports.$strict = { sensitive: false, strict: true, end: true };
