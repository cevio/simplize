var resource = require('../resource');
var device = require('./device');

// device.js from https://github.com/matthewhudson/device.js

module.exports = function(){
    for ( var i in device ){
        if ( i !== 'noConflict' ){
            resource.env[i] = device[i]();
        }
    }
}
