var utils = require('../utils');
var animationend = require('animationend');
exports.component = {
    name: 'headbar',
    template:
        // 外层 outterStatus
        '<div class="web-headbar" v-show="state" transition="headbar" :class="direction" v-el:headbar>' +

            // 原生层 nativeInnerStatus
            '<div class="web-head web-head-native" :class="class" :style="style">' +

                // 原生层 左边 nativeChildStatus
                '<div class="web-headbar-left" @click="left.fn">' +
                    '<div class="icon-content" v-html="left.icon"></div>' +
                    '<div class="text-content" v-html="left.text"></div>' +
                '</div>' +

                // 原生层 中间 nativeChildStatus
                '<div class="web-headbar-center" @click="center.fn">' +
                    '<div class="web-headbar-center-text" v-html="center.text" v-el:headmark></div>' +
                '</div>' +

                // 原生层 右边 nativeChildStatus
                '<div class="web-headbar-right" @click="right.fn">' +
                    '<div class="text-content" v-html="right.text"></div>' +
                    '<div class="icon-content" v-html="right.icon"></div>' +
                '</div>' +
            '</div>' +

            // 副本层 copyInnerStatus
            '<div class="web-head web-head-temp" :class="temp.class" :style="temp.style" v-el="headbar-copyer">' +

                // 副本层 左边 copyChildStatus
                '<div class="web-headbar-left">' +
                    '<div class="icon-content" v-html="temp.left.icon"></div>' +
                    '<div class="text-content" v-html="temp.left.text">></div>' +
                '</div>' +

                // 副本层 中间 copyChildStatus
                '<div class="web-headbar-center">' +
                    '<div class="web-headbar-center-text" v-html="temp.center.text"></div>' +
                '</div>' +

                // 副本层 右边 copyChildStatus
                '<div class="web-headbar-right">' +
                    '<div class="text-content" v-html="temp.right.text">></div>' +
                    '<div class="icon-content" v-html="temp.right.icon"></div>' +
                '</div>' +

            '</div>' +

        '</div>',
    data: function(){
        return {
            // native vars.
            left: { icon: '', text: '', fn: utils.noop },
            right: { icon: '', text: '', fn: utils.noop },
            center: { text: '', fn: utils.noop },
            class: '',
            style: '',

            // 副本层数据
            temp: {
                left: { icon: '', text: '' },
                center: { text: '' },
                right: { icon: '', text: '' },
                class: '',
                style: ''
            },

            // headbar 高度
            height: 0,

            // 伪状态特征码
            status: true,

            state: true,

            direction: 'change', // change | move | left | right | slient
            // 顶层动画样式
            display: 'block',
            fixHeight: 0
        }
    },
    methods: {
        listen: function(el){
            var that = this;
            animationend(el).then(function(){ that.$emit('after'); });
        },
        $reset: function(){
            this.left.icon =
            this.left.text =
            this.right.icon =
            this.right.text =
            this.center.text =
            this.class =
            this.style = '';
            this.left.fn =
            this.right.fn =
            this.center.fn = utils.noop;
        },
        view: function(){
            if ( this.display === 'move' ){
                this.listen(this.$els.headbar);
                this.direction = 'move';
                this.$emit('run');
                return false;
            }
            return true;
        },
        move: function(direction){
            this.listen(this.$els.headmark);
            this.direction = direction;
            this.$emit('run');
        }
    },
    events: {
        left: function(){
            this.view() && this.move('left');
        },
        right: function(){
            this.view() && this.move('right');
        },
        before: function(){
            this.temp.left.icon = this.left.icon;
            this.temp.left.text = this.left.text;
            this.temp.right.icon = this.right.icon;
            this.temp.right.text = this.right.text;
            this.temp.center.text = this.center.text;
            this.temp.class = this.class;
            this.temp.style = this.style;
        },
        after: function(){
            this.display = 'block';
            this.direction = 'slient';
        },
        run: function(){
            this.state = this.status;
        }
    },
    ready: function(){
        this.$parent.$headbar = this;
        this.height = this.fixHeight = this.$els.headbar.clientHeight;
    },
    watch: {
        "status": function(value){
            this.display = 'move';
            if ( value ){
                this.height = this.fixHeight;
            }else{
                this.height = 0;
            }
        }
    }
}
