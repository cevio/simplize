module.exports = {
    "index": {
        title: "首页",
        icon: '<i class="fa fa-home"></i>',
        url: '/',
        order: 1,
        webviews: {
            a: {
                data: {
                    test: [],
                    a:{
                        b:{
                            c:{
                                d: 1
                            }
                        }
                    },
                    g: 0.1
                },
                methods: {
                    click: function() {
                        window.location.href = "#/a/b/c/d";
                    },
                    dclick: function(){
                        var that = this;
                        var a = this.$loader({
                            mask: true,
                            iswide: false,
                            isblack: true
                        });
                        setTimeout(function(){
                            a.close();
                        }, 3000);
                    }
                },
                components: {
                    as: {
                        name: 'as',
                        template: '<p>as component</p>'
                    }
                },
                events: {
                    load: function(){
                        //console.log('a is loaded')
                    },
                    unload: function(){
                        //console.log('a is unloaded')
                    }
                }
            },
            b: {
                data: {
                    scroll: {
                        icon: '<i class="fa fa-long-arrow-down"></i>',
                        text: '下载刷新',
                        status: 0
                    }
                },
                events: {
                    load: function() {
                        //console.log('b is loaded')
                    },
                    unload: function() {
                        //console.log('b is unloaded')
                    }
                }
            }
        }
    },
    "list": {
        title: '李彪爷',
        icon: '<i class="fa fa-home"></i>',
        url: '/c',
        order: 2,
        webviews: {
            c: {}
        }
    },
    "bs": {
        title: '测试',
        icon: '<i class="fa fa-list"></i>',
        url: '/d',
        order: 3,
        webviews: {
            d: {}
        }
    }
}
