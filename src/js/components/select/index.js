export let selector = {
    name: 'selector',
    template: '<label v-el:root @click="click">{{view}}</label>',
    props: {
        list: {
            type: Array,
            required: true
        },
        value: {
            required: false
        },
        title: {
            type: String
        },
        mode: {
            type: String,
            default: 'text'
        }
    },
    computed:{
        view(){
            let result;
            switch ( this.mode ) {
                case 'text':
                    result = this.text;
                    break;
                default:
                    result = this.value;

            }
            return result;
        }
    },
    data(){
        return {
            text: views(this.list, this.value)
        }
    },
    methods: {
        click(){
            this.$root.$select([{ title: this.title, value: this.value, data: this.list }]).then((obj) => {
                obj.$on('select:ok', (vals) => {
                    this.value = vals[0];
                    this.text = views(this.list, this.value);
                });
            })
        }
    }
}


function views(list, value){
    for ( let i = 0 ; i < list.length ; i++ ){
        if ( list[i].value == value ){
            return list[i].text;
        }
    }
}
