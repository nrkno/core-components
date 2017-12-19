const KEY = `core-components-${Date.now()}`
const STATES = {}
let UUID = 0

export function attr (elements, attributes) {
  getElements(elements).forEach((element) => {
    Object.keys(attributes).forEach((name) => {
      element[`${attributes[name] === null ? 'remove' : 'set'}Attribute`](name, attributes[name])
    })
  })
  return elements
}

export function closest (element, nodeName) {
  for (var el = element; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === nodeName) return el
  }
}

export const getElements = (elements) => {
  if (typeof elements === 'string') return getElements(document.querySelectorAll(elements))
  if (elements.length) return [].slice.call(elements)
  if (elements.nodeType) return [elements]
  throw new Error('"elements" must be of type nodeList, array, selector string or single HTMLElement')
}

export const weakState = (element, object, initial = {}) => {
  const uuid = element[KEY] || (element[KEY] = ++UUID)
  const state = STATES[uuid] || (STATES[uuid] = initial)

  if (object === false) {
    delete element[KEY]
    delete STATES[uuid]
  } else if (typeof object === 'object') {
    Object.keys(object).forEach((key) => (state[key] = object[key]))
  }

  return state
}

export const getWeakState = (element) => {
  return STATES[element[KEY]]
}

export const queryAll = (selector, context = document) =>
  [].slice.call(context.querySelectorAll(selector))
