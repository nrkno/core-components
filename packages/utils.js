export const IS_BROWSER = typeof window !== 'undefined'
export const IS_ANDROID = IS_BROWSER && /(android)/i.test(navigator.userAgent) // Bad, but needed
export const IS_IOS = IS_BROWSER && /iPad|iPhone|iPod/.test(String(navigator.platform))

/**
* addEvent
* @param {String} uuid An unique ID of the event to bind - ensurnes single instance
* @param {String} type The type of event to bind
* @param {Function} handler The function to call on event
* @param {Boolean|Object} options useCapture or options object for addEventListener. Defaults to false
*/
export function addEvent (scope, type, handler, options = false, key) {
  if (!IS_BROWSER || window[key = `event-${scope}-${type}`]) return // Ensure single instance
  const node = (type === 'resize' || type === 'load') ? window : document
  node.addEventListener(window[key] = type, (event) => (event.scope = scope) && handler(event), options)
}

/**
* escapeHTML
* @param {String} str A string with potential html tokens
* @return {String} Escaped HTML string according to OWASP recommendation
*/
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '/': '&#x2F;', '\'': '&#x27;' }
export function escapeHTML (str) {
  return String(str || '').replace(/[&<>"'/]/g, (char) => ESCAPE_MAP[char])
}

/**
* dispatchEvent - with infinite loop prevention
* @param {Element} elem The target object
* @param {String} name The source object(s)
* @param {Object} detail Detail object (bubbles and cancelable is set to true)
* @return {Boolean} Whether the event was canceled
*/
export function dispatchEvent (element, name, detail = {}) {
  const ignore = `prevent_recursive_dispatch_maximum_callstack${name}`
  let event

  if (element[ignore]) return true // We are already processing this event, so skip sending a new one
  else element[ignore] = true // Add name to dispatching ignore

  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(name, { bubbles: true, cancelable: true, detail })
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(name, true, true, detail)
  }
  // IE reports incorrect event.defaultPrevented
  // but correct return value on element.dispatchEvent
  const result = element.dispatchEvent(event)
  element[ignore] = null // Remove name from dispatching ignore

  return result // Follow W3C standard for return value
}

/**
* getUUID
* @return {String} A generated unique ID
*/
export function getUUID (el) {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

/**
 * throttle
 * @param {Function} callback  The new throttled function
 * @param {Number} ms The threshold of milliseconds between each callback
 */
export function throttle (callback, ms) {
  let timer
  return function (...args) {
    if (!timer) {
      timer = setTimeout(function () {
        callback.apply(this, args)
        timer = null
      }, ms)
    }
  }
}

/**
* queryAll
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Element[]} Array of elements
*/
export function queryAll (elements, context = document) {
  if (elements) {
    if (elements.nodeType) return [elements]
    if (typeof elements === 'string') return [].slice.call(context.querySelectorAll(elements))
    if (elements.length) return [].slice.call(elements)
  }
  return []
}
