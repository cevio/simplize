import * as simplize from './main.js';
import fetcher from './require';

simplize.browser('sync', function(resolve){
    fetcher(['http://127.0.0.1:8000/js/sync.js'], resolve);
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
                        console.log('load')
                    }
                }
            },
            info: {
                template: require('../html/info.html')
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
