var utils = require('../utils');
var animationend = require('animationend');

var template =
    '<div class="web-headbar" v-show="state" transition="headbar" :class="direction" v-el:headbar>' +
        '<div class="web-head web-head-native" :class="class" :style="style">' +
            '<div class="web-headbar-left" @click="left.fn">' +
                '<div class="icon-content" v-html="left.icon"></div>' +
                '<div class="text-content" v-html="left.text"></div>' +
            '</div>' +
            '<div class="web-headbar-center" @click="center.fn">' +
                '<div class="web-headbar-center-text" v-html="center.text" v-el:headmark></div>' +
            '</div>' +
            '<div class="web-headbar-right" @click="right.fn">' +
                '<div class="text-content" v-html="right.text"></div>' +
                '<div class="icon-content" v-html="right.icon"></div>' +
            '</div>' +
        '</div>' +
        '<div class="web-head web-head-temp" :class="temp.class" :style="temp.style" v-el="headbar-copyer">' +
            '<div class="web-headbar-left">' +
                '<div class="icon-content" v-html="temp.left.icon"></div>' +
                '<div class="text-content" v-html="temp.left.text">></div>' +
            '</div>' +
            '<div class="web-headbar-center">' +
                '<div class="web-headbar-center-text" v-html="temp.center.text"></div>' +
            '</div>' +
            '<div class="web-headbar-right">' +
                '<div class="text-content" v-html="temp.right.text">></div>' +
                '<div class="icon-content" v-html="temp.right.icon"></div>' +
            '</div>' +
        '</div>' +
    '</div>';

var database = {
    left: { icon: '', text: '', fn: utils.noop },
    right: { icon: '', text: '', fn: utils.noop },
    center: { text: '', fn: utils.noop },
    class: '',
    style: '',
    temp: {
        left: { icon: '', text: '' },
        center: { text: '' },
        right: { icon: '', text: '' },
        class: '',
        style: ''
    },
    direction: 'change'
}

exports.component = function(){
    return {
        name: 'headbar',
        template: template,
        data: function(){
            return utils.$copy(database);
        },
        methods: {
            /**
             *  监听动画
             *  设置为方法，便于调用
             */
            listen: function(el){
                var that = this;
                animationend(el).then(function(){ that.$emit('after'); });
            },

            /**
             *  状态改变时候，检测动画是否是隐藏或者显示导航
             *  move 表示导航显隐动画
             */
            view: function(){
                if ( this.display === 'move' ){
                    this.listen(this.$els.headbar);
                    this.direction = 'move';
                    this.$emit('run');
                    return false;
                }
                return true;
            },

            /**
             *  导航方向动画， 传入一个方向值。
             *  非webview方向动画
             */
            move: function(direction){
                this.listen(this.$els.headmark);
                this.direction = direction;
                this.$emit('run');
            }
        },
        events: {
            /**
             *  导航向左移动动画，由全局动画通知而来。
             *  全局通知现在webview是右边进入动画
             */
            left: function(){ this.view() && this.move('left'); },

            /**
             *  导航向右移动动画，由全局动画通知而来。
             *  全局通知现在webview是左边进入动画
             */
            right: function(){ this.view() && this.move('right'); },

            /**
             *  当导航切换前
             *  执行的事件
             */
            before: function(){
                this.temp.left.icon = this.left.icon;
                this.temp.left.text = this.left.text;
                this.temp.right.icon = this.right.icon;
                this.temp.right.text = this.right.text;
                this.temp.center.text = this.center.text;
                this.temp.class = this.class;
                this.temp.style = this.style;
            },

            /**
             *  导航动画结束时候
             *  我们需要回调和消除动画class
             *  恢复到初始化状态
             */
            after: function(){
                this.display = 'block';
                this.direction = 'slient';
            },

            /**
             *   导航重置事件
             */
            reset: function(){
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
            }
        }
    }
}
