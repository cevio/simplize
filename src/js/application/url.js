export function format(query, change){
    if ( query && query.length ){
        var ret = {};
        query.split('&').forEach(function(delta){
            var index = delta.indexOf('=');
            var key, value;
            if ( index > -1 ){
                key = delta.substring(0, index);
                value = delta.substring(index + 1);
            }else{
                key = delta;
                value = '';
            }
            if ( change ){
                value = decodeURIComponent(value);
            }
            if ( ret[key] !== undefined ){
                if ( Array.isArray(ret[key]) ){
                    if ( ret[key].indexOf(value) === -1 ){
                        ret[key].push(value);
                    }
                }else{
                    if ( ret[key] !== value ){
                        ret[key] = [ret[key]];
                        ret[key].push(value);
                    }
                }
            }else{
                ret[key] = value;
            }
        });
        return ret;
    }else{
        return {};
    }
};

export function stringify(query, change){
    var str = [];
    for ( var ins in query ){
        if ( Array.isArray(query[ins]) ){
            for ( let i = 0 ; i < query[ins].length ; i++ ){
                str.push(ins + '=' + (change ? encodeURIComponent(query[ins][i]) : query[ins][i]));
            }
        }else{
            str.push(ins + '=' + (change ? encodeURIComponent(query[ins]) : query[ins]));
        }
    }
    return str.join('&');
};
