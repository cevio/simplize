import * as utils from '../../utils/index';
import { initUrl } from '../init';
import { type } from '../../utils';
import Redirect from '../redirect';
import * as PROXY from '../proxy';

let timer = null;

export default function(callback){
    return {
        $run(){ hashChange.call(this); typeof callback == 'function' && callback(this); },
        $browser(name){ return this.$cache.get('browser-' + name); },
        $disableAnimation(){ this.SP_disableAnimation = true; },
        $enableAnimation(){ this.SP_disableAnimation = false; },

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
        }
    }
}
function hashChange(){
    PROXY.HISTORY.listen(location => {
        if ( this.$root.SP_firstEnter ){
            this.$root.SP_none = true;
            this.$root.SP_firstEnter = false;
            if ( !location.state ){
                PROXY.HISTORY.replace(location);
                return;
            }
        }

        if ( this.$root.forceBack ){
            this.$root.env.direction = 'turn:right';
            delete this.$root.forceBack;
        }else{
            const a = location.state.index;
            const b = this.$root.env.oldHistoryIndex;
            this.$root.env.oldHistoryIndex = a;
            if ( a > b ){
                this.$root.env.direction = 'turn:left';
            }
            else if ( a < b ){
                this.$root.env.direction = 'turn:right';
            }
            else{
                this.$root.env.direction = 'turn:still';
            }
        }

        this.$root.req = location;
        this.$root.req.path = location.pathname;
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
