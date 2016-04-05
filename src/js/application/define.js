import * as PROXY from './proxy';
import { methods } from './mixins';
import { Promise } from 'es6-promise';
export default function define( methodName, component ) {
    if ( !component.name ){
        throw new Error('miss component name.');
    }
    PROXY.plugins[component.name] = component;
    methods[methodName] = (function(name){
        return function(...args){
            return new Promise((resolve, reject) => {
                const modal = this.$root.$refs.modal;
                modal.status = true;
                modal.current = name;
                this.$nextTick(() => {
                    if ( !modal.$refs.target ){
                        reject(new Error('cannot find this component on modal.'));
                    }else{
                        this.$nextTick(() => {
                            modal.$refs.target.entry.apply(modal.$refs.target, args);
                            resolve(modal.$refs.target);
                        });
                    }
                });
            });
        }
    })(component.name);
}