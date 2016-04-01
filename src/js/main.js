import './polyfill';
import vue from 'vue';
import fastclick from 'fastclick';
//import Promise from 'es6-promise';
import domReady from 'domready';
import asyncBrowser from './application/browser';
import asyncWebview from './application/webview';

import { bootstrap } from './application/bootstrap';

export default {
    vue: vue,
    //Promise: Promise,
    ready: domReady,
    bootstrap: bootstrap,
    browser: asyncBrowser,
    webview: asyncWebview
}
