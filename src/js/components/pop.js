var selects = require('./selects');
var utils = require('../utils');
exports.name = 'ui-pop';
exports.template =
    '<div class="ui-pop" v-if="status" transition="pop" :class="class" v-el:root>' +
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

exports.transitions = {
    pop: {
        enter: function(){
            var that = this;
            utils.windowTouchMoveDisabled(true);
            that._cb = function(e){
                var target = e.target;
                if ( loop(target, that.$els.root) ){
                    that.cancel();
                }
            }
            utils.on(document.body, 'click', that._cb);
        },
        leave: function(){
            utils.windowTouchMoveDisabled(false);
            if ( typeof this._cb === 'function' ){
                utils.off(document.body, 'click', this._cb);
            }
        }
    }
}

function loop(el, root){
    if ( el === document.body ){
        return true;
    }
    if ( el === root ){
        return false;
    }else {
        return loop(el.parentNode, root);
    }
}
