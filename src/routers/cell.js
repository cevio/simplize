exports.data = {
  radio:'未选中',
  checkbox:[],
  switch:{
    a:1
  },
  vcode:"",
  file:[],
  textarea:'',
  account:''
}
exports.watch = {
  checkbox:function(newVal){
    console.log(newVal.join(','))
  },
  radio:function(newVal){
    console.log(newVal);
  }
}
exports.methods ={
  toggle:function(tag,source){


  }
}
exports.filters = {
  imgurl: function(url){
    return 'background-image:url(' + url + ')';
  }
}
exports.events = {
    beforeload: function() {
        this.$headbar.$reset();
        this.$headbar.center.text = 'CELL';
        this.$headbar.left.text = '返回';
        this.$headbar.left.icon = '<i class="fa fa-angle-double-left"></i>';
        this.$headbar.left.fn = function(){
          history.go(-1);
        };
        this.$headbar.class = '';
        this.$toolbar.status = false;
    },
    load:function(){
      var imgupload = this.$refs.imgupload;
      var that = this;
      imgupload.$on('file:success',function(file, e){
          var base64 = file.result;
          var img={
            src:base64,
            size: e.total
          }
          that.file.push(img);
      });
      imgupload.$on("file:before",function(files,resolve,reject){
        if(files.length + that.file.length <= 9){
          resolve();
        }else{
          reject(new Error("最多只能上传九张") );
        }
      })
      imgupload.$on('file:error',function(err){
        if(err){
          that.$alert(err.message);
        }else{
          that.$alert("文件读取失败");
        }
      })
    }
}
