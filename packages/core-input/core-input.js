import {name, version} from './package.json'
import {addEvent, ariaExpand, ariaTarget, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-')         // Strip invalid attribute characters
const KEYS = {ENTER: 13, SHIFT: 16, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}

export default function input (elements, options = {}) {
  return queryAll(elements).map((input) => {
    const listbox = ariaTarget(input, 'owns')
    const mode = options.mode || input.getAttribute('aria-autocomplete') || 'list' // both = suggest, list = hits

    input.setAttribute(UUID, '')
    input.setAttribute('role', 'combobox')
    input.setAttribute('autocomplete', false)
    input.setAttribute('aria-autocomplete', mode)
    listbox.setAttribute('role', 'listbox')
    ariaExpand(input, options.open)
  })
}

addEvent(UUID, 'click', onShow)
addEvent(UUID, 'focus', onShow)
// addEvent(UUID, 'input', console.log)
addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return                    // Let browser do it's thing
  // const control = ariaControl(event.target) || event.target
  // if (control.hasAttribute(UUID)) return onKey(event, control)
})

function ariaList (control) {
  const target = ariaTarget(control)
  queryAll('li', target).forEach((el) => el.setAttribute('role', 'none'))
  return queryAll(':focusable', target).map((el) => {
    // el.setAttribute('role', 'presentation')
    // el.setAttribute('type', 'button')
    el.setAttribute('tabindex', '-1')
    return el
  })
}

function onShow (event) {
  queryAll(`[${UUID}]`).forEach((control) => {
    const target = ariaTarget(control)
    if (event.type === 'click') {
      queryAll(':focusable', target).forEach((item) => {
        if (item.contains(event.target)) {
          control.focus()
          control.value = item.value || item.textContent
          return ariaExpand(control, false)
        }
      })
    }
    ariaExpand(control, control.contains(event.target) || target.contains(event.target))
  })
}

function onKey (event, control) {
  const focus = ariaList(control)
  const index = focus.indexOf(document.activeElement)
  let moveTo

  if (event.keyCode === KEYS.ESC) moveTo = control
  else if (event.keyCode === KEYS.UP) moveTo = focus[index - 1] || focus.pop()
  else if (event.keyCode === KEYS.DOWN) moveTo = focus[index + 1] || focus[0]
  else if (event.keyCode === KEYS.HOME || event.keyCode === KEYS.PAGEUP) moveTo = focus[0]
  else if (event.keyCode === KEYS.END || event.keyCode === KEYS.PAGEDOWN) moveTo = focus.pop()
  else if (event.keyCode !== KEYS.SHIFT && event.keyCode !== KEYS.ENTER) control.focus()

  if (moveTo) {
    event.preventDefault()
    moveTo.focus()
    ariaExpand(control, moveTo !== control)
  }
}
