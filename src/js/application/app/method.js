import * as utils from '../../utils/index';
import { initUrl } from '../init';

let timer = null;

export default function(callback){
    return {
        $run(){
            hashChange(this);
            typeof callback == 'function' && callback(this);
        },
        $get(browser){
            
        }
    }
}
function hashChange(that){
    utils.on(window, 'hashchange', function(e){
        e.preventDefault();
        if ( timer ) clearTimeout(timer);
        timer = setTimeout(function(){
            that.req = initUrl(window.location);
        }, 10);
    });
}
