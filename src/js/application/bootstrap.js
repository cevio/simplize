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
import { modal } from './modal';
import History from './history';
import { _resource } from './config';
import './prototype';

PROXY.simplizeCache = new cache();
vue.mixin(mixin);

export function bootstrap( resource = {}, data = {}, toolbar = Toolbar ){
    fastclick.attach(document.body);
    PROXY.HISTORY = new History();
    vue.prototype.$history = PROXY.HISTORY.history;
    let Cache = PROXY.simplizeCache;
    let _data = Object.assign({}, _resource, data);
    let browsers = compileApp(resource, Cache);
    browsers.toolbar = toolbar;
    browsers.modal = modal;

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

    Object.defineProperty(Cache, 'root', { get(){ return Vue; } });
    Vue.$cache = Cache;

    return Vue;
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
