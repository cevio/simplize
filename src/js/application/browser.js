import vue from 'vue';
import { compileBrowser } from './app/factory';
import * as PROXY from './proxy';

export default function (name, fn) {
    // 创建一个新的browser对象仓库
    let _cache = PROXY.simplizeCache.set('browser-' + name);

    // 标记对象仓库为异步仓库
    _cache._isSync = true;

    // 标记对象仓库为browser类型的仓库
    _cache._type = 'browser';

    // 全局注册该组件
    vue.component('browser-' + name, function(resolve){

        // fn 对象为异步获取方法
        // 获取完毕后返回result结果集
        fn(function(result){

            // 通过系统方法编译结果为可以被simplize认识的对象
            result = compileBrowser(name, result, _cache)['browser-' + name];

            // 返回这个对象到simplize中
            // 程序将对这个对象进行编译
            resolve(result);

            // 当返回后我们需要通知程序
            // 使用notify方法通知
            if ( typeof _cache.notify === 'function' ){
                _cache.notify();

                // 移除模块的异步标记
                _cache._isSync = false;

                // 告诉toolbar 新加载的browser模块编译完成
                // toolbar将自动加载这个browser组件的信息到底部工具条
                PROXY.simplizeCache.root.$refs.toolbar.$emit('browser:added');
            }
            else {
                throw new Error('cannot find the callback for notify.');
            }
        })
    });
}
