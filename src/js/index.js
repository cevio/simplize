var simplize = require('./main');
var database = require('./data');


simplize.ready(function() {
    // simplize.viewport('retina');
    var app = simplize(database);
    app.env.debug = true;

    var indexBrowser = app.$browser('index');

    app.$use(indexBrowser);

    indexBrowser.$route('home');
    indexBrowser.$route('/button','button');
    indexBrowser.$route('/cell','cell');


    app.$run();
    //console.log(app);
});
