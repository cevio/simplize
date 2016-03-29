exports.name = 'file-reader';
exports.template = '<input type="file" multiple :accept="accept|type" @change="select" />';
exports.props = ['accept'];
exports.events = {
    "webview:load": function(){
        if( typeof window.FileReader == 'undefined' ){
            this.$el.setAttribute("disabled","disabled");
        }
    }
}

exports.filters = {
    type: function(val){
        if ( !val ) return '*';
        return val;
    }
}

exports.methods = {};
exports.methods.select = function(){
    var files = this.$el.files;
    var that = this;
    files.forEach(function(file){
        that.read(file);
    });
}

exports.methods.read = function(file){
    var reader = new window.FileReader();
    var that = this;

    reader.readAsDataURL(file);
    reader.onload = function(e){
        that.$emit('file:success', this);
    }
    reader.onerror = function(){
        that.$emit('file:error', file);
    }
}
