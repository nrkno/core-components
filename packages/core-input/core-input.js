// import {name, version} from './package.json'
import {getUUID, registerElements, registerEvent} from '../utils'

const KEY = 'core-input' //`${name}-${version}`  // Unique id of component
let ARIA_LIVE_EL                  // Element to contain screen reader text

const OPTIONS = {
  items: 10,
  onHits: () => {},
  sort: (itemA, itemB) => 0,
  item: (item, input) => (item.label || item.value).replace(input.regex, '<b>' + input.query + '</b>'),
  filter: (item, input) => item.value.indexOf(input.query) !== -1,
  value: (item) => ({value: item.value, label: 'Hei'}),
  getItems: () => {},
  list: (query) => {
    return ['gmail.com', 'hotmail.com'].map((provider) => {
      return `${query}@${provider}`
    })
  }
}

export default function input (...args) {
  return new Input(...args)
}

class Input {
  constructor (elements, options = {}) {
    this.elements = registerElements(KEY, elements)
    this.elements.forEach((el) => {
      const list = el.nextElementSibling || el.insertAdjacentElement('afterend', document.createElement('ul'))
      const mode = options.mode || el.getAttribute('aria-autocomplete') || 'list' // both = suggest, list = hits
      const owns = el.getAttribute('aria-owns') || getUUID()
      const id = el.getAttribute('id') || getUUID()

      el.setAttribute('role', 'combobox')
      el.setAttribute('autocomplete', false)
      el.setAttribute('aria-haspopup', true)
      el.setAttribute('aria-autocomplete', mode)
      el.setAttribute('aria-owns', owns)
      el.setAttribute('id', id)

      list.setAttribute('id', owns)
      list.setAttribute('aria-labelledby', id)
      list.setAttribute('role', 'listbox')
      list.setAttribute('hidden', '')
      hide(el)
    })
  }
  show () { this.elements.forEach(show) }
  hide () { this.elements.forEach(hide) }
  value () {

  }
}

function evaluate (el) {
  const value = el.value.trim().toLowerCase()
  const index = 0
  const list = el.nextElementSibling
  // const hits = [].map.call(list.children, (el) => el.textContent).filter((item) => item.toLowerCase().indexOf(value) !== -1)
  // console.log(value, list, hits)

  ARIA_LIVE_EL.setAttribute('aria-hidden', false)
  ARIA_LIVE_EL.textContent = `${hits.length} treff`

  el.setAttribute('aria-expanded', true) // should be false if no hits?
  // el.setAttribute('aria-activedescendant')
  list.removeAttribute('hidden')
  list.style.width = `${el.offsetWidth}px`
  list.innerHTML = hits.map(({value}, i) => `<li role="option" aria-selected="${i === index}">${value}</li>`).join('')
}

function show (el) {
  const list = el.nextElementSibling
  const live = ARIA_LIVE_EL

  el.setAttribute('aria-expanded', true)
  live.setAttribute('aria-hidden', false)
  list.removeAttribute('hidden')
  list.style.width = `${el.offsetWidth}px`
}

function hide (el) {
  const list = el.nextElementSibling
  const live = ARIA_LIVE_EL

  el.setAttribute('aria-expanded', false)
  live.setAttribute('aria-hidden', true)
  list.setAttribute('hidden', '')
}

function onKey (el, event) {
  if (event.keyCode === 27) hide(el)
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault()

    const next = event.keyCode === 40
    const list = el.nextElementSibling
    const owns = el.getAttribute('aria-owns')
    const mode = el.getAttribute('aria-autocomplete')
    const active = document.getElementById(el.getAttribute('aria-activedescendant'))
    const to = active && (next? active.nextElementSibling : active.previousElementSibling) || (next? list.firstElementChild : list.lastElementChild);

    [].forEach.call(list.children, (el, index) => {
      el.setAttribute('role', 'option')
      el.setAttribute('id', `${owns}-${index}`)
      el.setAttribute('aria-selected', el === to)
    })

    if (!to) return

    el.setAttribute('aria-activedescendant', to.id)

    // evaluate(el)

    if (mode === 'list') ARIA_LIVE_EL.textContent = to.textContent || 'Tomt tekstfelt'
    else el.value = to.textContent
  }
}

if (typeof document !== 'undefined') {
  ARIA_LIVE_EL = document.createElement('span')
  ARIA_LIVE_EL.setAttribute('aria-hidden', true)
  ARIA_LIVE_EL.setAttribute('aria-live', 'assertive')
  document.documentElement.appendChild(ARIA_LIVE_EL)
}

registerEvent(KEY, 'keydown', onKey)
registerEvent(KEY, 'input', evaluate)
registerEvent(KEY, 'focus', show)
registerEvent(KEY, 'blur', hide)

// var regex = new RegExp(input.query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'gi')
/*const input = components.input(element, false)
input.evaluate()
input.focus()
input.focusLine(3)
input.show()
input.hide()*/
