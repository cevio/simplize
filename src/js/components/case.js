exports.name = 'ui-case';
exports.template = '';
exports.props = ['text', 'value', 'checked'];
exports.ready = function(){
    if ( !this.$parent.isSwitcher ) return;
    var checked = false;
    if ( this.checked !== undefined ){
        if ( typeof this.checked === 'string' ){
            if ( this.checked.length === 0 ){
                checked = true;
            }else if ( this.checked === 'true' || this.checked === 'checked' ){
                checked = true;
            }
        }else if ( typeof this.checked == 'boolean' ){
            checked = this.checked;
        }else {
            checked = !!this.checked;
        }
    }
    if ( checked ){
        this.$parent.value = this.value;
    }
    this.$parent.data.push({
        text: this.text,
        value: this.value
    });
}
