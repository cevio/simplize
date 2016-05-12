import { createHashHistory } from 'history';
import * as PROXY from './proxy';

export default class History {
    constructor(){
        this.history = createHashHistory();
    }
    push(url){
        const config = format(url);
        config.state = { index: window.history.length, pathname: config.pathname };
        return this.history.push(config);
    }
    replace(url){
        const config = format(url);
        config.state = { index: window.history.length, pathname: config.pathname };
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
    if ( typeof url === 'object' ) return url;
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
        search: search
    }
}
