var agos = require('./agos').computed;
exports.name = 'time-ago';
exports.template = '{{compute}}';
exports.props = ['time'];
exports.computed = {
    compute: function(){
        return agos(this.time, this.$root.timestamp);
    }
}
