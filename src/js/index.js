import * as simplize from './main.js';
import fetcher from './require';

simplize.browser('sync', function(resolve){
    fetcher(['http://127.0.0.1:8000/js/sync.js'], resolve);
});

simplize.webview('home', 'list', function(resolve){
    fetcher(['http://127.0.0.1:8000/js/list.js'], resolve);
});

const resource = {
    home: {
        options: {
            data: {
                icon: '<i class="fa fa-home"></i>',
                text: 'HOME',
                url: '/'
            }
        },
        webviews: {
            index: {
                template: require('../html/index.html'),
                events: {
                    "webview:load": function(){
                        console.log('index load')
                    },
                    "webview:preset": function(head){
                        head.active();
                        head.data.left.icon = '<i class="fa fa-close"></i>';
                        head.data.left.text = 'Exit';
                        head.data.right.icon = '<i class="fa fa-globe"></i>';
                        head.data.right.text = 'SoyieInjector';
                        head.data.center.text = 'Simplize demo';
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

    var home = app.$get('home');
    home.$active('/info', function(){
        this.$render('info');
    });
    home.$active('/list', function(){
        this.$render('list');
    });
    home.$active(function(){
        this.$render('index');
    });

    var sync = app.$get('sync');
    sync.$active(function(){
        this.$render('index');
    });

    app.$use('/sync', sync);
    app.$use(home);

    app.$run();
})
