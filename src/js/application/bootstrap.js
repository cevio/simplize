import vue from 'vue';

const _resource = {
    req: {},
    env: {}
}

export default {
    bootstrap(resource, data){
        let _data = {};
        Object.assign(_data, _resource, data);
        return new vue({
            el: createRoot(),
            data: _data
        });
    }
}

function createRoot(){
    let app = document.createElement('div');
    document.body.appendChild(app);
    app.classList.add('sp-app');
    return app;
}
