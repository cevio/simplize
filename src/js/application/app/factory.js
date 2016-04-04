import { headbar } from '../headbar';
export function compileApp(resource = {}, cache) {
    let result = {};
    for (let i in resource) {
        if (resource.hasOwnProperty(i)) {
            var _cache = cache.set('browser-' + i);
            _cache._type = 'browser';
            Object.assign(result, compileBrowser(i, resource[i], _cache));
        }
    }
    return result;
}

export function compileBrowser(name, resource = {}, cache) {
    let result = {}, templates = [];
    let inject = resource.inject || {};
    let options = resource.options || {};
    let webviews = resource.webviews || {};
    let _data = options.data || {};
    let _headbar = resource.headbar || headbar;
    if ( options.data ) delete options.data;
    _data.SP_currentWebview = null;
    _data.SP_firstEnter = true;
    _data.SP_background_color = '';
    _data.SP_browser_name = 'browser-' + name;
    cache.inject = inject;
    let browser = {
        name: 'browser',
        template: require('../../../html/browser.html'),
        components: {},
        data() { return _data; },
        beforeDestroy(){
            this.SP_firstEnter = true;
            this.SP_background_color = '';
            this.SP_currentWebview = null;
        },
        ready(){ this.$emit('browser:async'); },
        events: {
            // 告诉toolbar，现在正在使用这个browser
            'toolbar:exchange': function(){
                this.$root.$refs.toolbar.current = this.SP_browser_name;
            }
        }
    }

    for (let i in webviews) {
        if (webviews.hasOwnProperty(i)) {
            let webCache = cache.set('webview-' + i);
            let component = compileWebview(i, webviews[i]);
            webCache._type = 'webview';
            templates.push(component.tag);
            browser.components[component.name] = component.component;
        }
    }

    browser.components['headbar'] = _headbar;

    cache._webviews.forEach(function(web){
        templates.push(web);
    });

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
    _data.SP_paddingTop = 0;
    _data.SP_paddingBottom = 0;
    _data.SP_webviewClass = '';
    _data.SP_webviewForceNoPadding = false;
    _data.SP_webviewContentClass = '';
    _data.SP_webviewContentStyle = '';

    if ( resource.data ) delete resource.data;

    let defaults = {
        name: 'webview',
        template: require('../../../html/webview.html').replace('{{webview}}', resource.template || ''),
        data() { return _data; },
        events: {
            "webview:active": function() {
                if ( this.$root.env.direction === 'turn:still' ){
                    this.$emit('webview:refresh');
                    return;
                }

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
                this.SP_paddingTop = this.$parent.$refs.headbar.height;
                this.SP_paddingBottom = this.$root.$refs.toolbar.height;

                if ( this.SP_animate == 'none' || this.$root.env.stopAnimate ){
                    this.$nextTick(() => {
                        if ( this.$options._isAsync ){
                            this.$options._isAsync = false;
                            return;
                        }
                        this.SP_direction = '';
                        this.SP_status = true;
                        this.$emit('webview:preload');
                        this.$emit('webview:loading');
                        this.$emit('webview:load');
                        this.$parent.$refs.headbar.$emit('webview:load');
                    })
                }
            },
            "webview:unactive": function() {
                if ( this.$root.env.direction === 'turn:still' ) return;
                switch (this.$root.env.direction) {
                    case 'turn:left':
                        this.SP_direction = 'under';
                        break;
                    case 'turn:right':
                        this.SP_direction = 'upper';
                        break;
                }
                this.SP_status = false;
                if ( this.SP_animate == 'none' || this.$root.env.stopAnimate ){
                    this.$nextTick(() => {
                        this.SP_direction = '';
                        this.$emit('webview:preunload');
                        this.$emit('webview:unloading');
                        this.$emit('webview:unload');
                    })
                }
            }
        },
        computed: {
            SP_webviewClasses: function(){
                var classes = [];
                this.SP_direction && classes.push(this.SP_direction);
                this.SP_webviewClass && classes.push(this.SP_webviewClass);
                return classes.join(' ');
            },
            SP_animate: function() {
                return this.$root.env.stopAnimate
                    ? ''
                    : (
                        this.$parent.SP_firstEnter
                        ? 'none'
                        : 'sp-webview'
                    );
            },
            SP_content_style: function(){
                var styles = [];
                styles.push('padding-top:' + (this.SP_webviewForceNoPadding ? 0 : this.SP_paddingTop) + 'px');
                styles.push('padding-bottom:' + this.SP_paddingBottom + 'px');
                this.SP_webviewContentStyle && styles.push(this.SP_webviewContentStyle);
                return styles.join(';');
            }
        }
    }

    defaults.transitions = {};
    defaults.transitions["sp-webview"] =
    {
        beforeEnter: function(){
            if ( this.$options._isAsync ) return;
            this.$emit('webview:preload');
        },
        enter: function() {
            if ( this.$options._isAsync ) return;
            this.$emit('webview:loading');
        },
        afterEnter: function(){
            if ( this.$options._isAsync ){
                this.$options._isAsync = false;
                return ;
            }
            this.SP_direction = '';
            this.$emit('webview:load');
            this.$parent.$refs.headbar.$emit('webview:load');
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
