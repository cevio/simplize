import indexBrowserWithIndexWebview from './index-browser/index';

export let index = {
    inject: {
        icon: '<i class="iconfont icon-apps"></i>',
        text: 'Application',
        url: '/',
        order: 1
    },
    webviews: {
        index: indexBrowserWithIndexWebview
    }
}
