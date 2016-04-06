import * as coresBrowser from './cores';

export let cores = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME',
        url: '/',
        order: 1
    },
    webviews: {
        index: coresBrowser.index,
        info: coresBrowser.info,
        picker: coresBrowser.picker,
        actionsheet: coresBrowser.actionsheet,
        button: coresBrowser.button
    }
}
