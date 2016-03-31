export function compileApp(resource = {}, cache){
    let result = {};
    for ( let i in resource ){
        if ( resource.hasOwnProperty(i) ){
            var _cache = cache.set('browser-' + i);
            Object.assign(result, compileBrowser(i, resource[i], _cache));
        }
    }
    return result;
}

export function compileBrowser(name, resource = {}, cache){
    let options = resource.options || {};
    let webviews = resource.webviews || {};
    let _data = options.data || {};
    let result = {}, templates = [];
    _data.SP_currentWebview = null;
    let browser = {
        name: 'browser',
        template: require('../../../html/browser.html'),
        components: {},
        data: function(){ return _data; }
    }
    for ( let i in webviews ){
        if ( webviews.hasOwnProperty(i) ){
            cache.set('webview-' + i);
            var component = compileWebview(i, webviews[i]);
            templates.push(component.tag);
            browser.components[component.name] = component.component;
        }
    }
    browser.template = browser.template.replace('{{webviews}}', templates.join(''));
    result['browser-' + name] = browser;
    return result;
}

export function compileWebview(name, resource = {}){
    let result = { component: null, tag: '', name: '' };
    resource.data = resource.data || {};
    resource.data.SP_status = false;
    let defaults = {
        name: 'webview',
        template: require('../../../html/webview.html').replace('{{webview}}', resource.template || ''),
        data: function(){
            return resource.data;
        },
        events: {
            "webview:active": function(){
                this.SP_status = true;
                this.$parent.SP_currentWebview = this;
            },
            "webview:unactive": function(){
                this.SP_status = false;
            }
        }
    }

    if ( resource.keepalive === undefined || !!resource.keepalive ){
        resource.keepalive = true;
    }else{
        resource.keepalive = false;
    }

    if ( resource.keepalive ){
        defaults.template = defaults.template.replace('{{status}}', 'show');
    }else{
        defaults.template = defaults.template.replace('{{status}}', 'if');
    }

    result.component = Object.assign({}, resource, defaults);
    result.tag = '<webview-' + name + ' v-ref:webview-' + name + '></webview-' + name + '>';
    result.name = 'webview-' + name;
    return result;
}
