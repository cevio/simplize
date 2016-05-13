import * as PROXY from './proxy';
export default function redirect (url, back) {

    const storage = window.sessionStorage;
    let i = storage.length, _index = -1;

    while ( i-- ){
        let key = storage.key(i);
        if ( key.indexOf('@@History') === 0 ){
            let state = JSON.parse(storage.getItem(storage.key(i)));
            let pathname = state.pathname;

            if ( url.split('?')[0] == pathname ){
                _index = state.index;
                break;
            }

        }
    }
    
    if ( back ){
        this.$root.forceBack = true;
    }else{
        this.$root.forceForward = true;
    }

    if ( _index == -1 ){
        PROXY.HISTORY.push(url, window.history.length + 1);
    }else{
        PROXY.HISTORY.go(_index - this.$root.env.newHistoryIndex);
    }

}
