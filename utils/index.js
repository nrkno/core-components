const KEY = `core-components-${Date.now()}`
const STATES = {}
let UUID = 0

export function closest (element, nodeName) {
  for (var el = element; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === nodeName) return el
  }
}

export const factory = (fn) =>
  function self (element, ...args) {
    if (typeof element === 'string') return self(document.querySelectorAll(element), ...args)
    if (element.length) return [].map.call(element, (el) => self(el, ...args))
    if (element.nodeType) return fn(element, ...args)
  }

export const hasState = (element) =>
  element && element[KEY] && element

export const setAttributes = factory((element, attributes) => {
  Object.keys(attributes).forEach((name) => {
    element[`${attributes[name] === null ? 'remove' : 'set'}Attribute`](name, attributes[name])
  })
  return element
})

export const setState = (element, object, initial = {}) => {
  const uuid = element[KEY] || (element[KEY] = ++UUID)
  const state = STATES[uuid] || (STATES[uuid] = initial)

  if (object === false) {
    delete element[KEY]
    delete STATES[uuid]
  } else if (typeof object === 'object') {
    Object.keys(state).forEach((key) => (state[key] = object[key]))
  }

  return state
}

export const queryAll = (selector, context = document) =>
  [].slice.call(context.querySelectorAll(selector))
