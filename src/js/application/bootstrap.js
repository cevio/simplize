import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app/factory';
import { initUrl } from './init';
import appMethods from './app/method';
import { appWatches } from './app/watch';
import { appEvents } from './app/event';
import appCreeated from './app/created';
import cache from './app/cache';

let firstEnter = true, firstEnterCallback;

let _resource = {
    req: {},
    env: {
        viewScale: 1,
        viewType: 'device-width'
    },
    SP_currentBrowser: ''
}

vue.mixin(mixin);

export function bootstrap( resource = {}, data = {} ){
    _resource.req = initUrl(window.location);

    if ( firstEnter ){
        history.replaceState({ url: _resource.req.href }, document.title, _resource.req.origin);
        firstEnter = false;
        firstEnterCallback = function(object){
            object.$emit('app:route');
        }
    }

    let Cache = new cache();
    let _data = Object.assign({}, _resource, data);
    let browsers = compileApp(resource, Cache);

    let Vue = new vue({
        el: createRoot(),
        data: _data,
        template: require('../../html/app.html'),
        components: browsers,
        methods: appMethods(firstEnterCallback),
        watch: appWatches,
        events: appEvents,
        created: appCreeated
    });
    Vue.$cache = Cache;
    Object.defineProperty(Cache, 'root', { get: function(){ return Vue; } });
    return Vue;
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
