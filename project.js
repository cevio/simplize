var path = require('path');

exports.output = path.resolve(__dirname, 'build');

exports.js = {
    from: './src/index.js',
    to: 'index'
}

exports.css = 'css/index';

exports.html = {
    from: path.resolve(__dirname, './src/index.spz'),
    to: 'index.html'
}
