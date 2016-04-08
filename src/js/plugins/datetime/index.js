import * as utils from '../../utils/index';
export let DATETIME = {
    name: 'datetime',
    template: require('./datetime.html'),
    methods: {
        $constructor(time, type, over){
            let data = [];
            type = type.toLowerCase();
            if ( !utils.type(time, 'date') ){ time = new Date(time); }
            const timer = getDatetimes(time);
            const nows = getDatetimes(new Date());

            let pool = [];

            take('y', () => {
                let result = [];
                if ( !over ) over = nows.y;
                for ( let i = 1970 ; i <= over ; i++ ){
                    result.push({ text: i + '年', value: i });
                }
                result.reverse();
                data.push({ title: '年份', value: timer.y, data: result });
            });

            take('m', () => {
                let result = [];
                for ( let i = 1 ; i <= 12 ; i++ ){
                    result.push({ text: c(i) + '月', value: i });
                }
                data.push({ title: '月份', value: timer.m, data: result });
            });

            take('d', () => {
                data.push({ title: '日期', value: timer.d, data: day(timer.y, timer.m) });
            });

            take('h', () => {
                let result = [];
                for ( let i = 0 ; i < 24 ; i++ ){
                    result.push({ text: c(i) + '时', value: i });
                }
                data.push({ title: '小时', value: timer.h, data: result });
            });

            take('i', () => {
                let result = [];
                for ( let i = 0 ; i < 60 ; i++ ){
                    result.push({ text: c(i) + '分', value: i });
                }
                data.push({ title: '分钟', value: timer.i, data: result });
            });

            take('s', () => {
                let result = [];
                for ( let i = 0 ; i < 60 ; i++ ){
                    result.push({ text: c(i) + '秒', value: i });
                }
                data.push({ title: '秒', value: timer.s, data: result });
            });

            this.$select(data).then((obj) => {
                this.$mirror = obj;
                let childrens = [], result = {};
                for ( let i = 0 ; i < obj.$children.length; i++ ){
                    if ( obj.$children[i].$options.isPicker ){
                        childrens.push(obj.$children[i]);
                    }
                }
                for ( let j = 0 ; j < pool.length ; j++ ){
                    result[pool[j]] = childrens[j];
                }

                if ( result.y && result.m && result.d ){
                    result.y.$watch('value', function(year){
                        const days = day(year, result.m.value);
                        if ( days.length !== result.d.data.length ) result.d.data = days;
                        if ( result.d.value > days.length ){
                            result.d.value = 1;
                        }
                    });
                    result.m.$watch('value', function(month){
                        const days = day(result.y.value, month);
                        if ( days.length !== result.d.data.length ) result.d.data = days;
                        if ( result.d.value > days.length ){
                            result.d.value = 1;
                        }
                    });
                }
                this.$emit('datetime:ready', this.$mirror);
            });

            function take(which, fn){
                if ( type.indexOf(which) > -1 ){
                    pool.push(which);
                    fn();
                }
            }
        }
    }
}

function getDatetimes(obj){
    return {
        y: obj.getFullYear(),
        m: obj.getMonth() + 1,
        d: obj.getDate(),
        h: obj.getHours(),
        i: obj.getMinutes(),
        s: Math.round(obj.getTime() % 60000 / 1000)
    }
}

function c(val){
    if ( val < 10 ){
        return '0' + val;
    }else{
        return val + '';
    }
}

function getDaysInMonth(year,month){
    month = parseInt(month,10);
    var temp = new Date(year,month,0);
    return temp.getDate();
}

function day(y, m){
    const days = getDaysInMonth(y, m);
    let result = [];
    for ( let i = 0 ; i < days ; i++ ){
        result.push({
            text: c(i + 1) + '日',
            value: i + 1
        });
    }
    return result;
}
