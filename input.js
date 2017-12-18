import {setAttributes} from './utils'

const COMPONENT_ID = 'core-input'
let LIST // Element to contain list
let LIVE // Element to contain screen reader text

/**
* attr (utility)
* @param  {Element|String} elem Element or nodeName (will createElement)
* @param  {String} prop Accepts ID strings, gfx-urls or derviate-urls
* @return {Element} Element with manipulated attributes
*/
function attr (elem, prop, value) {
  if (typeof prop === 'object') Object.keys(prop).forEach((k) => attr(elem, k, prop[k]))
  else if (value === null) elem.removeAttribute(prop)
  else if (prop) elem.setAttribute(prop, value)
  return elem
}

function render (elem) {
  const state = elem[COMPONENT_ID]
  const value = state.value.trim().toLowerCase()
  state.hits = state.items.filter((item) => item.value.toLowerCase().indexOf(value) !== -1)

  setAttributes(LIVE, {'aria-hidden': false})
  setAttributes(LIST, {'hidden': state.hits.length ? null : true})
  setAttributes(elem, {'aria-expanded': Boolean(state.hits.length)})

  LIST.style.width = `${elem.offsetWidth}px`
  LIST.innerHTML = state.hits.map(({value}, i) =>
    `<li role="option" aria-selected="${i === state.index}">${value}</li>`
  ).join('')
}

function onFocus (event) {
  const elem = event.target
  const controls = elem.getAttribute(`data-${COMPONENT_ID}`)

  if (controls && !elem[COMPONENT_ID]) {
    const mode = elem.getAttribute(`data-${COMPONENT_ID}-mode`) || 'suggestions'
    const items = [].map.call(document.querySelectorAll(`#${controls} > *`), ({value}) => ({value}))
    const parent = elem.parentElement

    attr(elem, {
      'role': 'combobox',
      'autocomplete': 'off',
      'aria-controls': `${COMPONENT_ID}-${controls}`,
      'aria-autocomplete': 'list',
      'aria-haspopup': true,
      'aria-expanded': false
    })

    parent.className = parent.className.split(' ').concat(COMPONENT_ID).join(' ')
    elem[COMPONENT_ID] = {items, mode, list: elem.nextElementSibling} // TODO: list
  }

  if (controls) {
    LIST.id = `${COMPONENT_ID}-${controls}`
    elem.insertAdjacentElement('afterend', LIST)
    onInput(event)
  }
}

function onBlur ({target}) {
  if (target[COMPONENT_ID]) {
    attr(LIST, 'hidden', 'hidden')
    attr(LIVE, {'aria-hidden': 'true', 'aria-live': 'polite'})
  }
}

function onInput (event) {
  const elem = event.target
  const state = elem[COMPONENT_ID]

  if (state) {
    state.index = -1
    state.value = elem.value
    render(elem)
    LIVE.textContent = `${state.hits.length} treff`
  }
}

function onKey (event) {
  if (event.target[COMPONENT_ID]) {
    const elem = event.target
    const state = elem[COMPONENT_ID]
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

if (typeof document !== 'undefined' && !document.getElementById(COMPONENT_ID)) {
  LIST = setAttributes(document.createElement('ul'), {role: 'listbox'})
  LIVE = setAttributes(document.createElement('span'), {'aria-hidden': 'true', 'aria-live': 'polite', id: COMPONENT_ID})

  document.addEventListener('keydown', onKey)
  document.addEventListener('input', onInput)
  document.addEventListener('focus', onFocus, true) // Use capture to ensure event bubling
  document.addEventListener('blur', onBlur, true)   // Use capture to ensure event bubling
  document.documentElement.appendChild(LIVE)
}

module.exports = () => console.log('input')
