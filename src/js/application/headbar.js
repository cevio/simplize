module.exports = function(options){
    var data;
    if ( typeof options.data === 'function' ){
        data = addData(options.data());
    }
    if ( data ){
        options.data = function(){
            return data;
        }
    }
    if ( !options.watch ) {
        options.watch = {};
    }

    if ( !options.watch.status ){
        options.watch.status = function(value){
            var that = this;
            if ( value ){
                this.height = this.fixHeight;
            }else{
                that.height = 0;
            }
            if ( this.$root.env.disableAnimation ){
                this.display = 'slient';
                this.$emit('run');
            }else{
                this.display = 'move';
            }
        }
        options.watch.height = function(val){
            this.$parent.$broadcast('headresize', val);
        }
    }

    if ( !options.ready ){
        options.ready = function(){
            this.$parent.$headbar = this;
            this.$emit('size');
        }
    }

    if ( !options.methods ){
        options.methods = {};
    }

    options.methods.$reset = function(){
        this.$emit('reset');
    }

    if ( !options.events ){
        options.events = {};
    }

    if ( !options.events.run ){
        options.events.run = function(){
            this.state = this.status;
        }
        options.events.size = function(){
            this.height = this.fixHeight = this.$els.headbar.clientHeight;
        }
    }

    if ( !options.events.destroy ){
        options.events.destroy = function(){
            this.state = false;
            this.height = 0;
        }
    }

    return options;
}

function addData(data){
    data.height = 0;
    data.status = true;
    data.fixHeight = 0;
    data.display = 'block';
    data.state = true;
    return data;
}
