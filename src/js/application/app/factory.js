export function compileApp(resource = {}, cache) {
    let result = {};
    for (let i in resource) {
        if (resource.hasOwnProperty(i)) {
            var _cache = cache.set('browser-' + i);
            Object.assign(result, compileBrowser(i, resource[i], _cache));
        }
    }
    return result;
}

export function compileBrowser(name, resource = {}, cache) {
    let result = {}, templates = [];
    let options = resource.options || {};
    let webviews = resource.webviews || {};
    let _data = options.data || {};
    if ( options.data ) delete options.data;
    _data.SP_currentWebview = null;
    _data.SP_firstEnter = true;
    let browser = {
        name: 'browser',
        template: require('../../../html/browser.html'),
        components: {},
        data: function() {
            return _data;
        }
    }
    for (let i in webviews) {
        if (webviews.hasOwnProperty(i)) {
            cache.set('webview-' + i);
            var component = compileWebview(i, webviews[i]);
            templates.push(component.tag);
            browser.components[component.name] = component.component;
        }
    }

    browser.template = browser.template.replace('{{webviews}}', templates.join(''));
    result['browser-' + name] = assign(options, browser);
    return result;
}

export function compileWebview(name, resource = {}) {
    let result = {
        component: null,
        tag: '',
        name: ''
    };

    let _data = resource.data || {};
    _data.SP_status = false;
    _data.SP_direction = '';
    if ( resource.data ) delete resource.data;

    let defaults = {
        name: 'webview',
        template: require('../../../html/webview.html').replace('{{webview}}', resource.template || ''),
        data: function() {
            return _data;
        },
        events: {
            "webview:active": function() {
                switch (this.$root.env.direction) {
                    case 'turn:left':
                        this.SP_direction = 'upper';
                        break;
                    case 'turn:right':
                        this.SP_direction = 'under';
                        break;
                }
                this.SP_status = true;
                this.$parent.SP_currentWebview = this;
            },
            "webview:unactive": function() {
                switch (this.$root.env.direction) {
                    case 'turn:left':
                        this.SP_direction = 'under';
                        break;
                    case 'turn:right':
                        this.SP_direction = 'upper';
                        break;
                }
                this.SP_status = false;
            }
        },
        computed: {
            SP_animate: function() {
                return this.$parent.SP_firstEnter ? 'none' : 'sp-webview';
            }
        }
    }

    defaults.transitions = {};
    defaults.transitions["sp-webview"] =
    defaults.transitions["none"] =
    {
        beforeEnter: function(){
            this.$emit('webview:preload');
        },
        enter: function() {
            this.$emit('webview:loading');
        },
        afterEnter: function(){
            this.SP_direction = '';
            this.$emit('webview:load');
        },
        beforeLeave: function(){
            this.$emit('webview:preunload');
        },
        leave: function() {
            this.$emit('webview:unloading');
        },
        afterLeave: function(){
            this.SP_direction = '';
            this.$emit('webview:unload');
        }
    }

    if (resource.keepalive === undefined || !!resource.keepalive) {
        resource.keepalive = true;
    } else {
        resource.keepalive = false;
    }

    if (resource.keepalive) {
        defaults.template = defaults.template.replace('{{status}}', 'show');
    } else {
        defaults.template = defaults.template.replace('{{status}}', 'if');
    }

    if ( resource.keepalive !== undefined ){
        delete resource.keepalive;
    }

    result.component = assign(resource, defaults);
    result.tag = '<webview-' + name + ' v-ref:webview-' + name + '></webview-' + name + '>';
    result.name = 'webview-' + name;
    return result;
}

function assign(source, target){
    let keys = ['computed', 'methods', 'watch', 'directives', 'elementDirectives', 'filters', 'components', 'transitions', 'partials', 'events', 'mixins'];
    let result = {};
    extend(source);
    extend(target);
    return result;

    function extend(which){
        for ( let i in which ){
            if ( which.hasOwnProperty(i) ){
                let value = which[i];
                if ( keys.indexOf(i) > -1 ){
                    if ( !result[i] ) result[i] = {};
                    for ( let j in value ){
                        if ( value.hasOwnProperty(j) ) {
                            result[i][j] = value[j];
                        }
                    }
                }else{
                    result[i] = value;
                }
            }
        }
    }
}
