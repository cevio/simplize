import * as PROXY from './proxy';
export default function redirect (url, back) {
    this.$root.env.referrer = this.$root.req.path;
    this.$root.env.oldHistoryIndex = this.$root.env.newHistoryIndex;

    if ( back ){
        const storage = window.sessionStorage;
        let i = storage.length, _index = -1;

        while (i--){
            let key = storage.key(i);
            if ( key.indexOf('@@History') === 0 ){
                let state = JSON.parse(storage.getItem(storage.key(i)));
                let pathname = state.pathname;
                if ( url.split('?')[0] == pathname && state.index < this.$root.env.oldHistoryIndex && this.$root.env.oldHistoryIndex > 0 ){
                    _index = state.index;
                    break;
                }
            }
        }
        if ( _index == -1 ){
            this.$root.forceBack = true;
            PROXY.HISTORY.push(url);
        }else{
            PROXY.HISTORY.go(_index - this.$root.env.oldHistoryIndex);
        }

        return;
    }



    PROXY.HISTORY.push(url);
}
