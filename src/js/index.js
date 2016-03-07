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
        this.$render('c', {
            before: function(){
                //this.$toolbar.status = true;
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
                //this.$toolbar.status = false;
            }
        })
    });




    // /a/b/c/d
    app.$use(indexBrowser);

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
                this.$headbar.right.fn = function(){
                    alert(2)
                }
                this.$headbar.class = 'white';
            },
            after: function(){
                var that = this;
                for ( var i = 0 ; i < 7 ; i++ ){
                    this.$refs['slider' + i].$emit('create');
                }
                this.$ajaxGet('a.html', function(code){
                    that.html = code;
                });
            }
        });
    });

    indexBrowser.$active('/a/b/c/d', function() {
        this.$render('b', {
            before: function(){
                this.$toolbar.status = false;
                this.$headbar.status = true;
                this.$headbar.center.text = 'Simplize Blog Naps';
                this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                this.$headbar.left.text="Back";
                this.$headbar.left.fn=function(){
                    history.back();
                }
                this.$headbar.right.icon='';
                this.$headbar.right.text='';
                this.$headbar.class = 'red';
            },
            after: function(){
                var that = this;
                this.$refs.scroll.$emit('create', function(){
                    this.$on('refreshmove', function(y, _y){
                        if ( y > _y * 2 ){
                            that.scroll.status = 1;
                            that.scroll.text = '松开进行刷新'
                        }else if ( y > _y ){
                            that.scroll.status = 0;
                            that.scroll.text = '继续下拉准备刷新';
                        }else{
                            that.scroll.status = 0;
                            that.scroll.text = '下拉刷新';
                        }
                    });
                    this.$on('refreshend', function(){
                        that.scroll.status = 0;
                        that.scroll.text = '下拉刷新';
                    });
                    this.$on('refresh', function(next){
                        that.scroll.text = '正在刷新数据';
                        setTimeout(next, 3000);
                    });
                    this.$on('loadmore', function(next){
                        console.log('loadmoring');
                        setTimeout(next, 3000);
                    });
                });
            }
        })
    });


    app.$run();
    //console.log(app);
});
