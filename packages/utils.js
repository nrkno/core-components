export const IS_BROWSER = typeof window !== 'undefined'
export const IS_ANDROID = IS_BROWSER && /(android)/i.test(navigator.userAgent) // Bad, but needed
export const IS_IOS = IS_BROWSER && /iPad|iPhone|iPod/.test(String(navigator.platform))

/**
* addEvent
* @param {String} uuid An unique ID of the event to bind - ensurnes single instance
* @param {String} type The type of event to bind
* @param {Function} handler The function to call on event
*/
export function addEvent (uuid, type, handler) {
  const useCaptureForOldFirefox = type === 'blur' || type === 'focus'
  const id = `${uuid}-${type}`

  if (typeof window === 'undefined' || window[id]) return // Ensure single instance
  document.addEventListener(window[id] = type, handler, useCaptureForOldFirefox)
}

export function ariaExpand (master, open) {
  const relatedTarget = ariaTarget(master)
  const prevState = master.getAttribute('aria-expanded') === 'true'
  const wantState = typeof open === 'boolean' ? open : (open === 'toggle' ? !prevState : prevState)
  const canUpdate = prevState === wantState || dispatchEvent(master, 'toggle', {relatedTarget, isOpen: prevState})
  const nextState = canUpdate ? wantState : prevState

  relatedTarget[nextState ? 'removeAttribute' : 'setAttribute']('hidden', '') // Toggle hidden attribute
  master.setAttribute('aria-expanded', nextState) // Set expand always
  return nextState
}

export function ariaTarget (master, relationType) {
  const targetId = master.getAttribute('aria-controls') || master.getAttribute('aria-owns')
  const target = document.getElementById(targetId) || master.nextElementSibling
  const label = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content

  if (!target) throw new Error(`missing nextElementSibling on ${master.outerHTML}`)
  if (relationType) {
    master.setAttribute(`aria-${relationType}`, target.id = target.id || getUUID())
    target.setAttribute(`${label}-labelledby`, master.id = master.id || getUUID())
  }
  return target
}

/**
* escapeHTML
* @param {String} str A string with potential html tokens
* @return {String} Escaped HTML string according to OWASP recommendation
*/
const ESCAPE_MAP = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '/': '&#x2F;', '\'': '&#x27;'}
export function escapeHTML (str) {
  return String(str || '').replace(/[&<>"'/]/g, (char) => ESCAPE_MAP[char])
}

/**
* exclude
* @param {Object} target The target object
* @param {Object} exclude The source to exclude keys from
* @return {Object} The target object without keys found in source
*/
export function exclude (target, exclude, include = {}) {
  return Object.keys(target).reduce((acc, key) => {
    if (!exclude.hasOwnProperty(key)) acc[key] = target[key]
    return acc
  }, include)
}

/**
* dispatchEvent
* @param {Element} elem The target object
* @param {String} name The source object(s)
* @param {Object} detail Detail object (bubbles and cancelable is set to true)
* @return {Boolean} Whether the event was cance
*/
export function dispatchEvent (elem, name, detail = {}) {
  let event
  if (typeof window.CustomEvent === 'function') {
    event = new window.CustomEvent(name, {bubbles: true, cancelable: true, detail})
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(name, true, true, detail)
  }

  return elem.dispatchEvent(event)
}

/**
* getUUID
* @return {String} A generated unique ID
*/
export function getUUID (el, attr) {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

/**
* queryAll
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @return {Array} Array of elements
*/
export function queryAll (elements, context = document) {
  if (elements) {
    if (elements.nodeType) return [elements]
    if (typeof elements === 'string') return [].slice.call(context.querySelectorAll(elements))
    if (elements.length) return [].slice.call(elements)
  }
  return []
}
