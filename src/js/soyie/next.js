module.exports = NextMiddleWare ;
function NextMiddleWare(done, context){
    this._stacks = [];
    this._done = done;
    this.context = context;
}

NextMiddleWare.prototype.use = function(fn){
    this._stacks.push(fn);
    return this;
}

NextMiddleWare.prototype.run = function(){
    if ( !this._stacks.length ) return this._done && this._done.call(this.context);
    var that = this;
    var i = 0;
    _next(true);
    function _next(first){
        (first === false || first === undefined || first === null) && i++;
        if ( !that._stacks[i] || first === 'router' ){ that._done && that._done.call(that.context); }
        else{ that._stacks[i].call(that.context, _next); }
    }
}
