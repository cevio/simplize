import * as PROXY from './proxy';
import { methods } from './mixins';
export default function define( methodName, component ) {
    if ( !component.name ){
        throw new Error('miss component name.');
    }
    PROXY.plugins[component.name] = component;
    methods[methodName] = (function(name){
        return function(...args){
            const modal = this.$root.$refs.modal;
            modal.current = name;
            this.$nextTick(() => {
                modal.$refs.target.entry.apply(modal.$refs.target, args);
            });
        }
    })(component.name);
}
