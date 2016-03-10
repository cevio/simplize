var selector = require('./select');
exports.name = 'pop-component-selects';
exports.props = ['arrays', 'html', 'object'];

exports.data = function(){
    return {
        height: 0,
        value: []
    }
}

exports.computed = {
    style: function(){
        return 'width:' + (1 / this.arrays.length * 100) + '%;';
    }
}

exports.template =
    '<div class="ui-pop-content-selects clearfix f12">' +
        '<div class="ui-pop-content-select fl" :style="style" v-for="detail in arrays">' +
            '<selector :data.sync="detail"></selector>' +
        '</div>' +
    '</div>';

exports.components = {
    selector: selector
}

exports.events = {
    result: function(){
        this.$broadcast('get');
        var result = [];
        for ( var i = 0 ; i < this.arrays.length ; i++ ){
            result.push(this.arrays[i].value);
        }
        this.$parent.$emit('send', result);
    }
}
