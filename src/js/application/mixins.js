var directiveRedirect = require('../directives/redirect');
var resource = require('../resource');
var utils = require('../utils');
var next = require('../next');
var ago = require('../components/agos').computed;
var ajax = require('./ajax');

exports.created = function(){ this.$next = new next(function(){ this.$emit('end'); }, this); }
exports.directives = {
    redirect: directiveRedirect
}
exports.filters = {
    ago: function(value, diff){ return ago(value, diff || this.$root.timestamp); },
    fixAnimation: function(cls){ if ( resource.env.disableAnimation ){ return ''; }else{ return cls; } }
}
exports.methods = {
    $ajax: ajax,
    $jsonp: ajax.JSONP,
    $ajaxGet: ajax.get,
    $ajaxPost: ajax.post,
    $ajaxGetJSON: ajax.getJSON,
    $Go: function(i){ history.go(i) },
    $Goback: function(){ history.back(); },
    $GoForward: function(){ history.forward(); },
    $alert: function(content, title){ return this.$root.$refs.uiModel.$alert(content, title); },
    $confirm: function(content, title){ return this.$root.$refs.uiModel.$confirm(content, title); },
    $prompt: function(content, title){ return this.$root.$refs.uiModel.$prompt(content, title); },
    $loader: function(){ return this.$root.$refs.uiModel.$loader.apply(this.$root.$refs.uiModel.$loader, arguments); }
}

exports.computed = {
    timestamp: function(){ return this.$root.env.time; }
}
