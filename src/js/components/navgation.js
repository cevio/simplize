module.exports = function(browser){
    return {
        name: 'navgation',
        data: function(){
            return browser.$head;
        },
        template:   '<header v-if="!hide" :style="css" class="soe-clearfix">' +
                        '<div class="soe-navbar" :class="cls">' +
                            '<div class="soe-navbar-left-area soe-pull-left soe-clearflash" @click="left.fn">' +
                                '<div class="soe-navbar-icon soe-pull-left" v-html="left.icon"></div>' +
                                '<div class="soe-navbar-text soe-pull-left" v-html="left.value"></div>' +
                            '</div>' +
                            '<div class="soe-navbar-right-area soe-pull-right soe-clearflash" @click="right.fn">' +
                                '<div class="soe-navbar-text soe-pull-left" v-html="right.value"></div>' +
                                '<div class="soe-navbar-icon soe-pull-left" v-html="right.icon"></div>' +
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
