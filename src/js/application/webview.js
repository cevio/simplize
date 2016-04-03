import vue from 'vue';
import { compileWebview } from './app/factory';
import * as PROXY from './proxy';

export default function (browser, webview, fn) {
    // 如果不存在 创建一个新的browser对象仓库
    let _cache = PROXY.simplizeCache.set('browser-' + browser);

    // 创建一个新的browser对象仓库
    let __cache = _cache.set('webview-' + webview);

    // 标记对象仓库为异步仓库
    __cache._isSync = true;

    // 标记对象仓库为webview类型的仓库
    __cache._type = 'webview';

    // 标记对象仓库为browser类型的仓库
    _cache._type = 'browser';

    // 插入这个webview的html标签到队列
    _cache._webviews.push('<webview-' + webview + ' v-ref:webview-' + webview + '></webview-' + webview + '>');

    // 全局注册该组件
    vue.component('webview-' + webview, function(resolve){

        // fn 对象为异步获取方法
        // 获取完毕后返回result结果集

        fn(function(result){

            // 通过系统方法编译结果为可以被simplize认识的对象
            result = compileWebview(name, result).component;

            // 标记这个webview的vue对象为异步
            // 之后会在webview加载完毕后移除
            result._isAsync = true;

            // 返回结果
            resolve(result);

            vue.nextTick(() => {
                // 通知高速缓存webview加载完毕
                typeof __cache.notify === 'function' && __cache.notify();
            })
        })
    });
}
