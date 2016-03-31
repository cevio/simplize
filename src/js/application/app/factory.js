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
    let result = {};
    _data.SP_currentWebview = '';
    let browser = {
        name: 'browser',
        template: require('../../../html/browser.html'),
        components: {},
        data: function(){ return _data; }
    }
    for ( let i in webviews ){
        if ( webviews.hasOwnProperty(i) ){
            cache.set('webview-' + i);
            Object.assign(browser.components, compileWebview(i, webviews[i]));
        }
    }

    result['browser-' + name] = browser;
    return result;
}

export function compileWebview(name, resource = {}){
    let result = {};
    let defaults = {
        name: 'webview',
        template: require('../../../html/webview.html').replace('{{webview}}', resource.template || ''),
        data: function(){
            return resource.data || {};
        }
    }
    result['webview-' + name] = Object.assign({}, resource, defaults);;
    return result;
}
