import * as coresBrowser from './cores';

console.log(coresBrowser)

export let cores = {
    inject: {
        icon: '<i class="fa fa-home"></i>',
        text: 'HOME',
        url: '/',
        order: 1
    },
    webviews: {
        index: coresBrowser.index,
        modals: coresBrowser.modals,
        buttons: coresBrowser.buttons
    }
}
