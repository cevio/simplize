import * as simplize from './main.js';
import * as browsers from '../example/resource.js';

simplize.ready(function() {
    let app = simplize.bootstrap(browsers, { SP_animate_switch: 'fade' });

    app
        .$use(
            app.$browser('cores')
                .$define('/modals', 'modals')
                .$define('/buttons', 'buttons')
                .$define('index')
        );

    app.$run();
});
