import * as utils from '../../utils/index';
import { initUrl } from '../init';
import { type } from '../../utils';
import Redirect from '../redirect';
import * as PROXY from '../proxy';

let timer = null;

export default function(callback){
    return {
        $run(){
            hashChange(this);
            typeof callback == 'function' && callback(this);
        },

        // 中间件
        $use(...fn){
            let that = this;
            let cache = this.$cache;
            let path, fns = [], browser = null;

            fn.forEach(function(n){
                switch (type(n)) {
                    case 'regexp':
                    case 'string': path = n; break;
                    case 'function': fns.push(n); break;
                    case 'object': if ( n._isCache ){ browser = n; }; break;
                }
            });

            if ( !path ) path = '/';

            if ( browser ){
                cache.$use(path, makeBrowserMiddleware(browser, this));
                return this;
            }

            cache.$use.apply(cache, [path].concat(fns));
            return this;
        },

        $browser(name){
            return this.$cache.get('browser-' + name);
        },

        $redirect(url){
            Redirect(this)(url);
        }
    }
}
function hashChange(that){
    utils.on(window, 'hashchange', function(e){
        e.preventDefault();
        if ( timer ) clearTimeout(timer);
        let referrer = that.req.path + '';
        let object = initUrl(window.location);
        let result = PROXY.HISTORY.diff(referrer, object.path);

        switch ( result.usage ) {
            case 'add':
                delay(function(){
                    PROXY.HISTORY.push(object.path);
                    that.env.direction = 'turn:left';
                });
                break;
            case 'rebuild':
                delay(function(){
                    result.fn();
                    that.env.direction = 'turn:left';
                });
                break;
            case 'refresh':
                delay(function(){
                    that.env.direction = 'turn:still';
                });
                break;
            case 'forward':
                delay(function(){
                    that.env.direction = 'turn:left';
                });
                break;
            case 'back':
                delay(function(){
                    that.env.direction = 'turn:right';
                });
                break;
        }

        function delay(fn){
            timer = setTimeout(function(){
                fn && fn();
                that.env.referrer = referrer;
                Object.assign(that.req, object);
            }, 1000 / 60);
        }
    });
}

function makeBrowserMiddleware(browser, that){
    return function(next){
        let Layer = this.$layer;
        let distURL = that.req.path.replace(Layer.path, '') || '/';
        if ( !/^\//.test(distURL) ) distURL = '/' + distURL;
        Object.assign(that.req.params, Layer.params);
        browser.dispatch(distURL, next);
    }
}
