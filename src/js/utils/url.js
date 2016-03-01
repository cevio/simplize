var querystrings = require('querystrings');

/**
 * url: {string} '/a/b/c?a=1&b=2&c=3'
 * path: {string} '/a/b/c'
 * search: {string} '?a=1&b=2&c=3'
 * query: {json} { a:1, b: 2, c:3 }
 */
exports.$rebuildURI = function(url){
    var sch = url.indexOf('?');
    var path, search = '', query = {};

    if ( sch > -1 ){
        path = url.substring(0, sch);
        search = url.substring(sch);
        if ( search != '?' ){ query = querystrings.format(search.substr(1)); }
        else{ search = ''; }
    }
    else{ path = url; }

    return {
        path: path,
        search: search,
        query: query,
        href: url,
        params: {}
    }
}
