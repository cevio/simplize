import FORMAT from 'date-format';
export let datetime = {
    name: 'datetime',
    template: '<label v-el:root @click="click">{{datetime}}</label>',
    props: {
        date: {
            type: Date,
            required: true
        },
        pattern: {
            type: String
        },
        use: {
            type: String
        }
    },
    computed: {
        datetime: function(){
            if ( !this.pattern ){
                this.pattern = 'yyyy-MM-dd hh:mm:ss';
            }
            return FORMAT.asString(this.pattern, this.date);
        }
    },
    methods: {
        click(){
            if ( !this.use ){ this.use = 'ymdhis'; }
            this.$root
            .$datetime(this.date, this.use)
            .then((obj) => {
                obj.$on('datetime:ready', (selector) => {
                    selector.$on('select:ok', (vals) => {
                        this.date = setValue(new Date(this.date), this.use, vals);
                    });
                });
            })
        }
    }
}

function setValue(date, pattern, value){
    for ( let i = 0 ; i < pattern.length ; i++ ){
        const char = pattern.charAt(i);
        const val = value[i];
        switch (char) {
            case 'y': date.setYear(val); break;
            case 'm': date.setMonth(val - 1); break;
            case 'd': date.setDate(val); break;
            case 'h': date.setHours(val); break;
            case 'i': date.setMinutes(val); break;
            case 's': date.setSeconds(val); break;
        }
    }
    return date;
}
