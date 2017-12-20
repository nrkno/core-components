import {attr} from './utils'

const KEY = 'input-@VERSION'
let LIST // Element to contain list
let LIVE // Element to contain screen reader text

function render (elem) {
  const state = elem[KEY]
  const value = state.value.trim().toLowerCase()
  state.hits = state.items.filter((item) => item.value.toLowerCase().indexOf(value) !== -1)

  attr(LIVE, {'aria-hidden': false})
  attr(LIST, {'hidden': state.hits.length ? null : true})
  attr(elem, {'aria-expanded': Boolean(state.hits.length)})

  LIST.style.width = `${elem.offsetWidth}px`
  LIST.innerHTML = state.hits.map(({value}, i) =>
    `<li role="option" aria-selected="${i === state.index}">${value}</li>`
  ).join('')
}

function onFocus (event) {
  const elem = event.target
  const controls = elem.getAttribute(`data-${KEY}`)

  if (controls && !elem[KEY]) {
    const mode = elem.getAttribute(`data-${KEY}-mode`) || 'suggestions'
    const items = [].map.call(document.querySelectorAll(`#${controls} > *`), ({value}) => ({value}))
    const parent = elem.parentElement

    attr(elem, {
      'role': 'combobox',
      'autocomplete': 'off',
      'aria-controls': `${KEY}-${controls}`,
      'aria-autocomplete': 'list',
      'aria-haspopup': true,
      'aria-expanded': false
    })

    parent.className = parent.className.split(' ').concat(KEY).join(' ')
    elem[KEY] = {items, mode, list: elem.nextElementSibling} // TODO: list
  }

  if (controls) {
    LIST.id = `${KEY}-${controls}`
    elem.insertAdjacentElement('afterend', LIST)
    onInput(event)
  }
}

function onBlur ({target}) {
  if (target[KEY]) {
    attr(LIST, 'hidden', 'hidden')
    attr(LIVE, {'aria-hidden': 'true', 'aria-live': 'polite'})
  }
}

function onInput (event) {
  const elem = event.target
  const state = elem[KEY]

  if (state) {
    state.index = -1
    state.value = elem.value
    render(elem)
    LIVE.textContent = `${state.hits.length} treff`
  }
}

function onKey (event) {
  if (event.target[KEY]) {
    const elem = event.target
    const state = elem[KEY]
    if (event.keyCode === 27) onBlur(event)
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault()
      const hits = [].slice.call(LIST.children)
      const selected = hits.filter((el) => el.getAttribute('aria-selected') === 'true')[0]
      state.index = (hits.indexOf(selected) + (event.keyCode === 38 ? -1 : 1)) % hits.length
      LIVE.setAttribute('aria-live', 'assertive')

      render(event.target)
      const value = (state.hits[state.index] || state).value
      if (state.mode === 'results') {
        LIVE.textContent = value || 'Tomt tekstfelt'
      } else {
        elem.value = value
      }
    }
  }
}

if (typeof document !== 'undefined') {
  attr(LIST = document.createElement('ul'), {role: 'listbox'})
  attr(LIVE = document.createElement('span'), {'aria-hidden': 'true', 'aria-live': 'polite'})

  // document.addEventListener('keydown', onKey)
  // document.addEventListener('input', onInput)
  // document.addEventListener('focus', onFocus, true) // Use capture to ensure event bubling
  // document.addEventListener('blur', onBlur, true)   // Use capture to ensure event bubling
  // document.documentElement.appendChild(LIVE)
}

export function input () {
  console.log('input')
}
