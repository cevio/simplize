var utils = require('../utils');
exports.name = 'ui-model';
exports.template =
    '<div class="ui-model" v-show="type>-1">' +
        '<div class="ui-model-area">' +
            '<ui-layer :status.sync="mask" v-ref:layer></ui-layer>' +
            '<ui-alert :status="type==1" v-ref:alert></ui-alert>' +
            '<ui-confirm :status="type==2" v-ref:confirm></ui-confirm>' +
            '<ui-prompt :status="type==3" v-ref:prompt></ui-prompt>' +
            // '<ui-sheet v-ref:sheet></ui-sheet>' +
            '<ui-loader :status="type==5" v-ref:loader></ui-loader>' +
        '</div>' +
    '</div>';

exports.data = function(){
    return {
        /**
         *  type 控件类型
         *      1 - alert
         *      2 - confirm
         *      3 - prompt
         *      4 - sheet
         *      5 - preloader
         */
        type: -1,
        mask: false
    }
}

exports.methods = {
    $alert: function(content, title){
        var Alert = this.$refs.alert;
        this.type = 1;
        this.mask = true;
        Alert.content = content || '';
        Alert.title = title || '';
        Alert.button = 'OK';
        return Alert;
    },
    $confirm: function(content, title){
        var Confirm = this.$refs.confirm;
        this.type = 2;
        this.mask = true;
        Confirm.title = title || '';
        Confirm.content = content || '';
        Confirm.okText = 'OK';
        Confirm.cancelText = 'Cancel';
        return Confirm;
    },
    $prompt: function(content, title){
        var Prompt = this.$refs.prompt;
        this.type = 3;
        this.mask = true;
        Prompt.title = title || '';
        Prompt.content = content || '';
        Prompt.okText = 'OK';
        Prompt.cancelText = 'Cancel';
        Prompt.value = '';
        Prompt.placeholder = '';
        Prompt.type = 'text';
        return Prompt;
    },
    $loader: function(){
        var Loader = this.$refs.loader;
        var content, options;

        for ( var i = 0 ; i < arguments.length; i++ ){
            if ( typeof arguments[i] === 'string' ){
                content = arguments[i];
            }else if ( typeof arguments[i] === 'object' ){
                options = arguments[i];
            }
        }

        this.type = 5;
        if ( options ){

            if ( !!options.mask ){ this.mask = true; }
            else{ this.mask = false; }

            if ( options.iswide != undefined ){ Loader.iswide = !!options.iswide; }
            else { Loader.iswide = false; }

            if ( options.isblack != undefined ){ Loader.isblack = !!options.isblack; }
            else { Loader.isblack = true; }

        }else{
            this.mask = true;
            Loader.iswide = false;
            Loader.isblack = true;
        }

        Loader.content = content || '';

        return Loader;
    }
}

exports.components = {
    "ui-layer": require('./layer'),
    "ui-alert": require('./alert'),
    "ui-confirm": require('./confirm'),
    "ui-prompt": require('./prompt'),
    "ui-loader": require('./loader')
}

exports.events = {
    destroy: function(){
        this.type = -1;
    }
}
