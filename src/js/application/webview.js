import vue from 'vue';
import { compileWebview } from './app/factory';
import * as PROXY from './proxy';

export default function (browser, webview, fn) {
    var _cache = PROXY.simplizeCache.set('browser-' + browser);
    var __cache = _cache.set('webview-' + webview);
    __cache._isSync = true;
    _cache._webviews.push('<webview-' + webview + ' v-ref:webview-' + webview + '></webview-' + webview + '>');
    vue.component('webview-' + webview, function(resolve){
        fn(function(result){
            result = compileWebview(name, result).component;
            result._isAsync = true;
            resolve(result);
            vue.nextTick(function(){
                if ( __cache.notify ){
                    __cache.notify();
                }
            })
        })
    });
}
