export let headbar = {
    name: 'headbar',
    template: require('../../html/headbar.html'),
    data: function(){
        return {
            height: 0,
            status: false,
            direction: '',
            type: 0,
            data: {
                class: '', style: '',
                left: { icon: '', text: '', click: noop },
                center: { text: '', click: noop },
                right: { icon: '', text: '', click: noop }
            },
            temp: {
                class: '', style: '', status: false,
                left: { icon: '', text: '' },
                center: { text: '' },
                right: { icon: '', text: '' }
            }
        }
    },
    computed: {
        transition: function(){
            return this.$parent.SP_firstEnter ? 'none' : 'sp-headbar';
        }
    },
    methods: {
        copy(){
            this.temp.class = this.data.class;
            this.temp.style = this.data.style;
            this.temp.left.icon = this.data.left.icon;
            this.temp.left.text = this.data.left.text;
            this.temp.center.text = this.data.center.text;
            this.temp.right.icon = this.data.right.icon;
            this.temp.right.text = this.data.right.text;
        },
        clear(){
            this.status = false;
            this.type = 0;
            this.data.class =
            this.data.style =
            this.data.left.icon =
            this.data.left.text =
            this.data.center.text =
            this.data.right.icon =
            this.data.right.text = '';
            this.data.left.click =
            this.data.right.click =
            this.data.center.click = noop;
        },
        active(){
            this.status = true;
        },
        remove(){
            this.status = false;
        }
    },
    events: {
        "headbar:before": function(){
            this.copy();
            this.clear();
        },
        "headbar:direct": function(){
            if ( this.type === 1 ) return;
            this.$emit('headbar:' + this.$root.env.direction);
        },
        "headbar:turn:left": function(){
            this.temp.status = true;
            this.$nextTick(() => {
                this.direction = 'left';
            })
        },
        "headbar:turn:right": function(){
            this.temp.status = true;
            this.$nextTick(() => {
                this.direction = 'right';
            })
        },
        "webview:load": function(){
            this.direction = '';
            this.temp.status = false;
        }
    },
    watch: {
        "status": function(state){
            this.type = 1;
            if ( state ){
                this.height = this.$els.root.offsetHeight;
            }else{
                this.height = 0;
            }
        }
    }
}


function noop(){}
