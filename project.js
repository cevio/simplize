var path = require('path');

exports.output = path.resolve(__dirname, 'build');

exports.js = {
    from: {
        dev: './src/index.js',
        production: './src/main'
    },
    to: 'index'
}

exports.css = 'css/index';
