import { format, stringify } from './url';
import unique from 'unique-array';

export function initUrl(local){
    let search = local.search.replace(/^\?/, '');
    let hash = local.hash.replace(/^\#/, '');
    let querys = {};
    let path = '/';

    if ( search ){
        querys = format(search);
    }

    if ( hash ){
        let index = hash.indexOf('?');
        if ( index > -1 ){
            path = hash.substring(0, index);
            let _search = hash.substring(index).replace(/^\?/, '');
            if ( _search ){
                let _querys = format(_search);
                querys = deepExtend(querys, _querys);
            }
        }else{
            path = hash;
        }
    }

    search = stringify(querys);
    search = search ? '?' + search : search;

    let href = path + search;

    return {
        path: path,
        search: search,
        query: querys,
        href: href,
        params: {},
        origin: local.origin + local.pathname + '#' + href
    }
}

function deepExtend(a, b){
    let d = Object.keys(b).sort();

    var i = d.length;
    while ( i-- ){
        let name = d[i];
        let value = b[name];
        let target = a[name];
        if ( target ){
            if ( Array.isArray(target) ){
                if ( Array.isArray(value) ){
                    a[name] = unique(target.concat(value));
                }else{
                    if ( target.indexOf(value) == -1 ){
                        target.push(value);
                    }
                }
            }else{
                if ( target != value ){
                    a[name] = [target, value];
                }
            }
        }else{
            a[name] = value;
        }
    }
    return a;
}
