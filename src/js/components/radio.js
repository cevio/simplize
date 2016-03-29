var utils = require('../utils');
exports.name = "ui-radio";
exports.props = ['raw', 'value'];
exports.template = '<div class="ui-radio clearflash" :class="{active:compute}" v-el:root><label></label></div>';

exports.ready = function(){
    var that = this;
    if ( !this.value ) this.value = '1';
    this._cb = function(e){ that.raw = that.value; }
}

exports.computed = {
    compute: function(){
        return this.raw == this.value;
    }
}

exports.events = {
    "webview:load": function(){
        utils.on(this.$els.root, 'click', this._cb);
    },
    "webview:unload": function(){
        this._cb && utils.off(this.$els.root, 'click', this._cb);
    },
    "notify:radio": function(){
      console.log(111)
        this._cb && this._cb();
    }
}
