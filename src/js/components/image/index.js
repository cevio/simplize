import blazy from '../../application/blazy';


export let photo = {
    name: 'photo',
    template: '<img class="b-lazy" :src="placeholder" :data-src="src" />',
    props: {
        src: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            default: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
    },
    ready: function(){
        this.$dispatch('photo:ready');
    }
}
export let photos = {
    name: 'photos',
    template: '<div class="sp-images" v-el:root><slot></slot></div>',
    events: {
        "photo:ready": function(){
            this.reinit();
        }
    },
    ready: function(){
        this.$lazyimage = new blazy({
            container: this.$els.root
        });
    },
    data: function(){
        return {
            timer: null
        }
    },
    methods: {
        reinit: function(){
            clearTimeout(this.timer);
            
            this.timer = setTimeout(() => {
                this.$lazyimage.revalidate();
                this.$lazyimage._util.validateT();
            }, 25);
        }
    }
}
