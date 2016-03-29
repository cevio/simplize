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
    var status = { pass: true, val: '' };
    var next = function(){
        status.pass = true;
    }
    var fail = function(e){
        status.pass = false;
        status.val = e;
    }
    this.$emit('file:before', files, next, fail);
    if ( !status.pass ){
        return this.$emit('file:error', status.val);
    }

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
    reader.onerror = function(e){
        that.$emit('file:error');
    }
}
