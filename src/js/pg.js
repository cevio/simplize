
//PG回调
function PGCallback(callbackId, args) {

    if (callbackId == 'onBackKeyPress') {
        if(typeof backPage == 'function') backPage();
    }
    else
        PG.callback(callbackId, args);
}

var PG = {
    jv: '1.0',
    bridge: null,
    callbackId: 0,
    callbacks: [],
    commandQueue: [],
    platid: (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) ? '2' : '1',

    platform: (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) ? 'android' : 'ios',

    commandQueueFlushing: false,
    getAndClearQueuedCommands: function () {
        var json = JSON.stringify(this.commandQueue);
        this.commandQueue = [];
        return json;
    },

    exec: function (method, callback, args) {
        //if (!PG.Device.App) return;
        if (callback === undefined)
            callback = null;
        if (args === undefined || args == null || typeof (args) != 'object')
            args = {};
        var callbackId = '';

        if (callback && typeof (callback) == 'function') {

            callbackId = method + PG.callbackId++;

            PG.callbacks[callbackId] = callback;

        }

        var obj = {

            Method: method,

            CallbackId: callbackId,

            Args: args

        }
        if (this.platform == 'ios') {
            if (this.bridge == null) {
                this.bridge = document.createElement("iframe");
                this.bridge.setAttribute("style", "display:none;");
                this.bridge.setAttribute("height", "0px");
                this.bridge.setAttribute("width", "0px");
                this.bridge.setAttribute("frameborder", "0");
                document.documentElement.appendChild(this.bridge);
            }

            this.commandQueue.push(JSON.stringify(obj));
            if (!this.commandQueueFlushing) {
                this.bridge.src = 'pg://ready';
            }
        }
        else
        if (this.platform == 'wp8')
            window.external.notify('pg://' + encodeURIComponent(JSON.stringify(obj)));
        else
        if (window.comjs) {
            window.comjs.notify('pg://' + encodeURIComponent(JSON.stringify(obj)));
        }

    },

    callback: function (callbackId, args) {

        if (PG.callbacks[callbackId]) {

            try {

                if (PG.callbacks[callbackId]) {

                    var temp = decodeURIComponent(args);

                    var obj = JSON.parse(temp);

                    PG.callbacks[callbackId](obj);

                }

            }

            catch (e) {

                console.log("Error in success callback: " + callbackId + " = " + e);

            }



            delete PG.callbacks[callbackId];

        }

    },

    onBackKeyPress: function ()//点击回退按钮时的事件 返回true不退出，返回false退出
    {

        return false;
    },
    onShakePhone: function ()//摇一摇手机促发该事件
    {

    },

    onEnterForeground: function ()//程序重新获取焦点
    {

    },
    onEnterBackground: function ()//程序失去获取焦点
    {

    },

    onWebviewPresent: function ()//webView显示时触发
    {

    },
    onWebviewDismiss: function ()//webView消失时触发
    {

    }
}

if (navigator.userAgent.indexOf('Windows Phone 8.') > 0) PG.platform = 'wp8';

//隐藏加载菊花图
PG.hideDefaultImage = function () {
    this.exec("hideDefaultImage", null, null);
}
//显示加载菊花图
PG.showDefaultImage = function () {
    this.exec("showDefaultImage", null, null);
}

