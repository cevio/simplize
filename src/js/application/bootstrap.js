import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app/factory';
import { initUrl } from './init';
import appMethods from './app/method';
import { appWatches } from './app/watch';
import { appEvents } from './app/event';

let firstEnter = true, firstEnterCallback;

let _resource = {
    req: {},
    env: {
        viewScale: 1,
        viewType: 'device-width'
    },
    SP_currentBrowser: 'browser-home'
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

    let _data = Object.assign({}, _resource, data);
    let browsers = compileApp(resource);

    return new vue({
        el: createRoot(),
        data: _data,
        template: require('../../html/app.html'),
        components: browsers,
        methods: appMethods(firstEnterCallback),
        watch: appWatches,
        events: appEvents
    });
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
