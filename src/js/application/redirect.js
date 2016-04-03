import * as PROXY from './proxy';
export default function redirect (app) {
    return function(url){
        let index = url.indexOf('?');
        let path = index == -1
            ? url
            : url.substring(0, index);

        let result = PROXY.HISTORY.diff(app.req.path, path);

        switch ( result.usage ) {
            case 'rebuild':
            case 'refresh':
            case 'add': window.location.href = '#' + url; break;
            case 'back':
            case 'forward': history.go(result.steps); break;
        }
    }
}
