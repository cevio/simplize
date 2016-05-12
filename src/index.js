import './css/test.scss';
import * as simplize from './js/main.js';
import * as browsers from './browser';

simplize.ready(function() {
    const app = simplize.bootstrap(browsers);
    const a = app.$browser('a');
    const b = app.$browser('b');
    const c = app.$browser('c');

    app.$use('/b', b);
    app.$use('/c', c);
    app.$use(a);

    a.$active(function(){
        this.$render('index');
    })
    a.$active('/two', function(){
        this.$render('two');
    })
    b.$active(function(){
        this.$render('index');
    })
    c.$active(function(){
        this.$render('index');
    })

    app.$run();
});
