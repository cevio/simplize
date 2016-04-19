export let search = {
    name: 'search',
    template: require('./search.html'),
    props: {
        text: {
            type: String,
            default: "",
            required: true,
            twoWay: true
        },
        placeholder: {
            type: String,
            default: ""
        }
    },
    data: function() {
        return {
            opened: false
        }
    },
    methods: {
        trigger: function(opened){
            this.opened = opened;
            if(this.opened){
                this.$emit('search:focus');
                this.$els.input.focus();
            }
            else {
                this.$els.input.blur();
            }
        },

        cancel: function(){
            this.$emit('search:cancel');
            this.text = "";
            this.trigger(false);
        },

        prevent: function(e){
            e.preventDefault();
            this.$emit('search:submit');
        }
    }
};
