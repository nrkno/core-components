import {name, version} from './package.json'
import {addElements, addEvent} from '../utils'

const KEY = `${name}-${version}`  // Unique id of component
let ARIA_OWNS_ID = 0              // Used for generating aria-owns ids
let ARIA_LIVE_EL                  // Element to contain screen reader text


/*addElements(KEY, element)
addEvent(KEY, 'mouseenter', (event) => {
  event.target
});

addEvent(KEY, 'keydown', (event) => {
  const openDialog = [];
  const closeEvent = new CustomEvent('dialog.close', {bubbles: true, cancelable: true})
  const shouldClose = openDialog.dispatchEvent(closeEvent);
});

document.addEventListener('dialog.close', (event) => {
  event.target
});

Store()*/

const OPTIONS = {
  items: 10,
  onHits: () => {},
  sort: (itemA, itemB) => 0,
  item: (item, input) => (item.label || item.value).replace(input.regex, '<b>' + input.query + '</b>'),
  filter: (item, input) => item.value.indexOf(input.query) !== -1,
  value: (item) => ({value: item.value, label: 'Hei'}),
  list: (query) => {
    return ['gmail.com', 'hotmail.com'].map((provider) => {
      return `${query}@${provider}`
    })
  }
}

// var regex = new RegExp(input.query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'gi')

/*const input = new coreComponents.Input(element)
input.evaluate()
input.focus()
input.focusLine(3)
input.show()
input.hide()

document.addEventListener('input.hits', (event) => {
  event.target = coreInput
  event.detail = {store}
  ?.goToNextHit()
})*/

export function input (...args) {
  return new Input(...args)
}

class Input {
  constructor (elements, options = {}) {
    this.elements = getElements(elements)
    this.elements.forEach((el) => {
      const mode = options.complete || el.getAttribute('aria-autocomplete') || 'both'
      const owns = options.owns || el.getAttribute('aria-owns') || `${KEY}-${ARIA_OWNS_ID++}`

      el.setAttribute('role', 'combobox')
      el.setAttribute('autocomplete', false)
      el.setAttribute('aria-expanded', false)
      el.setAttribute('aria-autocomplete', mode) // both = suggest, list = hits
      el.setAttribute('aria-owns', owns)

      if (!getList(el)) { // TODO what about <dataset>
        const list = document.createElement('ul')
        list.id = owns
        list.className = 'nrk-dropdown'
        el.insertAdjacentElement('afterend', list)
      }

      el[KEY] = [].map.call(getList(el).children, (el) => el.innerHTML)
      getList(el).setAttribute('hidden', '')
      getList(el).setAttribute('role', 'listbox')
    })
  }
  value () {

  }
  show () {
    ARIA_LIVE_EL.setAttribute('aria-hidden', false)
    this.elements.forEach((el) => {
      el.setAttribute('aria-expanded', true)
      getList(el).removeAttribute('hidden')
      getList(el).style.width = `${el.offsetWidth}px`
    })
    return this
  }
  hide () {
    ARIA_LIVE_EL.setAttribute('aria-hidden', true)
    this.elements.forEach((el) => {
      el.setAttribute('aria-expanded', false)
      getList(el).setAttribute('hidden', '')
    })
    return this
  }
}

function getList (el) {
  return document.getElementById(el.getAttribute('aria-owns'))
}

function render (el) {
  const value = el.value.trim().toLowerCase()
  const index = 0
  const list = getList(el)
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

function onKey (el, event) {
  if (event.keyCode === 27) input(el).hide()
  if (event.keyCode === 38 || event.keyCode === 40) {
    event.preventDefault()
    const items = [].slice.call(getList(el).children)
    const selected = items.filter((el) => el.getAttribute('aria-selected') === 'true')[0]
    const index = (items.indexOf(selected) + (event.keyCode === 38 ? -1 : 1)) % items.length
    const mode = el.getAttribute('aria-autocomplete')
    const value = (items[index] || el).value
    console.log(index, value)

    render(el)

    if (mode === 'list') LIVE.textContent = value || 'Tomt tekstfelt'
    else el.value = value
  }
}

if (typeof document !== 'undefined') {
  ARIA_LIVE_EL = document.createElement('span')
  ARIA_LIVE_EL.setAttribute('aria-hidden', true)
  ARIA_LIVE_EL.setAttribute('aria-live', 'assertive')
  document.documentElement.appendChild(ARIA_LIVE_EL)
}

addEvent(KEY, 'keydown', onKey)
addEvent(KEY, 'focus', render)
addEvent(KEY, 'input', render)
addEvent(KEY, 'blur', (el) => input(el).hide())
