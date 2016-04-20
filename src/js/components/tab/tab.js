export let tabs = {
    name: "tabs",
    template: require('./tabs.html'),
    props: {
        lineWidth: {
            type: Number,
            default: 3
        },
        activeColor: {
            type: String,
            default: '#04be02'
        },
        animate: Boolean
    },
    data: function(){
        return {
            tabNumber: 0,
            index: -1,
            direction: 'forward',
            right: '100%'
        }
    },
    events: {
        "tab:change": function(vm) {
            if ( !vm ) return;

            let result = [];
            for ( let i = 0 ; i < this.$children.length ; i++ ){
                if ( this.$children[i]._isTab ){
                    result.push(this.$children[i]);
                }
            }

            if ( result.length ){
                const index = result.indexOf(vm);
                if ( index > -1 ){
                    this.$emit('tab:select', vm, index);
                    this.index = index;
                }
            }
        },
        "tab:init": function(vm){
            this.selectVm = vm;
        },
        "webview:load": function(){
            let children = this.$children;
            this.tabNumber = children.length;
            this.$emit('tab:change', this.selectVm);
        },
        "webview:unload": function(){
            delete this.selectVm;
        }
    },
    computed: {
        barLeft: function () {
            return `${this.index * (100 / this.tabNumber)}%`
        },
        barRight: function () {
            return `${(this.tabNumber - this.index - 1) * (100 / this.tabNumber)}%`
        }
    },
    watch: {
        index: function (newIndex, oldIndex) {
            if(!this.animate){
                this.direction = 'null';
            }
            else {
                this.direction = newIndex > oldIndex ? 'forward' : 'backward'
            }
        }
    }
};

export let tab = {
    name: "tab",
    template: require('./tab.html'),
    props: {
        selected: Boolean
    },
    ready: function(){
        this._isTab = true;
        this.selected && this.$parent.$emit('tab:init', this);
    },
    methods: {
        select: function(){
            this.$parent.$emit('tab:change', this);
        }
    }
};
