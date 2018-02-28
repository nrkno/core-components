/**
* addElements
* @param {String} key
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/
export function registerElements (key, elements) {
  if (typeof elements === 'string') return registerElements(key, document.querySelectorAll(elements))
  if (elements.length) return [].map.call(elements, (el) => (el[key] = 1) && el)
  if (elements.nodeType) return (elements[key] = 1) && [elements]
  return []
}

export function getUUID (el, attr) {
  const key = 'core-components-uuid'
  const uuid = window[key] = (window[key] || 0) + 1
  return `${key}-${uuid}`
}

export function ariaConnect (master, slave = master.nextElementSibling, relation = 'controls') {
  master.setAttribute(`aria-${relation}`, slave.id = slave.id || getUUID())
  slave.setAttribute('aria-labelledby', master.id = master.id || getUUID())
  return slave
}

/**
* addEvent
* @param {String} key A namespace to ensure no double binding and only triggering on registered elements
* @param {String} eventName A case-sensitive string representing the event type to listen for
* @param {Function} listener The function which receives a notification
*/
export function registerEvent (key, eventName, listener) {
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
  if (typeof window.CustomEvent === 'function') return window.CustomEvent

  function CustomEvent (name, params = {}) {
    const event = document.createEvent('CustomEvent')
    event.initCustomEvent(name, Boolean(params.bubbles), Boolean(params.cancelable), params.detail)
    return event
  }

  CustomEvent.prototype = window.Event.prototype
  return CustomEvent
})()

/**
* dispatchEvent
* @param {Element} elem The target object
* @param {String} name The source object(s)
* @param {Object} detail Detail object (bubbles and cancelable defaults to true)
* @return {Boolean} Whether the event was cance
*/
export function dispatchEvent (elem, name, detail = {}) {
  return elem.dispatchEvent(new CustomEvent(name, {detail, bubbles: true, cancelable: true}))
}

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
