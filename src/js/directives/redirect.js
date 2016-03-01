var utils = require('../utils');
var next = require('../next');
var redirect = require('../application/redirect');

exports.priority = 3000;
exports.deep = true;
exports._url = null;

exports.bind = function(){
    var that = this;
    if ( !this.el.$redirectNext ){
        this.el.$redirectNext = new next(function(){
            this._url && redirect(this._url);
        }, this);
        this.el.$redirectNext.om = this;
    }
    this._cb = function(){ that.el.$redirectNext.run(); };
    utils.on(this.el, 'click', this._cb);
}

exports.update = function(newValue){
    this._url = newValue;
}

exports.unbind = function(){
    utils.off(this.el, 'click', this._cb);
}
