import * as utils from '../../utils/index';
import { initUrl } from '../init';
import { type } from '../../utils';

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

            route.use.apply(route, [path].concat(fns));
            return this;
        },

        $get(name){
            return this.$cache.get('browser-' + name);
        }
    }
}
function hashChange(that){
    utils.on(window, 'hashchange', function(e){
        e.preventDefault();
        if ( timer ) clearTimeout(timer);
        timer = setTimeout(function(){
            that.req = initUrl(window.location);
        }, 10);
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
