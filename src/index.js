import './css/test.scss';
import * as simplize from './js/main.js';
import * as browsers from './browser';

simplize.ready(function() {
    const app = simplize.bootstrap(browsers);
    const a = app.$browser('a');
    const b = app.$browser('b');

    app.$use('/b', b);
    app.$use(a);

    a.$active(function(){
        this.$render('index');
    })
    b.$active(function(){
        this.$render('index');
    })

    app.$run();
});