//获取设备基本信息
PG.Device = (function () {
    var ua = navigator.userAgent;
    var url = document.location.href;

    var isChrome = ua.indexOf('Chrome') > -1,   //部分国产浏览器的极速模式也会判断为Chrome，暂不管
        isSafari = ua.indexOf('Safari') > -1 && !isChrome,
        isUC = ua.indexOf('UCBrowser') > -1,
        isAndroid = ua.indexOf('Android') > -1,
        isiPhone = ua.indexOf('iPhone') > -1,
        isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        isWinPhone = ua.indexOf('Windows Phone') > -1,
        isWP8 = ua.indexOf('Windows Phone 8.') > -1,
        isMoible = isAndroid || isIOS || isWinPhone,
        isAppUrl = (url.indexOf('appid=') > 0 || url.indexOf('app=') > 0) && url.indexOf('v=') > 0,
        isApp = isMoible && isAppUrl;

    var os = '';
    var plat = '';
    if (isMoible) {
        if (isIOS)
            os = 'ios';
        if (isAndroid)
            os = 'android';
        if (isWinPhone)
            os = 'wp';
        if (isWP8)
            os = 'wp8';
    }
    if (os.length > 0) {
        plat = os;
        if (os == 'ios') {
            if (ua.indexOf('iPad') > 0)
                plat = 'iPad';
            else
            if (ua.indexOf('iPhone') > 0)
                plat = 'iPhone';
        }
    }

    return {
        OS: os,
        Plat: plat,
        Android: isAndroid,
        iPhone: isiPhone,
        WinPhone: isWinPhone,
        Mobile: isMoible,
        App: isApp,
        AndroidApp: isAndroid && isAppUrl,
        IOSApp: isIOS && isAppUrl,
        WinPhoneApp: isWinPhone && isAppUrl,
        WP8: isWinPhone && isAppUrl && ua.indexOf('Windows Phone 8.') > 0,
        webKit: ua.indexOf('AppleWebKit') > -1
    };
})();
/*获取设备高级信息
 返回示例：
 DeviceInfo:{
 "uuid":"3660E953-1469-4B6D-9A65-58A12D2FF2AC","macid":"68:96:7B:89:77:55",
 "system_version":"6.1.4","device_token":"","system_name":"iPhone OS","screen_width":320,
 "carrier":{"allow_voip":1,"carrier_name":"中国电信","mnc":"03","mcc":"460","icc":"cn"},
 "screen_height":568,"model":"iPhone"
 }
 */
PG.getDeviceInfo = function (callback) {
    this.exec("getDeviceInfo", callback, null);
}

//打开app内部浏览器
PG.openWebView = function ( title, url , backtxt) {
    if(!url) alert('url不能为空');
    var args = {
        url: url,
        title: title || '',
        backtxt: backtxt || ''
    };
    this.exec("openWebView", null, args);
};
PG.openUrl = function (url) {

    var args = {

        url: url

    };

    this.exec("openUrl", null, args);

};
PG.goUrl = function (url) {

    var args = {

        url: url

    };

    this.exec("goUrl", null, args);

}

PG.openApp = function (url) {
    var args = {
        url: url
    };
    this.exec("openApp", null, args);
}
PG.openSelf = function () {
    var args = {
        url: url
    };
    this.exec("openSelf", null, args);
}

//销毁本页面的窗口载体
PG.exitApp = function () {
    console.log('exitApp');
    this.exec("exitApp", null, null);
}
//可能是退出整个应用
PG.exitSelf = function () {
    this.exec("exitSelf", null, null);
}

/* 调起外部分享
 shareTo  :  friendCircle/weixin/weibo
 userObj  :
 微信/朋友圈=>{title:'标题',desc:'描述',pic:'图片地址',link:'活动链接'}
 微博=> {text:'微博内容',pic:'图片地址'}
 */
PG.share = function (shareTo ,userObj){
    var userObj = userObj || {};
    // 用于微信
    var weixinTitle = userObj["title"] || "",
        weixinDescription = userObj["desc"] || "",
        weixin_pic = userObj["pic"] || "",
        weixin_link = userObj["link"] || "";

    // 用于微博
    var weiboText = userObj["text"] || "",
        weibo_pic = userObj["pic"] || "";

    var shareData = {
        "friendCircle":{
            type: 2,
            scene: 1,
            title: weixinTitle,
            description: weixinDescription,
            thumb_path: weixin_pic,
            thumb_path_is_url: 1,
            web_page_url: weixin_link
        },
        "weixin":{
            type: 2,
            scene: 0,
            title: weixinTitle,
            description: weixinDescription,
            thumb_path: weixin_pic,
            thumb_path_is_url: 1,
            web_page_url: weixin_link
        },
        "weibo":{
            type: 1,
            text: weiboText ,
            image_path: weibo_pic,
            image_path_is_url: 1
        }
    };

    var shareAct = {
        "friendCircle":"tcWechatShared",
        "weixin":"tcWechatShared",
        "weibo":"tcWeiboShared"
    };

    if(typeof(shareAct[shareTo]) === "undefined"){
        var e = new Error();
        e.message = "sharePageAction函数第一个参数有误，不在可选范围内";
        throw e;
    }

    PG.exec(shareAct[shareTo],shareAct[shareTo],shareData[shareTo]);
}
/* 掉起照相机
 fn : function(res){
 图片src => "data:image/" + res.Image.type + ";base64," + res.Image.base64
 }
 args : {width:200,height:200,quality:0-100}
 */
