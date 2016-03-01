var simplize = require('./main');
var database = require('./data');

simplize.ready(function() {
    simplize.viewport('retina');
    var app = simplize(database);
    app.env.debug = true;

    app.$toolbar.status = false;

    app.$on('ready', function(){
        console.log('app is ready');
    })

    app.$on('end', function() {
        console.log('pass');
    });

    app.$toolbar.$on('active', function(){
        console.log('toolbar active');
    });

    app.$toolbar.$on('unactive', function(){
        console.log('toolbar unactive');
    });

    var indexBrowser = app.$browser('index');
    var aWebview = indexBrowser.$webview('a');
    var headbar = indexBrowser.$headbar;



    var b = app.$browser('list');
    app.$use('/c', b);
    b.$active(function(){
        this.$render('c', {
            before: function(){
                this.$toolbar.status = true;
                this.$headbar.status = true;
                this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                this.$headbar.left.text="Home";
                this.$headbar.center.text = 'Component C Page';
                this.$headbar.right.icon='';
                this.$headbar.right.text='';
                this.$headbar.class = 'red';
            }
        })
    });

    b.$on('active', function(){
        console.log('b browser active');
    });
    b.$on('unactive', function(){
        console.log('b browser unactive');
    });

    var d = app.$browser('bs');
    app.$use('/d', d);
    d.$active(function(){
        this.$render('d', {
            before: function(){
                this.$headbar.status = true;
                this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                this.$headbar.left.text="Home";
                this.$headbar.center.text = 'Component D Page';
                this.$headbar.right.icon='';
                this.$headbar.right.text='';
                this.$headbar.class = 'green';
                this.$toolbar.status = false;
            }
        })
    });




    // /a/b/c/d
    app.$use(indexBrowser);
    indexBrowser.$on('active', function(){
        console.log('index browser active');
    });
    indexBrowser.$on('unactive', function(){
        console.log('index browser unactive');
    })
    // /indexBrowser.$route('a');
    indexBrowser.$use(simplize.localStorage());
    indexBrowser.$use(simplize.cookieStorage());
    indexBrowser.$active(function() {
        this.$render('a', {
            before: function(){
                this.$toolbar.status = true;
                this.$headbar.status = true;
                this.$headbar.left.icon='';
                this.$headbar.left.text="";
                this.$headbar.center.text = 'Simplize Demo Index';
                this.$headbar.right.icon='<i class="fa fa-sliders"></i>';
                this.$headbar.right.text='Set';
                this.$headbar.class = 'white';
            }
        });
    });

    indexBrowser.$active('/a/b/c/d', function() {
        this.$render('b', {
            before: function(){
                this.$toolbar.status = false;
                this.$headbar.status = false;
                this.$headbar.center.text = 'Simplize Blog Naps';
                this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                this.$headbar.left.text="Back";
                this.$headbar.left.fn=function(){
                  history.back();
                }
                this.$headbar.right.icon='';
                this.$headbar.right.text='';
                this.$headbar.class = 'white';
            }
        })
    });


    app.$run();
    console.log(app);
});
