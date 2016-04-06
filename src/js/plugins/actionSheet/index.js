export let ACTIONSHEET = {
    name: 'sp-ui-actionsheet',
    template: require('./actionSheet.html'),
    data: function(){
        return {
            menus: [],
            needCancel: false
        }
    },
    methods: {
        entry(menus = [], needCancel = false){
            this.menus = menus;
            this.needCancel = needCancel;
        },

        close: function(){
            this.$emit('actionsheet:cancel');
            this.$parent.destroy();
        },
        
        select: function(index){
            this.$emit('actionsheet:select', this.menus[index]);
            this.$parent.destroy();
        }
    }
};