var context = require('./main');
var pg = require('./pg');

pg.setWebViewScrollLock(true);
pg.hideNavbar();

context.ready(function(){
    context.viewPort('retina');

    var soyie = new context('#webapp');

    soyie.on('browserchange', function(){
    console.log('change', arguments)
    });

// index
    var scope = {
        a:1,
        b: [2,4,5,3]
    };

    var indexBrowser = soyie.browser({
        name: 'index',
        text: '首页',
        icon: '<i class="fa fa-home"></i>',
        url: '/'
    });
    //indexBrowser.stopAnimate = true;

    indexBrowser.component("test", {
        template: "<div><slot></slot></div>"
    });

    var a = indexBrowser.webview("template[name='index']");
    var b = indexBrowser.webview("template[name='list']");

    a.on('beforeLeave', function(){
        console.log('index beforeLeave');
    })

    a.on('leave', function(){
        console.log('index leave');
    })

    a.on('afterLeave', function(){
        console.log('index afterLeave');
    })

    a.on('beforeEnter', function(){
        console.log('index beforeEnter');
    })

    a.on('enter', function(){
        console.log('index enter');
    })

    a.on('afterEnter', function(){
        console.log('index afterEnter');
    })

    b.on('beforeLeave', function(){
        console.log('list beforeLeave');
    })

    b.on('leave', function(){
        console.log('list leave');
    })

    b.on('afterLeave', function(){
        console.log('list afterLeave');
    })

    b.on('beforeEnter', function(){
        console.log('list beforeEnter');
    })

    b.on('enter', function(){
        console.log('list enter');
    })

    b.on('afterEnter', function(){
        console.log('list afterEnter');
    });

    indexBrowser.$method('openit', function(){
        indexBrowser.openWebView('baidu.org', 'http://nap.webkits.cn');
    });

    indexBrowser.use(function(req, res, next){
        req.$head.center.value = '<div class="f16">首页</div><div class="f7">安全支付</div>';
        req.$head.left.icon = '<i class="fa fa-tablet"></i>';
        req.$head.left.value = '设置';
        req.$head.cls = "nav-index";
        req.app.hideToolbar = false;
        req.$head.hide = false;
        req.$head.left.fn = function(){
            res.redirect('/setting/mo');
        }
        req.$scope.$data = scope;
        next();
    });

    indexBrowser.active(function(req, res){
        req.$head.right.icon = '';
        req.$head.right.value = '';
        req.$scope.$set('click', function(){
            res.redirect('/list');
        });
        res.render('index', function(){
            this.$watch('a', function(){
                return 1;
            }, {deep:true})
            console.log(this)
        });
    });
    indexBrowser.active('/list', function(req, res){
        req.$head.center.value = '首页 - 列表';
        req.$head.left.icon = '<i class="fa fa-arrow-left"></i>';
        req.$head.left.value = '返回';
        req.$head.right.icon = '<i class="fa fa-arrow-right"></i>';
        req.$head.right.value = '返回';
        req.$head.cls = "nav-list";
        //req.$head.hide = true;
        req.app.hideToolbar = true;
        req.$head.left.fn = function(){
            res.redirect('/');
        }
        res.render('list');
    });







// setting
    var scope2 = {
        a:1,
        b: [2,4,5,3]
    };
    var settingBrowser = soyie.browser({
        name: 'setting',
        text: '首页',
        icon: '<i class="fa fa-cog"></i>',
        url: '/setting'
    });

    settingBrowser.webview("template[name='settings']");
    settingBrowser.webview("template[name='mo']");

    settingBrowser.use(function(req, res, next){
        req.$head.center.value = '设置';
        req.$head.left.icon = '<i class="fa fa-arrow-left"></i>';
        req.$head.left.value = '返回';
        req.$head.cls = "nav-setting";
        req.$head.left.fn = function(){
            res.redirect('/');
        }
        req.$scope.$data = scope2;
        next();
    });

    settingBrowser.active(function(req, res){
        res.render('settings');
    });
    settingBrowser.active('/mo', function(req, res){
        req.$head.center.value = '设置mo';
        req.$head.left.icon = '<i class="fa fa-arrow-left"></i>';
        req.$head.left.value = '返回';
        req.$head.cls = "nav-setting";
        req.$head.left.fn = function(){
            res.redirect('/setting');
        }
        res.render('mo');
    });








    soyie.use('/setting', settingBrowser);
    soyie.use(indexBrowser);

    soyie.on('end', function(){
        console.log('complete')
    });


    //console.log(soyie)
    soyie.listen();
    //console.log(soyie)
});
