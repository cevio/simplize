import vue from 'vue';
import * as mixin from './mixins';
import { compileApp } from './app-factory';

const _resource = {
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
        let _data = {};
        Object.assign(_data, _resource, data);
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
