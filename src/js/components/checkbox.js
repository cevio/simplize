var utils = require('../utils');
exports.name = "ui-checkbox";
exports.props = ['raw', 'value'];
exports.template = '<div class="ui-checkbox clearflash" :class="{active:compute>-1}" v-el:root><label></label></div>';

exports.ready = function(){
    var that = this;
    if ( !this.value ) this.value = '1';
    this._cb = function(e){
        var index = that.compute;
        if ( index > -1 ){
            that.raw.splice(index, 1);
        }else{
            that.raw.push(that.value);
        }
    }
}

exports.computed = {
    compute: function(){
        return this.raw.indexOf(this.value);
    }
}

exports.events = {
    "webview:load": function(){
        utils.on(this.$els.root, 'click', this._cb);
    },
    "webview:unload": function(){
        this._cb && utils.off(this.$els.root, 'click', this._cb);
    }
}
