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

export function on (key, event, handler) {
  if (typeof window === 'undefined') return
  const namespace = window[key] = window[key] || {}
  const isUnbound = !namespace[event] && (namespace[event] = 1)

  if (isUnbound) {
    document.addEventListener(event, function (event) {
      for (let el = event.target; el; el = el.parentElement) {
        if (el[key]) handler(el, event)
      }
    }, true) // Use capture to make sure focus/blur bubbles in old Firefox
  }
}

export function getElements (elements, key) {
  let list = []
  if (typeof elements === 'string') list = [].slice.call(document.querySelectorAll(elements))
  else if (elements && elements.length) list = [].slice.call(elements)
  else if (elements && elements.nodeType) list = [elements]
  if (key) list.forEach((el) => (el[key] = 1))
  return list
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
