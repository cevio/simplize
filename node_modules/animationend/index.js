var Promise = require('es6-promise').Promise

var TRANSITIONEND_EVENTS = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'mozTransitionEnd',
  OTransition: 'oTransitionEnd',
  msTransition: 'MSTransitionEnd'
}

var ANIMATIONEND_EVENTS = {
  animation: 'animationend',
  WebkitAnimation: 'webkitAnimationEnd',
  MozAnimation: 'mozAnimationEnd',
  OAnimation: 'oAnimationEnd',
  msAnimation: 'MSAnimationEnd'
}

function animationEvents() {
  var testElement = document.createElement('div')

  function availableEvents(eventMap) {
    return Object.keys(eventMap).filter(function(propertyName) {
      return propertyName in testElement.style
    }).map(function(propertyName) {
      return eventMap[propertyName]
    })
  }

  var events = [TRANSITIONEND_EVENTS, ANIMATIONEND_EVENTS].reduce(function(value, eventMap) {
    return value.concat(availableEvents(eventMap))
  }, [])

  return events
}

// @param {Node} element
// @param {Function} [callback]
//
// @return {Promise}
module.exports = function animationEnd(element, callback) {
  var events = animationEvents()

  return new Promise(function(resolve, reject) {
    function handler(event) {
      events.forEach(function(event) {
        element.removeEventListener(event, handler, false)
      })

      resolve(event)
      if (callback) callback(event)
    }

    events.forEach(function(event) {
      element.addEventListener(event, handler, false)
    })
  })
}
