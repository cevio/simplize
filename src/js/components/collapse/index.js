export let collapse = {
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
            this.$broadcast('collapse:toggle', name, shown);
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
    },
    methods: {
        switchShow(){
            if( this.group ){
                this.show.forEach((name) => {
                    this.$broadcast('collapse:switch', name, false);
                })
            }
        }
    }
};

export let collapseTrigger = {
    props: {
        shown: Boolean,
        name: {
            require: true,
            type: String
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
        }
    },
    events: {
        'collapse:switch': function(name, shown) {
            if(this.name === name) {
                this.shown = shown;
            }
        }
    }
};

export let collapseContent = {
    props: {
        shown: Boolean,
        name: {
            require: true,
            type: String
        }
    },
    events: {
        'collapse:toggle': function(name, shown) {
            if( name === this.name ){
                this.shown = shown;
            }
        },

        'collapse:switch': function(name, shown) {
            if( name === this.name ){
                this.shown = shown;
            }
        }
    }
};