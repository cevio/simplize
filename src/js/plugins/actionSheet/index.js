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
        $constructor(menus = [], needCancel = true){
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.menus = menus;
                this.needCancel = needCancel;
                this.status = true;
            });
        },

        close: function(){
            this.$emit('actionsheet:cancel');
            this.$parent.prevTick(() => {
                this.menus = [];
                this.status = false;
            });
        },

        select: function(index){
            this.$emit('actionsheet:select', this.menus[index]);
            this.$parent.prevTick(() => {
                this.menus = [];
                this.status = false;
            });
        }
    },
    events: {
        'modal:maskclick': function(){
            this.close();
        }
    }
};
