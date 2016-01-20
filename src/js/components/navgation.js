module.exports = function(browser){
    return {
        name: 'navgation',
        data: function(){
            return browser.$head;
        },
        template:   '<header v-if="!hide" class="soe-clearfix" transition="headbar">' +
                        '<div class="soe-navbar" :class="cls" :style="css">' +
                            '<div class="soe-navbar-left-area  soe-clearflash tl" @click="left.fn">' +
                                '<div class="soe-navbar-icon " v-html="left.icon"></div>' +
                                '<div class="soe-navbar-text " v-html="left.value"></div>' +
                            '</div>' +
                            '<div class="soe-navbar-right-area  soe-clearflash tr" @click="right.fn">' +
                                '<div class="soe-navbar-text " v-html="right.value"></div>' +
                                '<div class="soe-navbar-icon " v-html="right.icon"></div>' +
                            '</div>' +
                            '<div class="soe-navbar-center-area">' +
                                '<div class="soe-navbar-text soe-clearflash" v-html="center.value" @click="center.fn"></div>' +
                            '</div>' +
                        '</div>' +
                    '</header>',
        ready: function(){
            browser.navgation = this;
        }
    }
}
