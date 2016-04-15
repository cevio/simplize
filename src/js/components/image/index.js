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
    }
}
export let photos = {
    name: 'photos',
    template: '<div class="sp-images" v-el:root><slot></slot></div>',
    events: {
        "webview:load": function(){
            this.$lazyimage = new blazy({
                container: this.$els.root
            });
        }
    }
}
