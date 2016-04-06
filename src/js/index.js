import * as simplize from './main.js';
import fetcher from './require';

simplize.browser('sync', function(resolve) {
    fetcher(['http://192.168.20.57:8000/js/sync.js'], resolve);
});

simplize.webview('home', 'list', function(resolve) {
    fetcher(['http://192.168.20.57:8000/js/list.js'], resolve);
});

let picker_data = [];
for (let pi = 0; pi < 10; pi++) {
    picker_data.push({
        value: pi + 1,
        text: "第" + (pi + 1) + '个数据'
    })
}
let picker_data2 = [];
for (let pi = 0; pi < 150; pi++) {
    picker_data2.push({
        value: pi + 1,
        text: "第" + (pi + 1) + '个数据'
    })
}

const resource = {
    home: {
        inject: {
            icon: '<i class="fa fa-home"></i>',
            text: 'HOME',
            url: '/',
            order: 1
        },
        webviews: {
            index: {
                zindex: 2,
                template: require('../html/index.html'),
                events: {
                    "webview:preload": function() {
                        console.log('index preload')
                    },
                    "webview:loading": function() {
                        console.log('index loading')
                    },
                    "webview:load": function() {
                        console.log('index load');
                        // this.$alert('Hello world!').then(function(Alert) {
                        //     console.log(Alert);
                        // })


                    },
                    "webview:preset": function(head, tool) {
                        head.active();
                        tool.active();
                        head.data.left.icon = '<i class="fa fa-close"></i>';
                        head.data.left.text = 'Exit';
                        head.data.right.icon = '<i class="fa fa-globe"></i>';
                        head.data.right.text = 'Soyieer';
                        head.data.center.text = 'Simplize demo';
                        this.SP_webviewContentClass = 'test1';
                    }
                },
                methods: {
                    alertHandler: function() {
                        this.$alert('Hello world!').then(function(Alert) {
                            console.log(Alert);
                            Alert.$on('alert:ok', function() {
                                console.log('close ok')
                            })
                        })
                    },

                    confirmHandler: function() {
                        this.$confirm('Hello world!').then(function(Confirm) {
                            console.log(Confirm);
                            Confirm.$on('confirm:ok', function() {
                                console.log('confirm close ok')
                            })

                            Confirm.$on('confirm:cancel', function() {
                                console.log('confirm close cancel')
                            })
                        })
                    },

                    confirmAlert: function() {
                        var that = this;
                        this.$alert('Hello world2').then((Alert) => {
                            console.log(Alert);
                            Alert.$on('alert:ok', () => {
                                console.log('close ok')
                                setTimeout(function() {
                                    that.$confirm('Hello world confirm').then(function(Confirm) {
                                        console.log(Confirm);
                                        Confirm.$on('confirm:ok', function() {
                                            console.log('confirm close ok')
                                        })

                                        Confirm.$on('confirm:cancel', function() {
                                            console.log('confirm close cancel')
                                        })
                                    })
                                }, 0)

                            })
                        })
                    }
                }
            },
            info: {
                zindex: 3,
                template: require('../html/info.html'),
                events: {
                    "webview:load": function() {
                        console.log('info load')
                    },
                    "webview:preset": function(head) {
                        head.active();
                        head.data.left.icon = '<i class="fa fa-send"></i>';
                        head.data.left.text = 'Back';
                        head.data.right.icon = '<i class="fa fa-map-marker"></i>';
                        head.data.right.text = 'options';
                        head.data.left.click = () => {
                            this.$redirect('/');
                        }
                        head.data.center.text = 'Simplize info';
                        this.SP_webviewContentClass = 'test2';
                    },
                    "webview:refresh": function() {
                        console.log('refresh');
                    }
                }
            },
            picker: {
                template: require('../html/picker.html'),
                data: {
                    list: picker_data2,
                    index: 3
                },
                events: {
                    "webview:preset": function(headbar, toolbar) {
                        headbar.active();
                        toolbar.active();
                        headbar.data.left.icon = '<i class="fa fa-angle-left"></i>';
                        headbar.data.left.text = 'Back';
                        headbar.data.left.click = function() {
                            history.back();
                        }
                        headbar.data.center.text = 'Picker scroller';
                        this.SP_webviewContentClass = 'test2';
                    },
                    'webview:load': function() {
                        this.$refs.picker.$on('scroll:selected', function(data, index) {
                            console.log(data, index)
                        });
                    },
                    "webview:unload": function() {
                        this.$refs.picker.$off('scroll:selected');
                    }
                }
            },
            actionsheet: {
                template: require('../html/webviews/actionsheet.html'),
                data: {
                },
                events: {
                    "webview:preset": function(headbar, toolbar) {
                        headbar.active();
                        toolbar.active();
                        headbar.data.left.icon = '<i class="fa fa-angle-left"></i>';
                        headbar.data.left.text = 'Back';
                        headbar.data.left.click = function() {
                            history.back();
                        }
                        headbar.data.center.text = 'ActionSheet';
                    },
                    'webview:load': function() {
                      this.$actionsheet([{text:"wwww"},{text:"aaaaa"}],true).then(function(obj){
                        obj.$on("actionsheet:cancel",function(){
                          console.log(1111);
                        });
                        obj.$on("actionsheet:select",function(){
                          console.log(2222);
                        })
                      })

                    },
                    "webview:unload": function() {

                    }
                }
            }
        }
    }
}

const data = {
    SP_animate_switch: 'fade'
}


simplize.ready(function() {
    let app = simplize.bootstrap(resource, data);

    app
        .$use('/sync',
            app.$browser('sync')
            .$define('index')
        )
        .$use(
            app.$browser('home')
            .$define('/info', 'info')
            .$define('/list', 'list')
            .$define('/picker', 'picker')
            .$define('/actionsheet', 'actionsheet')
            .$define('index')
        );

    app.$run();
    console.log(app)
})
