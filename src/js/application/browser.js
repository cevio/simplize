import vue from 'vue';
import { compileBrowser } from './app/factory';
export default function (name, fn) {
    var _cache = window.simplizeCache.set('browser-' + name);
    _cache._isSync = true;
    vue.component('browser-' + name, function(resolve){
        fn(function(result){
            result = compileBrowser(name, result, _cache)['browser-' + name];
            resolve(result);
            _cache.notify();
            _cache._isSync = false;
        })
    });
}
