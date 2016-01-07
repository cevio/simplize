var _ = require('../utils');
var view, width, percent, baseWidth, offset = 100;
var isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > 0;
var strap = 0;


function getViewPortWidth(){
    width = document.documentElement.clientWidth || document.body.clientWidth;
}

function computedViewPortPercent(){
    percent = (width / baseWidth).toFixed(4);
    // if ( isAndroid && width > baseWidth ){
    //     percent = 1;
    // }
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

    keeper.push('width=' + (width > baseWidth ? baseWidth : 'device-width'));
    //isAndroid && keeper.push('target-densitydpi=high-dpi');
    keeper.push('initial-scale=' + percent);
    keeper.push('maximum-scale=' + percent);
    keeper.push('minimum-scale=' + percent);
    keeper.push('user-scalable=no');

    view.setAttribute('content', keeper.join(', '));
    if ( _.htmlClassList.indexOf('viewport-' + baseWidth) == -1 ){
        _.htmlClassList.push('viewport-' + baseWidth);
    }
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
