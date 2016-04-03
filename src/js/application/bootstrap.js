import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app/factory';
import { initUrl } from './init';
import appMethods from './app/method';
import { appWatches } from './app/watch';
import { appEvents } from './app/event';
import cache from './app/cache';
import session from './session';
import fastclick from 'fastclick';
import { Toolbar } from './toolbar';
import * as PROXY from './proxy';

PROXY.HISTORY = new session(PROXY.HISTORY_NAME);
PROXY.simplizeCache = new cache();

let _resource = {
    req: {},
    env: {
        stopAnimate: false,
        direction: '',
        referrer: '',
        animateDisable: false,
        viewScale: 1,
        viewType: 'device-width'
    },
    SP_currentBrowser: '',
    SP_animate_switch: '',
    SP_firstEnter: true
}

vue.mixin(mixin);

export function bootstrap( resource = {}, data = {}, toolbar = Toolbar ){
    fastclick(document.body);
    _resource.req = initUrl(window.location);

    history.replaceState({ url: _resource.req.href }, document.title, _resource.req.origin);
    PROXY.HISTORY.add(_resource.req);

    let Cache = PROXY.simplizeCache;
    let _data = Object.assign({}, _resource, data);
    let browsers = compileApp(resource, Cache);
    browsers.toolbar = toolbar;

    let Vue = new vue({
        el: createRoot(),
        data: _data,
        template: require('../../html/app.html'),
        components: browsers,
        methods: appMethods(function(object){ object.$emit('app:route'); }),
        watch: appWatches,
        events: appEvents,
        computed: {
            SP_BrowserAnimate(){ return this.env.stopAnimate ? '' : this.SP_animate_switch; },
            SP_disableAnimation: {
                set( status ){ this.env.stopAnimate = status; },
                get(){ return this.env.stopAnimate; }
            }
        }
    });

    Object.defineProperty(Cache, 'root', { get: function(){ return Vue; } });
    Vue.$cache = Cache;

    return Vue;
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
