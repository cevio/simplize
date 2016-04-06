import * as simplize from './main.js';
import fetcher from './require';
import * as webviews from '../example/webview.js';

simplize.browser('sync', function(resolve) {
    fetcher(['http://192.168.20.57:8000/js/sync.js'], resolve);
});

simplize.webview('home', 'list', function(resolve) {
    fetcher(['http://192.168.20.57:8000/js/list.js'], resolve);
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
            index: webviews.index,
            info: webviews.info,
            picker: webviews.picker,
            actionsheet: webviews.actionsheet,
            button: webviews.button
        }
    }
}

const data = {
    SP_animate_switch: 'fade'
}


simplize.ready(function() {
    let app = simplize.bootstrap(resource, data);

    app
        .$use('/sync',
            app.$browser('sync')
            .$define('index')
        )
        .$use(
            app.$browser('home')
            .$define('/info', 'info')
            .$define('/list', 'list')
            .$define('/picker', 'picker')
            .$define('/actionsheet', 'actionsheet')
            .$define('index')
        );

    app.$run();
    console.log(app)
})
