module.exports = {
    "index": {
        title: "首页",
        icon: '<i class="fa fa-home"></i>',
        url: '/',
        order: 1,
        keepAlive: true,
        webviews: {
            a: {
                data: {
                    bc: new Date('1996/1/19 10:21:43'),
                    test: [],
                    a:{
                        b:{
                            c:{
                                d: 1
                            }
                        }
                    },
                    g: 0.8,
                    s: new Date().getTime(),
                    html: ''
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
                    },
                    cm: function(){
                        var a = this.$pop();
                        a.html = 'dafafd';
                    }
                },
                components: {
                    as: {
                        name: 'as',
                        template: '<p>as component</p>'
                    }
                },
                events: {
                    beforeload: function(){
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
                    load: function(){
                        var that = this;
                        for ( var i = 0 ; i < 7 ; i++ ){
                            this.$refs['slider' + i].$emit('create');
                        }
                        this.$ajaxGet('a.html', function(code){
                            that.html = code;
                        });
                    },
                    unload: function(){
                        //console.log('a is unloaded')
                    }
                },
                filters: {
                    fixProgress: function(value){
                        return (value * 100).toFixed(2) + '%';
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
                methods: {
                    click: function(){
                        alert(1)
                    }
                },
                events: {
                    beforeload: function(){
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
                    },
                    load: function() {
                        var that = this;
                        var scroller = this.$refs.scroll;
                        scroller.$on('refresh:trigger', function(){
                            var self = this;
                            console.log('refreshing...');
                            setTimeout(function(){
                                self.$emit('refresh:reset');
                            }, 3000);
                        });
                        scroller.$on('refresh:before', function(){
                            console.log('before');
                        })
                        scroller.$on('refresh:progress', function(percent){
                            console.log('progress:' + (percent * 100).toFixed(2) + '%');
                        });
                        scroller.$on('refresh:overflow', function(){
                            console.log('overflow');
                        })

                        scroller.$on('loadmore:trigger', function(){
                            var self = this;
                            console.log('loadmore...');
                            setTimeout(function(){
                                self.$emit('loadmore:reset');
                            }, 3000);
                        });

                        scroller.$on('loadmore:before', function(){
                            console.log('before');
                        })
                        scroller.$on('loadmore:progress', function(percent){
                            console.log('progress:' + (percent * 100).toFixed(2) + '%');
                        });
                        scroller.$on('loadmore:overflow', function(){
                            console.log('overflow');
                        })
                    },
                    unload: function() {

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
        keepAlive: true,
        webviews: {
            c: {
                events: {
                    beforeload: function(){
                        this.$toolbar.status = true;
                        this.$headbar.status = true;
                        this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                        this.$headbar.left.text="Home";
                        this.$headbar.center.text = 'Component C Page';
                        this.$headbar.right.icon='';
                        this.$headbar.right.text='';
                        this.$headbar.class = 'white';
                    }
                }
            }
        }
    },
    "bs": {
        title: '测试',
        icon: '<i class="fa fa-list"></i>',
        url: '/d',
        order: 3,
        keepAlive: true,
        webviews: {
            d: {
                events: {
                    beforeload: function(){
                        this.$headbar.status = true;
                        this.$headbar.left.icon='<i class="fa fa-angle-left"></i>';
                        this.$headbar.left.text="Home";
                        this.$headbar.center.text = 'Component D Page';
                        this.$headbar.right.icon='';
                        this.$headbar.right.text='';
                        this.$headbar.class = 'white';
                        this.$toolbar.status = false;
                    }
                }
            }
        }
    }
}
