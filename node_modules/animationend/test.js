var test = require('tape')
  , animationEnd = require('./index.js')

test('transitionend', function(t) {
  t.timeoutAfter(2000)

  element = document.createElement('div')
  document.body.appendChild(element)

  var properties = ['-webkit-transition', '-moz-transition', '-o-transition', 'transition']

  element.style.opacity = 0
  properties.forEach(function(property) {
    element.style[property] = 'all .1s ease'
  })

  setTimeout(function(){
    element.style.opacity = 1
  }, 0)

  var ret = animationEnd(element, function(event) {
    t.ok(event instanceof Event, 'event should be passed to callback')
    t.pass('should be called on transitionend')
    t.end()
  })

  t.ok(ret.then !== undefined, 'should return a promise')
})

var animationCSS =
  '.animation { -webkit-animation: fade .1s linear; -moz-animation: fade .1s linear; -o-animation: fade .1s linear; animation: fade .1s linear;}\n' +
  '@-webkit-keyframes fade { from { opacity: 1; } to { opacity: 0; } }\n' +
  '@-moz-keyframes fade { from { opacity: 1; } to { opacity: 0; } }\n' +
  '@-o-keyframes fade { from { opacity: 1; } to { opacity: 0; } }\n' +
  '@keyframes fade { from { opacity: 1; } to { opacity: 0; } }\n'

function injectCSS(text) {
  var styleElement = document.createElement('style')
  styleElement.appendChild(document.createTextNode(text))
  document.head.appendChild(styleElement)
}

test('animationend', function(t) {
  t.timeoutAfter(2000)

  injectCSS(animationCSS)

  var element = document.createElement('div')
  document.body.appendChild(element)
  element.className = 'animation'

  animationEnd(element, function(event) {
    t.ok(event instanceof Event, 'event should be passed to callback')
    t.pass('should be called on animationend')
    t.end()
  })
})
