exports.name = 'ratio';
exports.props = ['value'];
exports.template =
    '<div><div class="ui-ratio-outter" :class="\'ratio\'+value">' +
        '<div class="ui-ratio-inner"><slot></slot></div>' +
    '</div></div>';
