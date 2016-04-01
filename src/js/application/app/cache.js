import route from '../route';
import * as utils from '../../utils/index';

export default class Cache extends route {
    constructor(name, parent){
        super();
        this.name = name;
        this.childrens = {};
        this.parent = parent;
        this._isCache = true;
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
        if ( this.childrens[webview_name] && this.root ){
            this.root.SP_currentBrowser = browser_name;
            utils.nextTick(function(){
                webview_name = utils.camelize('webview-' + name);
                if ( that.root.$refs.browser.$refs[webview_name] ){
                    let oldWebview = that.root.$refs.browser.SP_currentWebview;
                    if ( oldWebview ){
                        oldWebview.$emit('webview:unactive');
                    }
                    that.root.$refs.browser.$refs[webview_name].$emit('webview:active');
                    utils.nextTick(function(){
                        that.root.$refs.browser.SP_firstEnter = false;
                    });
                }
            })
        }
    }
}
