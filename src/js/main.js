import './polyfill';
import vue from 'vue';
import fastclick from 'fastclick';
import Promise from 'es6-promise';
import domReady from 'domready';

import { bootstrap } from './application/bootstrap';

export default {
    vue: vue,
    Promise: Promise,
    ready: domReady,
    bootstrap: bootstrap
}
