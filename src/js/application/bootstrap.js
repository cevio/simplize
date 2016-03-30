import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app-factory';
import { initUrl } from './init';

let firstEnter = true;

let _resource = {
    req: {},
    env: {
        viewScale: 1,
        viewType: 'device-width'
    },
    __currentBrowser: ''
}

vue.mixin(mixin);

export default {
    bootstrap( resource = {}, data = {} ){
        _resource.req = initUrl(window.location);
        if ( firstEnter ){
            history.replaceState({ url: _resource.req.href }, document.title, _resource.req.origin);
            firstEnter = false;
        }

        let _data = Object.assign({}, _resource, data);

        _data.SP_currentBrowser = 'browser-home';

        let browsers = compileApp(resource);
        return new vue({
            el: createRoot(),
            data: _data,
            template: require('../../html/app.html'),
            components: browsers
        });
    }
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
