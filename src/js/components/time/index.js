import FORMAT from 'date-format';

const second = 1e3
    , minute = 6e4
    , hour = 36e5
    , day = 864e5
    , week = 6048e5;

export let now = {
    name: 'now',
    template: '{{time}}',
    props: {
        pattern: {
            type: String
        }
    },
    computed: {
        time(){
            return FORMAT.asString(this.pattern || 'yyyy-MM-dd hh:mm:ss.SSS', this.$root.env.now);
        }
    }
}

export let ago = {
    name: 'ago',
    template: '{{time}}',
    props: {
        date: {
            type: Date,
            required: true
        }
    },
    computed: {
        time(){
            return computed(this.date, this.$root.env.now, this.$root.env.timeFormats);
        }
    }
}

function computed(timestamp, stramp, formats) {
    if (timestamp instanceof Date){
        timestamp = +timestamp;
    }

    if (typeof timestamp === 'string'){
        timestamp = +new Date(timestamp);
    }

    const diff = Math.abs(timestamp - stramp);

    if ( diff <= second ){
        return '1' + formats.seconds;
    }
    else if ( diff < minute ){
        return Math.floor(diff / 1000) + formats.seconds;
    }
    else if ( diff < hour ){
        return Math.floor(diff / 1000 / 60) + formats.minutes;
    }
    else if ( diff < day ){
        return Math.floor(diff / 1000 / 3600) + formats.hours;
    }
    else{
        if ( diff < week ) {
            return Math.floor(diff / 1000 / 86400) + formats.days;
        }
        else{
            return FORMAT.asString(formats.type, new Date(timestamp));
        }
    }
}
