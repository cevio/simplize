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
exports.methods.select = function(e){
    var files = e.target.files;
    for ( var i = 0 ; i < files.length ; i++ ){
      this.read(files[i]);
    }
}

exports.methods.read = function(file){
    var reader = new window.FileReader();
    var that = this;

    reader.readAsDataURL(file);
    reader.onload = function(e){
        that.$emit('file:success', this, e);
    }
    reader.onerror = function(){
        that.$emit('file:error', file);
    }
}
