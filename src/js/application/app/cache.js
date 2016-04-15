import route from '../route';
import * as utils from '../../utils/index';

export default class Cache extends route {
    constructor(name, parent){
        super();
        this.name = name;
        this.childrens = {};
        this.parent = parent;
        this._isCache = true;
        this._isSync = false;
        this._webviews = [];
        this._type = null;
    }
    set(name){
        let that = this;
        if ( this.childrens[name] ) return this.childrens[name];
        this.childrens[name] = new Cache(name, this);
        Object.defineProperty(this.childrens[name], 'root', { get(){ return that.root; } });
        return this.childrens[name];
    }
    get(name){
        return this.childrens[name];
    }
    $use(...args){
        this.use.apply(this, args);
        return this;
    }
    $active(...args){
        this.active.apply(this, args);
        return this;
    }

    $define(_path, _webview){
        let path, webview;
        if ( !_webview ){
            path = '/';
            webview = _path;
        }else{
            path = _path;
            webview = _webview;
        }
        this.$active(path, function(){
            this.$render(webview);
        });
        return this;
    }

    /**
     *  这里将讲述最复杂的路由唤起功能
     *  $render 将唤当前browser下的名为name的webview。
     */

    $render(name){
        let browser_name = this.name;
        let webview_name = 'webview-' + name;
        let that = this, app = this.root;

        if ( this._type !== 'browser' ) throw new Error('you cannot use $render on webview object or app object, only use on browser.');

        // 直接通知component标签挂载这个browser
        app.SP_currentBrowser = browser_name;

        // 当该browser是异步状态的话
        // 我们直接指定SP_currentBrowser来唤醒这个browser的异步加载
        if ( this._isSync ){

            // 我们在加载之前定义这个browser的通知方法
            // 当browser异步加载完后，将调用这个notify方法。
            this.notify = () => {

                // 由于异步请求后编译需要等待时间
                // 故我们等待vue将这个browser渲染后触发渲染webview
                utils.nextTick(() => {
                    this._render(webview_name);

                    // 不要忘记将这个方法清除
                    this.notify = null;
                });
            }
        }
        else{
            // 不是异步的情况下，我们直接渲染wenview
            utils.nextTick(() => {
                this._render(webview_name);
            });
        }
    }

    _render(webview_name){
        let app = this.root, browser = app.$refs.browser, that = this;

        // 检测当前browser是否存在
        if ( !browser ){
            throw new Error('cannot find this browser');
        }

        // 如果当前browser未处在编译过程中
        // 直接编译webview
        if ( browser._isReady ){
            this._browser_Render(webview_name);
        }

        // 如果还在编译中
        // 在这个browser上加上事件来回调
        else{
            browser.$on('browser:async', function(){
                this.$off('browser:async');
                that._browser_Render(webview_name);
            });
        }
    }

    _browser_Render(webview_name){
        const camelize_webview_name = utils.camelize(webview_name);
        const app = this.root;

        let cacheWebview = this.childrens[webview_name];
        let webview = app.$refs.browser.$refs[camelize_webview_name];
        let oldWebview = app.$refs.browser.SP_currentWebview;

        if ( cacheWebview ){
            if ( webview ){
                // 都已经找到webview了，就彻底将这个的是否异步重置为false
                cacheWebview._isSync = false;
                this._webview_Render(webview, oldWebview);
            }
            else {
                if ( cacheWebview && cacheWebview._isSync ){
                    // 如果webview是异步的话
                    // 挂载一个notify回调来执行
                    cacheWebview.notify = () => {
                        cacheWebview.notify = null;
                        webview = app.$refs.browser.$refs[camelize_webview_name];
                        this._webview_Render(webview, oldWebview);
                    }
                }
                else{
                    throw new Error('component ' + webview_name + ' can not been found.');
                }
            }
        }
        else{
            throw new Error('cannot find this webview in cache.');
        }
    }

    _webview_Render(webview, oldWebview){
        const app = this.root;
        const headbar = webview.$parent.$refs.headbar;
        const toolbar = app.$refs.toolbar;

        // 检查webview的zindex属性对方向的影响
        this._webview_Direction(app, webview, oldWebview);

        /**
         *  进入之前首先进行headbar的before事件处理
         *  然后会触发 webview的preset 事件
         *  该事件用来设置 headbar 和 toolbar
         */

         headbar.$emit('headbar:before');
         toolbar.$emit('toolbar:before');
         webview.$emit('webview:preset', headbar, toolbar);

         // 当设置完毕后，进行webview的跳转

         utils.nextTick(() => {

             // 触发头部方向翻转
             headbar.$emit('headbar:direct');

             // 触发工具条方向翻转
             toolbar.$emit('toolbar:direct');

             // 触发旧的webview跳转
             if ( oldWebview ){
                 oldWebview.$emit('webview:unactive');
             }

             // 触发 toolbar 更换事件
             // 让browser告诉toolbar现在是加载哪个browser
             webview.$parent.$emit('toolbar:exchange');

             // 触发新的webview跳转
             webview.$emit('webview:active');

             // 进行额外处理
             utils.nextTick(function(){
                 if ( app.$refs.browser.SP_firstEnter ){
                     app.$refs.browser.SP_background_color = 'dark';
                 }
                 app.$refs.browser.SP_firstEnter = false;
                 app.SP_firstEnter = false;
             });
         });
    }
    _webview_Direction(app, webview, oldWebview){
        const a = webview.$options.zindex || 99;
        const b = oldWebview ? oldWebview.$options.zindex || 99 : 99;

        if ( a > b ){
            app.env.direction = 'turn:left';
        }else if ( a < b ){
            app.env.direction = 'turn:right';
        }
    }
}
