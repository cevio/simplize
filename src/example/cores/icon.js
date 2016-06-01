export let icons = {
    zindex: 3,
    template: require('../../html/webviews/icon.html'),
    events: {
        "webview:load": function() {
            // var a = document.querySelectorAll('.icon_lists li');
            // var b = [];
            // for ( var i = 0 ; i < a.length ; i++ ){
            //     var d = a[i];
            //     b.push({
            //         name: q(d, '.name'),
            //         class: 'icon-' + q(d, '.fontclass').replace(/^\./, ''),
            //         code: q(d, '.code')
            //     })
            // }
            // console.log(JSON.stringify(b, null, 2))
        },
        "webview:preset": function(head) {
            head.active();
            head.data.left.icon = '<i class="iconfont icon-back"></i>';
            head.data.left.text = 'Back';
            head.data.left.click = () => {
                this.$redirect('/');
            }
            head.data.center.text = 'Icon';
        }
    },
    data: {
        list: [
          {
            "name": "check",
            "class": "icon-check",
            "code": "&amp;#xe600;"
          },
          {
            "name": "close",
            "class": "icon-close",
            "code": "&amp;#xe601;"
          },
          {
            "name": "edit",
            "class": "icon-edit",
            "code": "&amp;#xe602;"
          },
          {
            "name": "favor_fill",
            "class": "icon-favorfill",
            "code": "&amp;#xe603;"
          },
          {
            "name": "favor",
            "class": "icon-favor",
            "code": "&amp;#xe604;"
          },
          {
            "name": "loading",
            "class": "icon-loading",
            "code": "&amp;#xe605;"
          },
          {
            "name": "round_check_fill",
            "class": "icon-roundcheckfill",
            "code": "&amp;#xe606;"
          },
          {
            "name": "round_check",
            "class": "icon-roundcheck",
            "code": "&amp;#xe607;"
          },
          {
            "name": "round_close_fill",
            "class": "icon-roundclosefill",
            "code": "&amp;#xe608;"
          },
          {
            "name": "round_close",
            "class": "icon-roundclose",
            "code": "&amp;#xe609;"
          },
          {
            "name": "round_right_fill",
            "class": "icon-roundrightfill",
            "code": "&amp;#xe60a;"
          },
          {
            "name": "round_right",
            "class": "icon-roundright",
            "code": "&amp;#xe60b;"
          },
          {
            "name": "search",
            "class": "icon-search",
            "code": "&amp;#xe60c;"
          },
          {
            "name": "unfold",
            "class": "icon-unfold",
            "code": "&amp;#xe60d;"
          },
          {
            "name": "back",
            "class": "icon-back",
            "code": "&amp;#xe60e;"
          },
          {
            "name": "more",
            "class": "icon-more",
            "code": "&amp;#xe60f;"
          },
          {
            "name": "top",
            "class": "icon-top",
            "code": "&amp;#xe610;"
          },
          {
            "name": "pull_down",
            "class": "icon-pulldown",
            "code": "&amp;#xe611;"
          },
          {
            "name": "pull_up",
            "class": "icon-pullup",
            "code": "&amp;#xe612;"
          },
          {
            "name": "right",
            "class": "icon-right",
            "code": "&amp;#xe613;"
          },
          {
            "name": "refresh",
            "class": "icon-refresh",
            "code": "&amp;#xe614;"
          },
          {
            "name": "more_android",
            "class": "icon-moreandroid",
            "code": "&amp;#xe615;"
          },
          {
            "name": "delete_fill",
            "class": "icon-deletefill",
            "code": "&amp;#xe616;"
          },
          {
            "name": "delete",
            "class": "icon-delete",
            "code": "&amp;#xe617;"
          },
          {
            "name": "square_check_fill",
            "class": "icon-squarecheckfill",
            "code": "&amp;#xe618;"
          },
          {
            "name": "square",
            "class": "icon-square",
            "code": "&amp;#xe619;"
          },
          {
            "name": "square_check",
            "class": "icon-squarecheck",
            "code": "&amp;#xe61a;"
          },
          {
            "name": "round",
            "class": "icon-round",
            "code": "&amp;#xe61b;"
          },
          {
            "name": "round_add_fill",
            "class": "icon-roundaddfill",
            "code": "&amp;#xe61c;"
          },
          {
            "name": "round_add",
            "class": "icon-roundadd",
            "code": "&amp;#xe61d;"
          },
          {
            "name": "add",
            "class": "icon-add",
            "code": "&amp;#xe61e;"
          },
          {
            "name": "fold",
            "class": "icon-fold",
            "code": "&amp;#xe61f;"
          },
          {
            "name": "info_fill",
            "class": "icon-infofill",
            "code": "&amp;#xe620;"
          },
          {
            "name": "info",
            "class": "icon-info",
            "code": "&amp;#xe621;"
          },
          {
            "name": "sort",
            "class": "icon-sort",
            "code": "&amp;#xe622;"
          },
          {
            "name": "down",
            "class": "icon-down",
            "code": "&amp;#xe623;"
          },
          {
            "name": "check",
            "class": "icon-radio-checked",
            "code": "&amp;#xe62a;"
          },
          {
            "name": "hook",
            "class": "icon-hook",
            "code": "&amp;#xe629;"
          },
          {
            "name": "apps",
            "class": "icon-apps",
            "code": "&amp;#xe624;"
          },
          {
            "name": "refresh_arrow",
            "class": "icon-refresharrow",
            "code": "&amp;#xe625;"
          },
          {
            "name": "add",
            "class": "icon-add1",
            "code": "&amp;#xe626;"
          },
          {
            "name": "move",
            "class": "icon-move",
            "code": "&amp;#xe627;"
          },
          {
            "name": "loading",
            "class": "icon-iconloading-copy",
            "code": "&amp;#xe628;"
          },
          {
            "name": "check",
            "class": "icon-radio-uncheck",
            "code": "&amp;#xe62b;"
          }
        ]
    }
}

function q(el, cls){
    return el.querySelector(cls).innerHTML;
}
