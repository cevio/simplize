module.exports = {
    "index": {
        title: "首页",
        icon: '<i class="fa fa-home"></i>',
        url: '/',
        order: 1,
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
                events: {
                    beforeload: function(){
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
                        this.$headbar.class = 'white';
                    },
                    load: function() {
                        var that = this;
                            this.$refs.scroll.$on('refreshmove', function(y, _y){
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
                            this.$refs.scroll.$on('refreshend', function(){
                                that.scroll.status = 0;
                                that.scroll.text = '下拉刷新';
                            });
                            this.$refs.scroll.$on('refresh', function(next){
                                that.scroll.text = '正在刷新数据';
                                setTimeout(next, 3000);
                            });
                            this.$refs.scroll.$on('loadmore', function(next){
                                console.log('loadmoring');
                                setTimeout(next, 3000);
                            });
                    },
                    unload: function() {
                        this.$refs.scroll.$off('refreshmove');
                        this.$refs.scroll.$off('refreshend');
                        this.$refs.scroll.$off('refresh');
                        this.$refs.scroll.$off('loadmore');
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
