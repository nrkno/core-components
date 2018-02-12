/**
* addElements
* @param {String} key
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/
export function addElements (key, elements) {
  if (typeof elements === 'string') return addElements(key, document.querySelectorAll(elements))
  if (elements.length) return [].map.call(elements, (el) => (el[key] = 1) && el)
  if (elements.nodeType) return (elements[key] = 1) && [elements]
  return []
}

/**
* addEvent
* @param {String} key A namespace to ensure no double binding and only triggering on registered elements
* @param {String} eventName A case-sensitive string representing the event type to listen for
* @param {Function} listener The function which receives a notification
*/
export function addEvent (key, eventName, listener) {
  if (typeof window === 'undefined') return

  // Store on window to make sure multiple instances is merged
  const namespace = window[key] = window[key] || {}
  const isUnbound = !namespace[eventName] && (namespace[eventName] = 1)

  if (isUnbound) {
    document.addEventListener(eventName, function (event) {
      for (let el = event.target; el; el = el.parentElement) {
        if (el[key]) listener(el, event)
      }
    }, true) // Use capture to make sure focus/blur bubbles in old Firefox
  }
}

/**
* assign
* @param {Object} target The target object
* @param {Object} sources The source object(s)
* @return {Object} The target object
*/
export function assign (target, ...sources) {
  sources.filter(Boolean).forEach((source) => {
    Object.keys(source).forEach((key) => (target[key] = source[key]))
  })
  return target
}

/**
* CustomEvent
* See {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
* @param {String} eventName A case-sensitive string representing the event type to create
* @param {Object} params.detail Any data passed when initializing the event
* @param {Boolean} params.cancelable A Boolean indicating whether the event is cancelable.
* @param {Boolean} params.bubbles A Boolean indicating whether the event bubbles up through the DOM or not.
* @return {CustomEvent} Creates a CustomEvent.
*/
export const CustomEvent = (() => {
  if (typeof window === 'undefined') return
  if (window.CustomEvent) return window.CustomEvent

  function CustomEvent (event, params = {}) {
    const evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, Boolean(params.bubbles), Boolean(params.cancelable), params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype
  return CustomEvent
})()

/**
* debounce
* @param {Function} callback The function to debounce
* @param {Number} ms The number of milliseconds to delay
* @return {Function} The new debounced function
*/
export function debounce (callback, ms) {
  let timer
  return function (...args) {
    const self = this
    clearTimeout(timer)
    timer = setTimeout(() => callback.apply(self, args), ms)
  }
}

/**
* escapeHTML
* @param {String} str A string with potential html tokens
* @return {String} Escaped HTML string according to OWASP recommendation
*/
const ESCAPE_HTML_MAP = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '/': '&#x2F;', '\'': '&#x27;'}
export function escapeHTML (str) {
  return String(str || '').replace(/[&<>"'/]/g, (char) => ESCAPE_HTML_MAP[char])
}
