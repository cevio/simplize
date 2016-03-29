var utils = require('../utils');
exports.name = 'notify';
exports.template = '<div v-el:root><slot></slot></div>';
exports.props = ['event-name'];
exports.ready = function(){
    var that = this;
    this._notifycb = function(){
        console.log(that);
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
