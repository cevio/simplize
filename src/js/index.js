import * as simplize from './main.js';
import * as browsers from '../example/resource.js';

const data = {
    SP_animate_switch: 'fade'
}

simplize.ready(function() {
    let app = simplize.bootstrap(browsers, { SP_animate_switch: 'fade' });

    app
        .$use(
            app.$browser('cores')
                .$define('/info', 'info')
                .$define('/picker', 'picker')
                .$define('/actionsheet', 'actionsheet')
                .$define('index')
        );

    app.$run();
});
