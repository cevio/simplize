/**
 * check the type of object or return this type.
 * @param obj
 * @param type
 * @returns {*}
 */
exports.$type = function(obj, type){
    var _type = Object.prototype.toString.call(obj).split(' ')[1].replace(/\]$/, '').toLowerCase();
    if ( type ){
        type = type.toLowerCase();
        return _type == type;
    }else{
        return _type;
    }
};

exports.$copy = function(data){
    var type = this.$type(data).toLowerCase();
    var result;
    if ( type === 'object' ){
        result = {};
        for ( var i in data ){
            result[i] = this.copy(data[i]);
        }
    }else if ( type === 'array' ){
        result = [];
        for ( var j = 0 ; j < data.length ; j++ ){
            result.push(this.copy(data[j]));
        }
    }else{
        result = data;
    }
    return result;
}

exports.$query = function(el, exp){
    return el.querySelector(exp);
}

exports.$querys = function(el, exp){
    return el.querySelectorAll(exp);
}

exports.slice = Array.prototype.slice;

exports.removeChild = function(node){
    node.parentNode.removeChild(node);
}

exports.noop = function(){}
