var utils = require('../utils');

exports.priority = 3000;
exports.deep = true;
exports._notifies = {
    broadcasts: [],
    dispatches: [],
    emits: []
};

exports.bind = function(){
    var that = this;
    this._cb = function(){
        loop(that, 'broadcast', that._notifies.broadcasts);
        loop(that, 'dispatch', that._notifies.dispatches);
        loop(that, 'emit', that._notifies.emits);
    };
    utils.on(this.el, 'click', this._cb);
}

exports.update = function(newValue){
    switch ( utils.$type(newValue) ){
        case 'string':
            this._notifies.broadcasts = [newValue];
            break;
        case 'array':
            this._notifies.broadcasts = newValue;
            break;
        case 'object':
            var broadcasts = gulp(newValue.broadcast);
            var dispatches = gulp(newValue.dispatch);
            var emits = gulp(newValue.emit);
            this._notifies.broadcasts = broadcasts;
            this._notifies.dispatches = dispatches;
            this._notifies.emits = emits;
            break;

    }
}

exports.unbind = function(){
    utils.off(this.el, 'click', this._cb);
}

function gulp(data){
    var ret;
    switch ( utils.$type(data) ){
        case 'string':
            ret = [newValue];
            break;
        case 'array':
            ret = newValue;
            break;
        default:
            throw new Error('v-notify: cannot gulp this data of type.');
    }
    return ret;
}

function loop(obj, name, data){
    data.forEach(function(d){
        obj['$' + name](d);
    });
}
