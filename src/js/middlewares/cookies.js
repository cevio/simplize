var utils = require('../utils');
var cookie = require('./cookie');
var out = {};
var installed = false;

module.exports = function(options){
    return function(next){
        options = options || {};
        !installed && make(options);
        this.$cookie = out;
        next();
    }
}

function make(options){
    var result = cookie.get() || {};
    for ( var i in result ){
        var key = i;
        var value = result[i];
        try{ value = JSON.parse(value); }catch(e){}
        define(key, value, options);
    }
    defineMethods(options);
    installed = true;
}

function define(key, value, options){
    var $key = key;
    var $value = value; // 真实值
    var $text = ''; // 文本值
    var _options = utils.$copy(options);
    Object.defineProperty(out, key, {
        enumerable: true,
        configurable: true,
        get: function(){
            return $value;
        },
        set: function(val){
            var type = utils.$type(val);
            $value = val;
            if ( ['array', 'object'].indexOf(type) > -1 ){
                $text = stringify(val);
            }else{
                $text = String(val);
            }
            save();
        }
    });
    function save(){
        cookie.set($key, $text, _options);
    }
}

function stringify(value){
    try{
        value = JSON.stringify(value);
    }catch(e){}
    return value;
}

function defineMethods(options){
    Object.defineProperties(out, {
        "$add": {
            enumerable: false,
            configurable: false,
            value: function(key, value, configs){
                var _options = utils.$copy(options);
                utils.extend(_options, configs || {});
                define(key, value, _options);
                this[key] = value;
            }
        },
        "$remove": {
            enumerable: false,
            configurable: false,
            value: function(name){
                if ( this[name] != undefined ){
                    delete this[name];
                    cookie.remove(name);
                }
            }
        }
    });
}
