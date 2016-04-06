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
        },
        
        select: function(index){
            this.$emit('actionsheet:select', this.menus[index]);
        }
    }
};