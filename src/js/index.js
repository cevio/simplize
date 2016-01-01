var context = require('./main');
window.onload = function(){
    var soyie = new context('#webapp');




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

    indexBrowser.webview("template[name='index']");
    indexBrowser.webview("template[name='list']");

    indexBrowser.use(function(req, res, next){
        req.$head.center.value = '首页';
        req.$head.left.icon = '<i class="fa fa-tablet"></i>';
        req.$head.left.value = '设置';
        req.$head.cls = "nav-index";
        req.app.hideToolbar = false;
        req.$head.left.fn = function(){
            res.redirect('/setting/mo');
        }
        req.$scope.$data = scope;
        next();
    });

    indexBrowser.active(function(req, res){
        req.$scope.$set('click', function(){
            res.redirect('/list');
        });
        res.render('index');
    });
    indexBrowser.active('/list', function(req, res){
        req.$head.center.value = '首页 - 列表';
        req.$head.left.icon = '<i class="fa fa-arrow-left"></i>';
        req.$head.left.value = '返回';
        req.$head.cls = "nav-list";
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
    console.log(soyie)
}
