export let ACTIONSHEET = {
    name: 'sp-ui-actionsheet',
    template: require('./actionSheet.html'),
    data: function(){
        return {
            menus: [],
            needCancel: false,
            status: false
        }
    },
    methods: {
        entry(menus = [], needCancel = false){
            this.$parent.mask = true;
            this.menus = menus;
            this.needCancel = needCancel;
            this.status = true;
        },

        close: function(){
            this.$emit('actionsheet:cancel');
            this.$parent.destroy();
            this.status = false;
        },

        select: function(index){
            this.$emit('actionsheet:select', this.menus[index]);
            this.status = false;
            this.$parent.destroy();
        }
    },
    events: {
        'modal:maskclick': function(){
            this.close();
        }
    }
};
