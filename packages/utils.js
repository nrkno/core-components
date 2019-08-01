export const IS_BROWSER = typeof window !== 'undefined'
export const IS_ANDROID = IS_BROWSER && /(android)/i.test(navigator.userAgent) // Bad, but needed
export const IS_IOS = IS_BROWSER && /iPad|iPhone|iPod/.test(String(navigator.platform))

// Mock HTMLElement for Node
if (!IS_BROWSER && !global.HTMLElement) {
  global.HTMLElement = class {}
}

/**
* addEvent
* @param {String} nodeName An unique ID of the event to bind - ensurnes single instance
* @param {String} type The type of event to bind
* @param {Function} handler The function to call on event
* @param {Boolean|Object} options useCapture or options object for addEventListener. Defaults to false
*/
export function addEvent (nodeName, type, handler, options = false, key) {
  if (!IS_BROWSER || window[key = `event-${nodeName}-${type}`]) return // Ensure single instance
  const node = (type === 'resize' || type === 'load') ? window : document
  node.addEventListener(window[key] = type, (event) => (event.nodeName = nodeName) && handler(event), options)
}

/**
* addStyle
* @param {String} nodeName An unique ID of the event to bind - ensurnes single instance
* @param {String} css The css to inject
*/
export function addStyle (nodeName, css) {
  const key = `style-${nodeName.toLowerCase()}`
  const min = css.replace(/\/\*[^!][^*]*\*\//g, '').replace(/\s*(^|[:;,{}]|$)\s*/g, '$1')
  document.getElementById(key) || document.head.insertAdjacentHTML('afterbegin', `<style id="${key}">${min}</style>`)
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
* closest
* @param {Element} element Element to traverse up from
* @param {String} selector A selector to search for matching parents or element itself
* @return {Element|null}  Element which is the closest ancestor matching selector
*/
export const closest = (() => {
  const proto = typeof window === 'undefined' ? {} : window.Element.prototype
  const match = proto.matches || proto.msMatchesSelector || proto.webkitMatchesSelector
  return proto.closest ? (el, css) => el.closest(css) : (el, css) => {
    for (;el; el = el.parentElement) if (match.call(el, css)) return el
    return null
  }
})()

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
export function getUUID () {
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
 * toggleAttribute (Ponyfill for IE and Edge, fixes #299)
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute
 * @param {Element} el  Single DOM Element
 * @param {String} name The name of the attribute to be toggled
 * @param {Boolean} force Force attribute to be added or removed regardless of previous state
 */
export function toggleAttribute (el, name, force = !this.hasAttribute(name)) {
  if (!force === el.hasAttribute(name)) el[force ? 'setAttribute' : 'removeAttribute'](name, '')
  return force
}

/**
* queryAll
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @param {Element} context Node to look for elements within
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
