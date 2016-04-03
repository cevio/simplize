import * as simplize from './main.js';
import fetcher from './require';

simplize.browser('sync', function(resolve){
    fetcher(['http://192.168.2.104:8000/js/sync.js'], resolve);
});

simplize.webview('home', 'list', function(resolve){
    fetcher(['http://192.168.2.104:8000/js/list.js'], resolve);
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
                        head.data.left.click = function(){
                            history.back();
                        }
                        head.data.center.text = 'Simplize info';
                        this.SP_webviewClass = 'test1';
                    }
                }
            }
        }
    }
    //
    // sync: function(resolve){
    //     fetcher(['http://127.0.0.1:8000/js/sync.js'], resolve);
    // }
}

const data = {
    SP_animate_switch: 'fade'
}


simplize.ready(function(){
    let app = simplize.bootstrap(resource, data);
    app.$on('app:passend', function(){
        console.log('passed');
    })

    var home = app.$browser('home');
    home.$active('/info', function(){
        this.$render('info');
    });
    home.$active('/list', function(){
        this.$render('list');
    });
    home.$active(function(){
        this.$render('index');
    });

    var sync = app.$browser('sync');
    sync.$active(function(){
        this.$render('index');
    });

    app.$use('/sync', sync);
    app.$use(home);

    app.$run();
    console.log(app)
})
