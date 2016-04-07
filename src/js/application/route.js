import Layer from './layer';
import flatten from 'array-flatten';

const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
const methods = ['active', 'use'];


export default class Route {
    constructor(){
        this.stack = [];
    }

    dispatch(url, done){
        var that = this;
        let idx = 0;
        let stack = this.stack;
        if (stack.length === 0) {
            return done.call(that);
        }

        next();

        function next(err) {
            let layerError = err === 'route'
                  ? null
                  : err;

            if ( err === 'route' ){
                return done.call(that);
            }

            let layer = stack[idx++];

            if (!layer) {
                return done.call(that, err);
            }
            var match = matchLayer(layer, url);

            if ( match == true ){
                that.root.req.params = layer.params;
                that.$layer = layer;
            }else{
                return next(err);
            }

            if (layerError) {
                layer.handle_error(err, that, next);
            } else {
                layer.handle_request(that, next);
            }
        }
    }

    route(path, method, opts, ...args){
        let handles = flatten(slice.call(args));
        for (let i = 0; i < handles.length; i++) {
            let handle = handles[i];

            if (typeof handle !== 'function') {
                let type = toString.call(handle);
                let msg = 'Route.' + method + '() requires callback functions but got a ' + type;
                throw new Error(msg);
            }

            let layer = new Layer(path, opts, handle);
            layer.method = method;
            this.stack.push(layer);
        }
        return this;
    }

    use(path, ...args){
        if ( typeof path === 'function' ){
            args = [path].concat(args);
            path = '/';
        }
        let _args = [path, undefined, { sensitive: false, strict: false, end: false }].concat(args);
        return this.route.apply(this, _args);
    }

    active(path, ...args){
        if ( typeof path === 'function' ){
            args = [path].concat(args);
            path = '/';
        }
        let _args = [path, 'active', { sensitive: false, strict: true, end: true }].concat(args);
        return this.route.apply(this, _args);
    }
}

/**
 * Match path to a layer.
 *
 * @param {Layer} layer
 * @param {string} path
 * @private
 */

function matchLayer(layer, path) {
  try {
    return layer.match(path);
  } catch (err) {
    return err;
  }
}
