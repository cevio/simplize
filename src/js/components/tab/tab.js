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
        }
    },
    data: function(){
        return {
            tabNumber: 0,
            index: -1,
            direction: 'forward',
            right: '100%'
        }
    },
    ready: function(){
        let children = this.$children;
        this.tabNumber = children.length;
    },
    events: {
        "tab:change": function(vm) {
            this.index = this.$children.indexOf(vm);
            console.log(this.index);
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
            this.direction = newIndex > oldIndex ? 'forward' : 'backward'
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
        if( this.selected ){
            this.$dispatch('tab:change', this);
        }
    },
    methods: {
        select: function(){
            this.$dispatch('tab:change', this);
        }
    }
};