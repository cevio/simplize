var selects = require('./selects');
var utils = require('../utils');
exports.name = 'ui-pop';
exports.template =
    '<div class="ui-pop" v-if="status" transition="pop" :class="class">' +
        '<div class="ui-pop-header">' +
            '<div class="ui-pop-header-item ui-pop-header-item-left clearflash" @click="cancel">close</div>' +
            '<div class="ui-pop-header-item ui-pop-header-item-right clearflash" @click="ok">OK</div>' +
        '</div>' +
        '<div class="ui-pop-content">' +
            '<component :is="type" :html.sync="html" :arrays.sync="arrays" :object.sync="object"></component>' +
        '</div>' +
    '</div>';

exports.data = function(){
    return {
        type: 'html5',
        html: '',
        arrays: [],
        object: {},
        result: null,
        class: ''
    }
}
exports.props = ['status'];

exports.components = {
    "html5": {
        name: 'pop-component-html',
        template: '<div class="ui-pop-content-html">{{html}}</div>',
        props: ['html', 'arrays', 'object']
    },
    "selects": selects
}

exports.events = {
    send: function(value){
        this.result = value;
    }
}

exports.methods = {
    ok: function(){
        var that = this;
        this.$broadcast('result');
        utils.nextTick(function(){
            that.$emit('ok', that.result);
            that.cancel();
        });
    },
    cancel: function(){
        this.$parent.type = 0;
        this.$parent.mask = false;
        this.$off('ok');
    }
}
