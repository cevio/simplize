import * as simplize from './main.js';


const resource = {
    home: {
        options: {
            data: {
                icon: '<i class="fa fa-home"></i>',
                text: 'HOME',
                url: '/'
            }
        },
        webviews: {
            index: {
                
            }
        }
    }
}

const data = {

}


simplize.ready(function(){
    let app = simplize.bootstrap(resource, data);
    console.log(app);
})
