# animationend
[![Build Status](https://travis-ci.org/uiureo/animationend.svg?branch=master)](https://travis-ci.org/uiureo/animationend)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/uiureo-animationend.svg)](https://saucelabs.com/u/uiureo-animationend)

Detect when CSS transitions/animations have ended. Cross-browser tested.

The function returns ES6 Promise.

``` javascript
var animationEnd = require('animationend')

animate(element)

animationEnd(element).then(function(event) {
  // called on transitionend or animationend
})

animationEnd(element, function(event) {
  // also you can use a normal callback
})
```

## Installation
```
npm install --save animationend
```

## License
MIT
