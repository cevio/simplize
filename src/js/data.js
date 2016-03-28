module.exports = {
    "index": {
        title: "首页",
        icon: '<i class="fa fa-home"></i>',
        url: '/',
        order: 1,
        keepAlive: true,
        webviews: {
            home: require('../routers/home'),
            button: require('../routers/button')
        }
    }
}
