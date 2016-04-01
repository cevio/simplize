import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app/factory';
import { initUrl } from './init';
import appMethods from './app/method';
import { appWatches } from './app/watch';
import { appEvents } from './app/event';
import cache from './app/cache';
import session from './session';

window.HISTORY_NAME = 'simplize-histories';
window.HISTORY = new session(window.HISTORY_NAME);

let _resource = {
    req: {},
    env: {
        direction: '',
        referrer: '',
        animateDisable: false,
        viewScale: 1,
        viewType: 'device-width'
    },
    SP_currentBrowser: ''
}

vue.mixin(mixin);

export function bootstrap( resource = {}, data = {} ){
    _resource.req = initUrl(window.location);

    history.replaceState({ url: _resource.req.href }, document.title, _resource.req.origin);
    HISTORY.add(_resource.req);

    let Cache = new cache();
    let _data = Object.assign({}, _resource, data);
    let browsers = compileApp(resource, Cache);

    let Vue = new vue({
        el: createRoot(),
        data: _data,
        template: require('../../html/app.html'),
        components: browsers,
        methods: appMethods(function(object){ object.$emit('app:route'); }),
        watch: appWatches,
        events: appEvents
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
