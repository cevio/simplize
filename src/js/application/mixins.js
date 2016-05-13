import Redirect from './redirect';
import { on, off } from '../utils/index';

import { picker } from "../components/picker/index";
import { middle } from "../components/middle/index";
import { ratio } from "../components/ratio/index";
import { datetime } from "../components/datetime/index";
import { selector } from "../components/select/index";
import { radio } from "../components/radio/index";
import { checkbox } from "../components/checkbox/index";
import { switcher } from "../components/switch/index";
import { range } from "../components/range/index";
import { progress } from "../components/progress/index";
import { now, ago } from "../components/time/index";
import { group, cell, cellHead, cellBody, cellFoot } from "../components/group/index";
import { panel, panelHead, panelBody, panelFoot } from "../components/panel/index";
import { circle } from "../components/circle/index";
import { photo, photos } from "../components/image/index";
import { rater } from "../components/rater/index";
import { spinner } from "../components/spinner/index";
import { pull } from "../components/pull/index";
import { flex, flexs } from "../components/flex/index";
import { tabs, tab } from '../components/tab/tab';
import { divider } from '../components/divider/index';
import { collapses, collapse, collapseTrigger, collapseContent } from "../components/collapse/index";

import * as PROXY from './proxy';
export let filters = {
    rem: function(val){
        return val / this.$root.env.viewScale;
    }
}

export let directives = {
    "redirect": {
        priority: 3000,
        deep: true,
        _url: null,
        bind(){
             this._cb = () => {
                 if ( !this._url ) return;
                 Redirect.call(this.vm.$root, this._url);
             };
             on(this.el, 'click', this._cb);
        },
        update(newValue){
            this._url = newValue;
        },
        unbind(){
            off(this.el, 'click', this._cb);
        }
    },
    "reback": {
        priority: 3000,
        deep: true,
        _url: null,
        bind(){
             this._cb = () => {
                 if ( !this._url ) return;
                 Redirect.call(this.vm.$root, this._url, true);
             };
             on(this.el, 'click', this._cb);
        },
        update(newValue){
            this._url = newValue;
        },
        unbind(){
            off(this.el, 'click', this._cb);
        }
    }
}

export let components = {
    picker,
    middle,
    ratio,
    datetime,
    selector,
    radio,
    checkbox,
    range,
    progress,
    now,
    ago,
    group,
    cell,
    panel,
    photo,
    photos,
    spinner,
    pull,
    flex,
    chead: cellHead,
    cbody: cellBody,
    cfoot: cellFoot,
    phead: panelHead,
    pbody: panelBody,
    pfoot: panelFoot,
    switch: switcher,
    circle: circle,
    rater: rater,
    tabs,
    tab,
    divider,
    collapses,
    collapse,
    collapseTrigger,
    collapseContent
}

for ( let i in flexs ){
    components[i] = flexs[i];
}
