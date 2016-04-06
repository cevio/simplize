export let index = {
    zindex: 2,
    template: require('../../html/index.html'),
    events: {
        "webview:preset": function(head, tool) {
            head.active();
            head.data.left.icon = '<i class="fa fa-navicon"></i>';
            head.data.right.icon = '<i class="fa fa-code-fork"></i>';
            head.data.center.text = 'Simplize Application Builder';
            this.SP_webviewContentClass = 'test1';
        }
    }
    // ,
    // methods: {
    //     alertHandler: function() {
    //         this.$alert('Hello world!').then(function(Alert) {
    //             console.log(Alert);
    //             Alert.$on('alert:ok', function() {
    //                 console.log('close ok')
    //             })
    //         })
    //     },
    //
    //     confirmHandler: function() {
    //         this.$confirm('Hello world!').then(function(Confirm) {
    //             console.log(Confirm);
    //             Confirm.$on('confirm:ok', function() {
    //                 console.log('confirm close ok')
    //             })
    //
    //             Confirm.$on('confirm:cancel', function() {
    //                 console.log('confirm close cancel')
    //             })
    //         })
    //     },
    //
    //     confirmAlert: function() {
    //         var that = this;
    //         this.$alert('Hello world2').then((Alert) => {
    //             console.log(Alert);
    //             Alert.$on('alert:ok', () => {
    //                 console.log('close ok')
    //                 setTimeout(function() {
    //                     that.$confirm('Hello world confirm').then(function(Confirm) {
    //                         console.log(Confirm);
    //                         Confirm.$on('confirm:ok', function() {
    //                             console.log('confirm close ok')
    //                         })
    //
    //                         Confirm.$on('confirm:cancel', function() {
    //                             console.log('confirm close cancel')
    //                         })
    //                     })
    //                 }, 0)
    //
    //             })
    //         })
    //     }
    // }
}
