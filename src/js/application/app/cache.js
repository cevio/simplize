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
    }
    set(name){
        var that = this;
        if ( this.childrens[name] ) return this.childrens[name];
        this.childrens[name] = new Cache(name, this);
        Object.defineProperty(this.childrens[name], 'root', {
            get: function(){
                return that.root;
            }
        })
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
    $render(name){
        let browser_name = this.name;
        let webview_name = 'webview-' + name;
        let that = this;

        if ( this._isSync ){
            this.root.SP_currentBrowser = browser_name;
            this.notify = function(){
                utils.nextTick(function(){
                    that._render(webview_name);
                    that.notify = null;
                });
            }
        }
        else{
            this._render(webview_name, browser_name)
        }
    }
    _render(webview_name, browser_name){
        let that = this;
        if ( this.childrens[webview_name] && this.root ){
            browser_name && (this.root.SP_currentBrowser = browser_name);
            utils.nextTick(function(){
                const _webview_name = utils.camelize(webview_name);
                let webview = that.root.$refs.browser.$refs[_webview_name];
                const oldWebview = that.root.$refs.browser.SP_currentWebview;
                let object = that.childrens[webview_name];
                if ( webview ){
                    object._isSync = false;
                    webview_Render(webview, oldWebview, that.root);
                }else{
                    if ( object && object._isSync ){
                        object.notify = function(){
                            webview = that.root.$refs.browser.$refs[_webview_name]
                            webview_Render(webview, oldWebview, that.root);
                            object.notify = null;
                        }
                    }else{
                        console.warn('component ' + webview_name + ' can not been found.');
                    }
                }
            })
        }
    }
}

function webview_Render(webview, oldWebview, app){
    const headbar = webview.$parent.$refs.headbar;

    /**
     *  进入之前首先进行headbar的before事件处理
     *  然后会触发 webview的preset 事件
     *  该事件用来设置 headbar 和 toolbar
     */

    headbar.$emit('headbar:before');
    webview.$emit('webview:preset', headbar);

    // 当设置完毕后，进行webview的跳转
    utils.nextTick(function(){
        headbar.$emit('headbar:direct');
        if ( oldWebview ){
            oldWebview.$emit('webview:unactive');
        }
        webview.$emit('webview:active');
        utils.nextTick(function(){
            if ( app.$refs.browser.SP_firstEnter ){
                app.$refs.browser.SP_background_color = 'dark';
            }
            app.$refs.browser.SP_firstEnter = false;
        });
    });
}
