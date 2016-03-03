module.exports = function(toolbar){
    if ( !toolbar.ready ){
        toolbar.ready = function(){
            this.$parent.$toolbar = this;
            this.height = this.fixHeight = this.$els.toolBar.clientHeight;
        }
    }


    if ( !toolbar.events ){
        toolbar.events = {};
    }

    if ( !toolbar.events.run ){
        toolbar.events.run = function(){
            this.state = this.status;
        }
    }

    if ( !toolbar.events.destroy ){
        toolbar.events.destroy = function(){
            this.display = 'slient';
            this.state = false;
            this.height = 0;
        }
    }

    if ( !toolbar.methods ){
        toolbar.methods = {};
    }

    toolbar.methods.database = function(){
        var params = Object.keys(this.$parent.$refs);
        var i = params.length;
        var result = [];
        while ( i-- ) {
            var browser = this.$parent.$refs[params[i]];
            if ( browser.$isBrowser ){
                result.push(browser);
            }
        }
        return result;
    }

    if ( !toolbar.watch ){
        toolbar.watch = {};
    }

    if ( !toolbar.watch.status ){
        toolbar.watch.status = function(value){
            var that = this;
            if ( !!value ){
                this.height = this.fixHeight;
            }else{
                this.height = 0;
            }
            if ( this.$root.env.disableAnimation ){
                this.display = 'slient';
                this.$emit('run');
            }
        }
    }

    return toolbar;
}
