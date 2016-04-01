export default class SessionMap {
    constructor(name){
        this.name = name;
        this.history = [];
        this.init();
    }

    init(){
        if ( !this.name ){
            this.name = 'simplize-history-' + new Date().getTime();
            this.clear();
        }else{
            this.history = window.sessionStorage.getItem(this.name);
            if ( !this.history ){
                this.clear();
            }else{
                try{
                    this.history = JSON.parse(this.history);
                }catch(e){
                    this.clear();
                }
            }
        }
    }

    set(){
        window.sessionStorage.setItem(this.name, JSON.stringify(this.history));
    }

    push(...args){
        this.history.push.apply(this.history, args);
        this.set();
    }

    unshift(...args){
        this.history.unshift.apply(this.history, args);
        this.set();
    }

    shift(...args){
        this.history.shift.apply(this.history, args);
        this.set();
    }

    splice(...args){
        this.history.splice.apply(this.history, args);
        this.set();
    }

    pop(...args){
        this.history.pop.apply(this.history, args);
        this.set();
    }

    reverse(...args){
        this.history.reverse.apply(this.history, args);
        this.set();
    }

    clear(){
        this.history = [];
        this.set();
    }

    add(obj){
        let url;
        if ( typeof obj === 'object' ){
            url = obj.path;
        }else{
            url = obj;
        }
        if ( this.history.indexOf(url) == -1 ){
            this.push(url);
        }
    }

    /**
     *  add     : push a new url on end
     *  rebuid  : delete part of source from end postion and add new url on end
     *  refresh : refresh url
     *  forward : forward history
     *  back    : back history
     */
    diff(source, target){
        if ( !source ){
            return { usage: 'add' }
        }

        let a = this.history.indexOf(source),
            b = this.history.indexOf(target);

        let that = this;

        if ( b == -1 ){
            if ( a + 1 < this.history.length ){
                return {
                    usage: 'rebuild',
                    fn: function(){
                        let his = that.history.slice(0, a + 1);
                        his.push(target);
                        that.history = his;
                        that.set();
                    }
                }
            }else{
                return { usage: 'add' }
            }
        }

        if ( a == b ){
            return { usage: 'refresh' }
        }

        if ( a < b ){
            return {
                usage: 'forward',
                steps: b - a
            }
        }

        if ( a > b ){
            return {
                usage: 'back',
                steps: b - a
            }
        }
    }
}
