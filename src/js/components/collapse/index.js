import {
    nextTick
} from '../../utils/index';

const common_name = 'sp-common-name';

export let collapses = {
    template: require('./collapses.html'),
    data: function(){
        return {
            show: []
        }
    },
    props: {
        group: Boolean
    },
    events: {
        'collapse:shown': function(name, shown) {
            this.handler(name, shown);
        },
        'collapse:shownn': function(name, shown) {
            this.handler(name, shown);
        }
    },
    methods: {
        switchShow(){
            if( this.group ){
                this.show.forEach((name) => {
                    this.$broadcast('collapse:switch', name, false);
                });
                this.show = [];
            }
        },
        
        handler(name, shown) {
            this.$broadcast('collapse:switch', name, shown);
            this.switchShow();

            if(shown){
                this.show.push(name);
            }
            else {
                let index = this.show.indexOf(name);
                if( index !== -1 ){
                    this.show.splice(index, 1);
                }

            }
        }
    }
};

export let collapse = {
    template: require('./collapse.html'),
    data: function() {
        return {
            name: guid()
        }
    },

    events: {
        'collapse:shown': function(name, shown) {
            if( name === common_name ){
                this.$dispatch('collapse:shownn', this.name, shown);
            }
            else {
                return true;
            }
        },

        'collapse:switch': function(name, shown){
            if( name === this.name ){
                this.$broadcast('collapse:switchh', common_name, shown);
            }
            else {
                return true;
            }
        }
    }
};

export let collapseTrigger = {
    template: require('./collapseTrigger.html'),
    props: {
        shown: Boolean,
        name: {
            type: String,
            default: common_name
        }
    },
    ready: function() {
        this.emit();
    },
    methods: {
        toggle: function(){
            this.shown = !this.shown;
            this.emit();
        },
        emit: function() {
            this.$dispatch('collapse:shown', this.name, this.shown);
        },
        handler: function(name, shown) {
            if(this.name === name && this.shown !== shown) {
                this.shown = shown;
            }
        }
    },
    events: {
        'collapse:switch': function(name, shown) {
            this.handler(name, shown)
        },
        'collapse:switchh': function(name, shown) {
            this.handler(name, shown)
        }
    }
};

export let collapseContent = {
    template: require('./collapseContent.html'),
    props: {
        shown: Boolean,
        height: 0,
        name: {
            type: String,
            default: common_name
        }
    },
    events: {
        'collapse:switch': function(name, shown) {
            this.handler(name, shown);
        },
        'collapse:switchh': function(name, shown) {
            this.handler(name, shown);
        }
    },
    methods: {
        handler: function(name, shown) {
            if( name === this.name && this.shown !== shown ){
                if(shown){
                    this.$el.style.height = 'auto';
                    this.height = this.$el.offsetHeight;
                    this.$el.style.height = '0px';
                    this.$el.offsetHeight;
                    this.shown = shown;
                    nextTick(() => {
                        this.$el.style.height = this.height + 'px';
                    })
                }
                else {
                    this.$el.style.height = this.height + 'px';
                    this.$el.offsetHeight;
                    this.shown = shown;
                    nextTick(() => {
                        this.$el.style.height = '0px';
                    })
                }
                
            }
        }
    }
};

function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}