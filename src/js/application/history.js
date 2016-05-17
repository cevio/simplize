import { createHashHistory } from 'history';
import * as PROXY from './proxy';

export default class History {
    constructor(){
        this.history = createHashHistory();
    }
    push(url, index){
        const config = format(url);
        config.state = { index: index || window.history.length, pathname: config.pathname, href: config.href };
        return this.history.push(config);
    }
    replace(url, index){
        const config = format(url);
        config.state = { index:  index || window.history.length, pathname: config.pathname, href: config.href };
        return this.history.replace(config);
    }
    go(n){
        return this.history.go(n);
    }
    goBack(){
        return this.history.goBack();
    }
    goForward(){
        return this.history.goForward();
    }
    listen(fn){
        return this.history.listen(fn);
    }
}

function format(url){
    if ( typeof url === 'object' ){
        url.href = url.pathname + url.search;
        return url;
    };
    const index = url.indexOf('?');
    let pathname, search;
    if ( index > -1 ){
        pathname = url.substring(0, index);
        search = url.substring(index);
    }else{
        pathname = url;
        search = '';
    }
    return {
        pathname: pathname,
        search: search,
        href: url
    }
}
