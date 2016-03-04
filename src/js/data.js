module.exports = {
    "index": {
        title: "首页",
        icon: '<i class="fa fa-home"></i>',
        url: '/',
        order: 1,
        headdata: {
            status: true
        },
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
                    }
                },
                methods: {
                    click: function() {
                        window.location.href = "#/a/b/c/d";
                    },
                    dclick: function(){
                        var that = this;
                        var a = this.$confirm('非法操作系统，将被停职！',' 警告');
                        a.$on('ok', function(){
                            that.$alert('ok clicked');
                        });
                        a.$on('cancel', function(){
                            that.$alert('cancel clicked');
                        });
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