PG.getPhoto = function (fn, args) {
    if (args === undefined) args = null;
    this.exec("getPhoto", fn, args);
}
/* 获取经纬度
 返回 data.Location 如 {"lat":123.12312313,"lon":23.923939}
 */
PG.getLocation = function (fn) {
    if (PG.Device.App) {
        this.exec("getLocation", fn, null);
    } else {
        var data = {
            code: 0,
            msg: '',
            Location: {
                lat: 0,
                lon: 0
            }
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                data.Location = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }
                fn(data);
            });
        } else {
            fn(data);
        }
    }
}

//下面用得比较少
PG.getPasteboard = function (callback) {
    this.exec("getPasteboard", callback, null);
}
PG.execJs = function (code) {

    var args = {

        code: code

    };

    this.exec("execJs", null, args);

}
PG.vibratePhone = function () {
    this.exec("vibratePhone", null, null);
}
PG.alert = function (msg, title, buttonName, fn) {
    if (!PG.Device.App) {
        alert(msg);
        if (typeof (fn) == 'function')
            fn(1);
        return;
    }
    if (title === undefined)
        title = '提示';
    if (buttonName === undefined)
        buttonName = '确定';
    if (fn === undefined) fn = null;
    var args = {
        title: title,
        msg: msg,
        buttons: buttonName
    };
    this.exec("alert", fn, args);
}
PG.confirm = function (msg, title, buttons, fn) {
    if (!PG.Device.App) {
        if (confirm(msg))
            if (typeof (fn) == 'function')
                fn(2);
        return;
    }
    if (title === undefined)
        title = '提示';
    if (buttons === undefined)
        buttons = '取消,确定';
    if (fn === undefined) fn = null;
    var args = {
        title: title,
        msg: msg,
        buttons: buttons
    };
    var enfn = function (data) {
        if (typeof (data) == 'object' && data.code == 0) {
            if (typeof (fn) == 'function')
                fn(data.index);
        }
    }
    this.exec("alert", enfn, args);
}
PG.umengEvt = function (event_name) {
    var args = {
        event_name: event_name
    };
    this.exec("umengEvt", null, args);
}
PG.umengAppUnion = function () {
    this.exec("umengAppUnion", null, null);
}

PG.setKeyValue = function (key, val, fn) {

    if (fn === undefined) fn = null;
    var args = {
        key: key,
        value: val
    };
    this.exec("setKeyValue", fn, args);
}
PG.getKeyValue = function (key, fn) {
    var args = {
        key: key
    };
    this.exec("getKeyValue", fn, args);
}
PG.removeKeyValue = function (key, fn) {
    if (fn === undefined) fn = null;
    var args = {
        key: key
    };
    this.exec("removeKeyValue", fn, args);
}
PG.cleanApplicationCache = function () {
    this.exec("cleanApplicationCache", null, null);
}

/* 下面是根据需求新增方法 */
//隐藏原生头部导航条（如果网页自定义头部时）
PG.hideNavbar = function(){
    PG.exec("hideNavigationBar", null, null);
}

PG.showNavbar = function(){
    PG.exec("showNavigationBar", null, null);
}
PG.navigateToRenPinBaoCharge = function(args,callback){
    PG.exec('navigateToRenPinBaoCharge',callback,args)
}

PG.importMailBill =function(callback){
    console.log('调用账单导入');
    this.exec('importMailBill',callback,null)
}
//检查人品宝开户状态
PG.checkRenPinBaoOpenAccountStatus = function(callback,args){
    console.log('检查人品宝开户状态');
    this.exec('checkRenPinBaoOpenAccountStatus',callback,args);
}
//继续人品宝开户
PG.continueRenPinBaoOpenAccount =function (){
    console.log('继续人品宝开户');
    this.exec('continueRenPinBaoOpenAccount',null,null)
}
//调用人品宝还款
PG.openRenPinBaoRepaymentView = function(callback,args){
    console.log('调用人品宝还款');
    this.exec('openRenPinBaoRepaymentView',callback,args)
}
//锁定屏幕滚动
PG.setWebViewScrollLock = function(scl){
    var args = {
        lock : scl
    }
    if(PG.Device.OS ===  'ios'){
        this.exec('setWebViewScrollLock',null,args)
    }
}



module.exports = PG;

if ( typeof window !== 'undefined' ){
    window.PG = PG;
    window.PGCallback = PGCallback;
}