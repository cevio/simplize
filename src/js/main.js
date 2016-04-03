import './polyfill';
import vue from 'vue';
import fastclick from 'fastclick';
import domReady from 'domready';
import asyncBrowser from './application/browser';
import asyncWebview from './application/webview';
import { bootstrap } from './application/bootstrap';
import * as PROXY from './application/proxy';

export default {
    vue: vue,
    ready: domReady,
    config: PROXY,
    bootstrap: bootstrap,
    browser: asyncBrowser,
    webview: asyncWebview
}
