import {name, version} from './package.json'
import coreInput from '../core-input/core-input'
import {IS_IOS, addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {BACKSPACE: 8, LEFT: 37, RIGHT: 39}
const LIVE = document.createElement('span')
LIVE.setAttribute('aria-live', 'assertive')

export default function tags (elements, content) {
  const options = typeof content === 'object' ? content : {content}
  document.body.appendChild(LIVE) // TODO

  return queryAll(elements).map((fieldset) => {
    const input = fieldset.querySelector('input:not([type="checkbox"])')
    const live = fieldset.querySelector('[aria-live="assertive"]')

    fieldset.setAttribute(UUID, '')
    coreInput(input, options)

    return fieldset
  })
}

addEvent(UUID, 'input.select', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      event.preventDefault()
      const button = document.createElement('button')

      button.value = button.textContent = event.detail.value
      button.insertAdjacentHTML('beforeend', '<span aria-label="Fjern"></span>')
      event.target.insertAdjacentElement('beforebegin', button)
      event.target.value = ''
      event.target.focus()
      coreInput(event.target, {open: false})
      LIVE.textContent = `${event.detail.value} lagt til`
    }
  }
})

addEvent(UUID, 'click', (event) => {
  // if (event.target.tabIndex === -1) {
  //   alert('click')
  // }
})

addEvent(UUID, 'keydown', ({target, keyCode}) => {
  const isButton = target.nodeName === 'BUTTON'
  const isInput = target.nodeName === 'INPUT'

  for (let el = target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      if (keyCode === KEYS.LEFT && !target.selectionStart) {
        target.previousElementSibling.focus()
      } else if (keyCode === KEYS.RIGHT && isButton) {
        target.nextElementSibling.focus()
      } else if (keyCode === KEYS.BACKSPACE) {
        if (isButton) {
          const next = target.nextElementSibling
          target.parentElement.removeChild(target)
          next.focus()
        } else if (!target.selectionStart) {
          target.previousElementSibling.focus()
        }
      }
      break
    }
  }
})
