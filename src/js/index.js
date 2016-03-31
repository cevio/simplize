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
                template: require('../html/index.html'),
                events: {
                    load: function(){
                        console.log('load')
                    }
                }
            }
        }
    }
}

const data = {

}


simplize.ready(function(){
    let app = simplize.bootstrap(resource, data);
    app.$on('app:passend', function(){
        console.log('passed');
    })

    var home = app.$get('home');
    home.$use(function(next){
        console.log('pass cross middle ware')
        next();
    });
    home.$active(function(){
        this.$render('index');
    });

    app.$use(home);

    app.$run();
    console.log(app)
})
