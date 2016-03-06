// Times in milliseconds
var second = 1e3
  , minute = 6e4
  , hour = 36e5
  , day = 864e5
  , week = 6048e5
  , formats = {
    seconds: 's',
    minutes: 'm',
    hours: 'h',
    days: 'd'
  }
exports.formats = formats;
exports.computed = function (timestamp, stramp) {
    if (timestamp instanceof Date){
        timestamp = +timestamp;
    }

    if (typeof timestamp === 'string'){
        timestamp = +new Date(timestamp);
    }

    var diff = Math.abs(timestamp - stramp);
    var num = null;

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
            var d = new Date(timestamp);
            return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
        }
    }
}
