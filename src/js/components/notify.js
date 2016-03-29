var utils = require('../utils');
exports.name = 'notify';
exports.template = '<div v-el:root><slot></slot></div>';
exports.props = ['event-name'];
exports.ready = function(){
    var that = this;
    this._notifycb = function(){
        switch ( utils.$type(that.eventName) ){
            case 'string':
                that.$broadcast(that.eventName);
                break;
            case 'array':
                that.eventName.forEach(function(name){
                    that.$broadcast(name);
                });
                break;
        }
    }
}
exports.events = {
    "webview:load": function(){
        utils.on(this.$els.root, 'click', this._notifycb);
    },
    "webview:unload": function(){
        utils.off(this.$els.root, 'click', this._notifycb);
    }
}
