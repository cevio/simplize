export let POPUP = {
    name: 'sp-ui-popup',
    template: require('./popup.html'),
    data(){ return { html: '', status: false, showHead: false, heightObject: {},bodyHeight:{} }},
    methods: {
        $constructor(html, showHead=false, full=false){
            this.showHead = showHead;
            this.$parent.nextTick(() => {
                if(full){
                    this.heightObject = {
                        height: '100%'
                    }
                    if(showHead){
                      this.bodyHeight = {
                          height:'calc(100% - 44px)'
                      }
                    }else{
                      this.bodyHeight = {
                          height:'100%'
                      }
                    }

                }
                this.$parent.mask = true;
                this.status = true;
                this.html = html
            });
        },
        close(){
            this.status = false;
            this.$parent.prevTick(() => {
                this.$emit('popup:close');
            })
        }
    },
    events: {
        "modal:maskclick": function(){
            this.close();
        }
    }
}
