var utils = require('../utils');
var locals = {};
var out = {};
var installed = false;

module.exports = function(){
    return function(next){
        !installed && make();
        this.$locals = out;
        next();
    }
}

function make(){
    var store = window.localStorage;
    for ( var i in store ){
        var key = i;
        var value = store.getItem(i);
        try{ value = JSON.parse(value); }catch(e){}
        define(key, value);
    }
    defineMethods();
    installed = true;
}

function define(key, value){
    var $key = key;
    var $value = value; // 真实值
    var $text = ''; // 文本值
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
        window.localStorage.setItem($key, $text);
    }
}

function stringify(value){
    try{
        value = JSON.stringify(value);
    }catch(e){}
    return value;
}

function defineMethods(){
    Object.defineProperties(out, {
        "$add": {
            enumerable: false,
            configurable: false,
            value: function(key, value){
                define(key, value);
                this[key] = value;
            }
        },
        "$remove": {
            enumerable: false,
            configurable: false,
            value: function(name){
                if ( this[name] != undefined ){
                    delete this[name];
                    window.localStorage.removeItem(name);
                }
            }
        }
    });
}
