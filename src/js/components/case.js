exports.name = 'ui-case';
exports.template = '';
exports.props = ['text', 'value', 'checked'];
exports.ready = function(){
    if ( !this.$parent.isSwitcher ) return;
    this.$parent.data.push({
        text: this.text,
        value: this.value
    });
}
