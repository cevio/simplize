import * as PROXY from './proxy';
export default function redirect (url, back) {

    const storage = window.sessionStorage;
    let i = storage.length, _index = -1;

    while ( i-- ){
        let key = storage.key(i);
        if ( key.indexOf('@@History') === 0 ){
            let state = JSON.parse(storage.getItem(storage.key(i)));
            let href = state.href;

            if ( url == href ){
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

    const historyLength = history.length;
    setTimeout(() => {
        if ( _index == -1 ){
            PROXY.HISTORY.push(url, historyLength + 1);
        }else{
            PROXY.HISTORY.go(_index - this.$root.env.newHistoryIndex);
        }
    })
}
