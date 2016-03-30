export function compileApp(resource = {}){
    let result = {};
    for ( let i in resource ){
        if ( resource.hasOwnProperty(i) ){
            Object.assign(result, compileBrowser(i, resource[i]));
        }
    }
    return result;
}

export function compileBrowser(name, resource = {}){
    let options = resource.options || {};
    let webviews = resource.webviews || {};
    let _data = options.data || {};
    let result = {};
    _data.SP_currentWebview = 'webview-index';
    let browser = {
        name: 'browser',
        template: require('../../html/browser.html'),
        components: {},
        data: function(){ return _data; }
    }
    for ( let i in webviews ){
        if ( webviews.hasOwnProperty(i) ){
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
        template: require('../../html/webview.html').replace('{{webview}}', resource.template || ''),
        data: function(){
            return resource.data || {};
        }
    }
    result['webview-' + name] = Object.assign({}, resource, defaults);;
    return result;
}
