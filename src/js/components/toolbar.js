module.exports = function(soyie){
    return {
        name: 'toolbar',
        data: function(){ return soyie.data; },
        template:   '<div class="toolbar" v-if="!hide" transition="toolbar">' +
                        '<div class="toolbar-list soe-clearfix soe-clearflash">' +
                            '<div class="toolbar-item "' +
                            ' v-for="item in browsers"' +
                            ' :class="item.actived?actived:unactived"' +
                            ' :name="item.name"' +
                            ' @click="redirect | add item.url">' +
                                '<div class="toolbar-icon" v-html="item.icon"></div>' +
                                '<div class="toolbar-text" v-html="item.text"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
    }
}
