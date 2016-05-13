export let _resource = {
    req: {},
    env: {
        stopAnimate: false,
        direction: '',
        referrer: '',
        oldHistoryIndex: 0,
        newHistoryIndex: 0,
        animateDisable: false,
        viewScale: 1,
        viewType: 'device-width',
        timer: null,
        time: false,
        now: new Date(),
        timeFormats: {
            seconds: 's',
            minutes: 'm',
            hours: 'h',
            days: 'd',
            type: 'yyyy-MM-dd hh:mm:ss'
        }
    },
    SP_currentBrowser: '',
    SP_animate_switch: '',
    SP_firstEnter: true
}
