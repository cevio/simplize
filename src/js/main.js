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
import DEDINE from './application/define';

export default {
    vue: vue,
    ready: domReady,
    proxy: PROXY,
    bootstrap: bootstrap,
    browser: asyncBrowser,
    webview: asyncWebview,
    animate: ANIMATE,
    scroll: SCROLL,
    define: DEDINE
}

/*
-----------------------------------------------------
    common plugins install
-----------------------------------------------------
 */
import { ALERT } from './plugins/alert/index';

// install

DEDINE('$alert', ALERT);
