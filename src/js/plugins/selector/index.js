export let SELECTOR = {
    name: 'selector',
    template: require('./select.html'),
    methods: {
        $constructor(data, fn){
            this.$parent.nextTick(() => {
                this.$parent.mask = true;
                this.status = true;
                this.data = data;
            })
        },
        close(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('select:close');
            });
        },
        ok(){
            let result = [];
            this.data.forEach(function(dat){
                result.push(dat.value);
            });
            this.$emit('select:ok', result);
            this.close();
        }
    },
    data(){
        return {
            data: [],
            status: false
        }
    },
    computed: {
        cell(){
            return (100 / this.data.length).toFixed(4) + '%';
        }
    },
    transitions: {
        slideUp: {
            afterEnter(){
                const self = this;
                this.$children.forEach((child, index)=>{
                    if ( child.$options.isPicker ){
                        child.create();
                    }
                })
            }
        }
    },
    events: {
        "modal:maskclick": function(){
            this.close();
        }
    }
}
