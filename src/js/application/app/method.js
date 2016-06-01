import * as utils from '../../utils/index';
import { initUrl } from '../init';
import { type } from '../../utils';
import Redirect from '../redirect';
import * as PROXY from '../proxy';
import { format } from '../url';

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

function remove(index, localkey){
    let len = window.sessionStorage.length;
    while( len-- ){
        let key = window.sessionStorage.key(len)
        if( key.indexOf('@@History') === 0 ){
            let state = JSON.parse(window.sessionStorage.getItem(key));
            if ( state.index >= index && key != localkey ){
                sessionStorage.removeItem(key);
            }
        }
    }
}

function hashChange(){
    PROXY.HISTORY.listen(location => {
        setTimeout(() => {
            if ( this.$root.SP_firstEnter ){
                this.$root.SP_none = true;
                this.$root.SP_firstEnter = false;
                if ( !location.state ){
                    let len = window.sessionStorage.length;
                    while( len-- ){
                        let key = window.sessionStorage.key(len)
                        if( key.indexOf('@@History') === 0 ){
                            sessionStorage.removeItem(key);
                        }
                    }

                    PROXY.HISTORY.replace(location);
                    return;
                }
            }
            if( location.action === 'PUSH' ){
                const locationKey = '@@History/' + location.key;
                let stateData = JSON.parse(window.sessionStorage.getItem(locationKey));
                stateData.index = history.length;
                window.sessionStorage.setItem(locationKey, JSON.stringify(stateData));
                location.state = stateData;
                remove(stateData.index, locationKey);
            }

            setTimeout(() => {
                this.$root.env.oldHistoryIndex = this.$root.env.newHistoryIndex;
                this.$root.env.newHistoryIndex = location.state ? location.state.index : 0;

                if ( this.$root.forceBack ){
                    this.$root.env.direction = 'turn:right';
                    delete this.$root.forceBack;
                }
                else if ( this.$root.forceForward ){
                    this.$root.env.direction = 'turn:left';
                    delete this.$root.forceForward;
                }
                else{
                    const a = this.$root.env.newHistoryIndex;
                    const b = this.$root.env.oldHistoryIndex;

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
                if ( location.search ){
                    location.query = format(location.search.replace(/^\?/, ''));
                }else{
                    location.query = {};
                }
                if ( window.location.search ){
                    location.query = deepExtend(location.query, format(window.location.search.replace(/^\?/, '')));
                }
                this.$root.req = location;
                this.$root.req.path = location.pathname;
                this.$root.req.href = location.pathname + location.search;
            }, 1000/60);
        }, 1000/60);
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

function deepExtend(a, b){
    let d = Object.keys(b).sort();

    var i = d.length;
    while ( i-- ){
        let name = d[i];
        let value = b[name];
        let target = a[name];
        if ( target ){
            if ( Array.isArray(target) ){
                if ( Array.isArray(value) ){
                    a[name] = unique(target.concat(value));
                }else{
                    if ( target.indexOf(value) == -1 ){
                        target.push(value);
                    }
                }
            }else{
                if ( target != value ){
                    a[name] = [target, value];
                }
            }
        }else{
            a[name] = value;
        }
    }
    return a;
}
