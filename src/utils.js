const KEY = `core-components-${Date.now()}`
const STATES = {}
let UUID = 0

export function dispatchEvent (element, eventName, options) {
  console.warn('TODO: polyfill customEvent')
}

export function assign (target, ...sources) {
  sources.filter(Boolean).forEach((source) => {
    Object.keys(source).forEach((key) => (target[key] = source[key]))
  })
  return target
}

export function attr (elements, attributes) {
  getElements(elements).forEach((element) => {
    Object.keys(attributes).forEach((name) => {
      element[`${attributes[name] === null ? 'remove' : 'set'}Attribute`](name, attributes[name])
    })
  })
  return elements
}

export const closest = (element, nodeName) => {
  for (var el = element; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === nodeName) return el
  }
}

export function getElements (elements) {
  if (typeof elements === 'string') return getElements(document.querySelectorAll(elements))
  if (elements && elements.length) return [].slice.call(elements)
  if (elements && elements.nodeType) return [elements]
  return []
}

export function weakState (element, object, initial = {}) {
  const weakMap = {
    get: (element) => STATES[element[KEY]],
    set: (element, object) => {
      const uuid = element[KEY] || (element[KEY] = ++UUID)
      const state = STATES[uuid] || (STATES[uuid] = initial)
      Object.keys(object).forEach((key) => (state[key] = object[key]))
      return state
    },
    has: (element) => Boolean(STATES[element[KEY]]),
    delete: (element) => {
      if (!weakMap.get(element)) return false
      delete element[KEY]
      delete STATES[element[KEY]]
      return true
    }
  }

  if (object === false) {
    weakMap.delete(element)
  } else if (typeof object === 'object') {
    weakMap.set(element, object)
  }

  return weakMap
}

export const queryAll = (selector, context = document) =>
  [].slice.call(context.querySelectorAll(selector))
