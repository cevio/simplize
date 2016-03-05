var directiveRedirect = require('../directives/redirect');
var resource = require('../resource');
var utils = require('../utils');
var next = require('../next');

exports.created = function(){
    this.$next = new next(function(){
        this.$emit('end');
    }, this);
}
exports.directives = {
    redirect: directiveRedirect
}
exports.filters = {
    fixAnimation: function(cls){
        if ( resource.env.disableAnimation ){ return ''; }
        else{ return cls; }
    }
}
exports.methods = {
    $Go: function(i){ history.go(i) },
    $Goback: function(){ history.back(); },
    $GoForward: function(){ history.forward(); },
    $alert: function(content, title){
        return this.$root.$refs.uiModel.$alert(content, title);
    },
    $confirm: function(content, title){
        return this.$root.$refs.uiModel.$confirm(content, title);
    },
    $prompt: function(content, title){
        return this.$root.$refs.uiModel.$prompt(content, title);
    },
    $loader: function(){
        var object = this.$root.$refs.uiModel.$loader;
        return object.apply(object, arguments);
    }
}
