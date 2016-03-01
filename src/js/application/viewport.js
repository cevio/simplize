var resource = require('../resource');
var view, width, percent, baseWidth, offset = 100;
var strap = 0;


function getViewPortWidth(){
    width = document.documentElement.clientWidth || document.body.clientWidth;
}

function computedViewPortPercent(){
    percent = (width / baseWidth).toFixed(4);
}

function computedRetinaPercent(){
    if ( window.devicePixelRatio ){
        percent = (1 / window.devicePixelRatio).toFixed(4);
    }else{
        percent = 1;
    }
}

function resize(){
    var s = new Date().getTime();
    var keeper = [];

    if ( s - strap < offset ) return;
    strap = s;

    getViewPortWidth();
    if ( baseWidth === 'retina' ){
        computedRetinaPercent();
    }else{
        computedViewPortPercent();
    }

    resource.env.viewType = baseWidth;
    resource.env.viewScale = Number(percent);

    keeper.push('width=' + (width > baseWidth ? baseWidth : 'device-width'));
    //isAndroid && keeper.push('target-densitydpi=high-dpi');
    keeper.push('initial-scale=' + percent);
    keeper.push('maximum-scale=' + percent);
    keeper.push('minimum-scale=' + percent);
    keeper.push('user-scalable=no');

    view.setAttribute('content', keeper.join(', '));
}

module.exports = function(base){
    baseWidth = base;
    view = document.querySelector('meta[name=viewport]');
    if ( !view ){
        view = document.createElement('meta');
        document.querySelector('head').appendChild(view);
        view.setAttribute('name', 'viewport');
    }

    resize();
}
