const KEY = `core-components-${Date.now()}`
const STATES = {}
let UUID = 0

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
