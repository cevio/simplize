import { util } from 'vue';

let utils = {};

utils.type = function(obj, type){
    let _type = Object.prototype.toString.call(obj).split(' ')[1].replace(/\]$/, '').toLowerCase();
    if ( type ){
        return _type == type;
    }else{
        return _type;
    }
}

export default Object.assign(utils, util);
