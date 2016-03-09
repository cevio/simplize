var simplize = require('./main');
var database = require('./data');

simplize.ago.formats.seconds = '秒';

simplize.ready(function() {
    simplize.viewport('retina');
    var app = simplize(database);
    app.env.debug = true;
    app.env.timer = true;

    //app.$toolbar.status = false;

    app.$on('ready', function(){
        //console.log('app is ready');
    })

    app.$on('end', function() {
        //console.log('pass');
    });

    app.$toolbar.$on('active', function(){
        //console.log('toolbar active');
    });

    app.$toolbar.$on('unactive', function(){
        //console.log('toolbar unactive');
    });

    var indexBrowser = app.$browser('index');
    var b = app.$browser('list');
    var d = app.$browser('bs');

    indexBrowser.$on('active', function(){
        //console.log('index browser active');
    });
    indexBrowser.$on('unactive', function(){
        //console.log('index browser unactive');
    })
    b.$on('active', function(){
        //console.log('b browser active');
    });
    b.$on('unactive', function(){
        //console.log('b browser unactive');
    });




    app.$use('/c', b);
    b.$active(function(){
        this.$render('c')
    });




    app.$use('/d', d);
    d.$active(function(){
        this.$render('d')
    });




    // /a/b/c/d
    app.$use(indexBrowser);

    // /indexBrowser.$route('a');
    indexBrowser.$use(simplize.localStorage());
    indexBrowser.$use(simplize.cookieStorage());
    indexBrowser.$active(function() {
        this.$render('a');
    });

    indexBrowser.$active('/a/b/c/d', function() {
        this.$render('b')
    });


    app.$run();
    //console.log(app);
});
