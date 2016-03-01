var Vue = require('vue');
module.exports = function(value){
    if ( value ){
        Vue.config.debug = true;
        Vue.config.silent = false;
        Vue.config.convertAllProperties = true;
    }else{
        Vue.config.debug = false;
        Vue.config.silent = true;
        Vue.config.convertAllProperties = false;
    }
}
