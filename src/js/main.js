import './polyfill';
import vue from 'vue';
import fastclick from 'fastclick';
import domReady from 'domready';
import asyncBrowser from './application/browser';
import asyncWebview from './application/webview';
import { bootstrap } from './application/bootstrap';
import * as PROXY from './application/proxy';
import * as ANIMATE from './application/animate';
import SCROLL from './application/scroll';
import DEFINE from './application/define';
import { Promise } from 'es6-promise';
import * as utils from './utils/index';

if ( typeof window.Promise === 'undefined' ){
    window.Promise = Promise;
}

export default {
    vue,
    Promise,
    bootstrap,
    ready: domReady,
    proxy: PROXY,
    browser: asyncBrowser,
    webview: asyncWebview,
    animate: ANIMATE,
    scroll: SCROLL,
    define: DEFINE,
    util: utils
}

/*
-----------------------------------------------------
    common plugins install
-----------------------------------------------------
 */
import { ALERT } from './plugins/alert/index';
import { CONFIRM } from './plugins/confirm/index';
import { PROMPT } from './plugins/prompt/index';
import { ACTIONSHEET } from './plugins/actionSheet/index';
import { TOAST } from './plugins/toast/index';
import { LOADING } from './plugins/loading/index';
import { TIP } from './plugins/tip/index';
import { SELECTOR } from './plugins/selector/index';
import { DATETIME } from './plugins/datetime/index';

// install

DEFINE('$alert', ALERT);
DEFINE('$confirm', CONFIRM);
DEFINE('$prompt', PROMPT);
DEFINE('$actionsheet', ACTIONSHEET);
DEFINE('$toast', TOAST);
DEFINE('$loading', LOADING);
DEFINE('$tip', TIP);
DEFINE('$select', SELECTOR);
DEFINE('$datetime', DATETIME);
