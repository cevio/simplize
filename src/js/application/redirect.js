var resource = require('../resource');
var keep = require('./session');

module.exports = function(newHref){
    var oldHref = resource.req.href;
    var oldIndex = keep.pool.indexOf(oldHref);
    var newIndex = keep.pool.indexOf(newHref);
    var sessionLength = keep.pool.length;

    if ( newIndex == -1 ){
        window.location.href = '#' + newHref;
    }else{
        if ( newIndex != oldIndex ){
            history.go(newIndex - oldIndex);
        }
    }
}
