'use strict';
import Redirect from './redirect';
import vue from 'vue';

vue.prototype.$redirect = function(url){
    Redirect.call(this.$root, url);
}

vue.prototype.$reback = function(url){
    Redirect.call(this.$root, url, true);
}
