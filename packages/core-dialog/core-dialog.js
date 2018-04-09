import {name, version} from './package.json'
import {IS_BROWSER, queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const BACKDROP = IS_BROWSER && document.createElement('backdrop')
const PREVIOUS = `${UUID}-previous`
const KEYS = {ESC: 27, TAB: 9}

const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

export default function dialog (dialogs, open) {
  const options = typeof open === 'object' ? open : {open}

  return queryAll(dialogs).forEach((dialog) => {
    dialog.setAttribute(UUID, '')
    dialog.setAttribute('aria-modal', true)
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-label', dialog.getAttribute('aria-label') || options.label)

    toggleDialog(dialog, options.open)
    return dialog
  })
}

addEvent(UUID, 'click', (event) => {
  for (let el = event.target, isClose; el; el = el.parentElement) {
    const action = el.getAttribute('data-core-dialog')
    isClose = isClose || action === 'close'
    if (isClose) el.hasAttribute(UUID) && dialog(el, false)
    else if (action) dialog(action, true)
  }
})

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode === KEYS.TAB) keepFocus(event)
  if (event.keyCode === KEYS.ESC) dialog(getTopLevelDialog(), false)
})

const getZIndexOfElement = (element) =>
  Number(window.getComputedStyle(element).getPropertyValue('z-index')) || 0

// Find the last focused element before opening the dialog
const getLastFocusedElement = () =>
  queryAll(`[${PREVIOUS}]`).sort((a, b) =>
    a.getAttribute(PREVIOUS) < b.getAttribute(PREVIOUS)
  )[0] || document.body

const getTopLevelDialog = () =>
  queryAll(`[${UUID}][open]`).sort((a, b) =>
    getZIndexOfElement(a) < getZIndexOfElement(b)
  )[0]

function toggleDialog (dialog, open) {
  const last = getLastFocusedElement()
  const isOpen = toggleOpen(dialog, open)
  const lastIndex = Number(last.getAttribute(`${PREVIOUS}`)) || 0
  const topZIndex = Math.max(...queryAll('*').map(getZIndexOfElement))

  if (isOpen) {
    const focusable = queryFocusable(dialog)[0]
    dialog.insertAdjacentElement('afterend', BACKDROP)
    document.activeElement.setAttribute(`${PREVIOUS}`, lastIndex + 1)
    dialog.style.zIndex = topZIndex + 1
    focusable && focusable.focus()

    BACKDROP.removeAttribute('hidden')
  } else {
    if (!getTopLevelDialog()) BACKDROP.setAttribute('hidden', '')
    last.removeAttribute(`${PREVIOUS}`)
    last.focus()
  }
}

function toggleOpen (dialog, open) {
  const prevState = dialog.hasAttribute('open')
  const nextState = typeof open === 'boolean' ? open : (open === 'toggle' ? !prevState : prevState)
  const canUpdate = prevState === nextState || dispatchEvent(dialog, 'dialog.toggle', {isOpen: prevState})

  if (canUpdate) dialog[nextState ? 'setAttribute' : 'removeAttribute']('open', '') // Toggle open attribute

  return nextState
}

function queryFocusable (context) {
  return queryAll(FOCUSABLE_ELEMENTS, context).filter((el) =>
    el.clientWidth &&
    el.clientHeight &&
    window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
  )
}

function keepFocus (event) {
  const activeDialog = getTopLevelDialog()
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) return

  // Find all focusable elements and make sure they are not hidden with css
  const focusable = queryFocusable(activeDialog)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
