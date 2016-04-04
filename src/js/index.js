import * as simplize from './main.js';
import fetcher from './require';

simplize.browser('sync', function(resolve){
    fetcher(['http://192.168.2.102:8000/js/sync.js'], resolve);
});

simplize.webview('home', 'list', function(resolve){
    fetcher(['http://192.168.2.102:8000/js/list.js'], resolve);
});

const resource = {
    home: {
        inject: {
            icon: '<i class="fa fa-home"></i>',
            text: 'HOME',
            url: '/',
            order: 1
        },
        webviews: {
            index: {
                zindex: 2,
                template: require('../html/index.html'),
                events: {
                    "webview:preload": function(){
                        console.log('index preload')
                    },
                    "webview:loading": function(){
                        console.log('index loading')
                    },
                    "webview:load": function(){
                        console.log('index load')
                    },
                    "webview:preset": function(head, tool){
                        head.active();
                        tool.active();
                        head.data.left.icon = '<i class="fa fa-close"></i>';
                        head.data.left.text = 'Exit';
                        head.data.right.icon = '<i class="fa fa-globe"></i>';
                        head.data.right.text = 'Soyieer';
                        head.data.center.text = 'Simplize demo';
                        this.SP_webviewContentClass = 'test1';
                    }
                }
            },
            info: {
                zindex: 3,
                template: require('../html/info.html'),
                events: {
                    "webview:load": function(){
                        console.log('info load')
                    },
                    "webview:preset": function(head){
                        head.active();
                        head.data.left.icon = '<i class="fa fa-send"></i>';
                        head.data.left.text = 'Back';
                        head.data.right.icon = '<i class="fa fa-map-marker"></i>';
                        head.data.right.text = 'options';
                        head.data.left.click = () => {
                            this.$redirect('/');
                        }
                        head.data.center.text = 'Simplize info';
                        this.SP_webviewContentClass = 'test2';
                    },
                    "webview:refresh": function(){
                        console.log('refresh');
                    }
                }
            }
        }
    }
}

const data = {
    SP_animate_switch: 'fade'
}


simplize.ready(function(){
    let app = simplize.bootstrap(resource, data);
    app.$on('app:passend', function(){
        console.log('passed');
    })

    const home = app.$browser('home').$define('/info', 'info').$define('/list', 'list').$define('index');
    const sync = app.$browser('sync').$define('index');

    app.$use('/sync', sync).$use(home);

    app.$run();
    console.log(app)
})
