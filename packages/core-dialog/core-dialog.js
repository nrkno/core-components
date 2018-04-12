import {name, version} from './package.json'
import {IS_BROWSER, queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const PREV = `${UUID}-previous`
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
    const hasBackdrop = (dialog.nextElementSibling || {}).nodeName === 'BACKDROP'

    dialog.setAttribute(UUID, '')
    dialog.setAttribute('tabindex', -1)
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', true)
    dialog.setAttribute('aria-label', options.label || dialog.getAttribute('aria-label'))
    hasBackdrop || dialog.insertAdjacentElement('afterend', document.createElement('backdrop'))

    setOpen(dialog, options.open)
    return dialog
  })
}

addEvent(UUID, 'click', (event) => {
  // This functions handles if the user clicked on a open or close button.
  // We need to do this loop in order for the close button to know which
  // dialog it should close.
  for (let el = event.target, isClose; el; el = el.parentElement) {
    const action = el.getAttribute('data-core-dialog')
    const prev = el.previousElementSibling
    isClose = isClose || action === 'close'

    if (isClose) el.hasAttribute(UUID) && setOpen(el, false)
    else if (prev && prev.hasAttribute(UUID)) setOpen(prev, false) // Click on backdrop
    else if (action) dialog(action, true) // Use dialog (not setOpen) to hangle multiple dialogs
  }
})

addEvent(UUID, 'keydown', (event) => {
  const key = event.keyCode
  const dialog = !event.defaultPrevented && (key === KEYS.ESC || key === KEYS.TAB) && getTopLevelDialog()

  if (dialog && key === KEYS.TAB) keepFocus(dialog, event)
  if (dialog && key === KEYS.ESC) setOpen(dialog, false, event.preventDefault())
})

const getZIndexOfElement = (element) =>
  Number(window.getComputedStyle(element).getPropertyValue('z-index')) || 0

// Find the last focused element before opening the dialog
const getLastFocusedElement = () =>
  queryAll(`[${PREV}]`).sort((a, b) =>
    a.getAttribute(PREV) < b.getAttribute(PREV)
  )[0] || document.body

const getTopLevelDialog = () =>
  queryAll(`[${UUID}][open]`).sort((a, b) =>
    getZIndexOfElement(a) < getZIndexOfElement(b)
  )[0]

function setOpen (dialog, open) {
  const active = document.activeElement // Store activeElement as dialog.show() focuses <body>
  const isOpen = dialog.hasAttribute('open')
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(dialog, 'dialog.toggle', {isOpen, willOpen})
  const nextOpen = isUpdate ? willOpen : dialog.hasAttribute('open') // dispatchEvent can change attributes, so check open again
  const backdrop = dialog.nextElementSibling

  if (typeof window.HTMLDialogElement !== 'undefined') { // Native support
    dialog.open = !nextOpen // Opdate to opposite value to ensure show/close can run without error
    dialog[nextOpen ? 'show' : 'close']()
  } else dialog[nextOpen ? 'setAttribute' : 'removeAttribute']('open', '') // Toggle open attribute
  backdrop[nextOpen ? 'removeAttribute' : 'setAttribute']('hidden', '')

  if (isUpdate) { // Update if no event.preventDefault
    const lastFocus = getLastFocusedElement()
    const lastIndex = Number(lastFocus.getAttribute(PREV)) || 0
    const topZIndex = Math.max(...queryAll('*').map(getZIndexOfElement))

    if (nextOpen) {
      dialog.style.zIndex = topZIndex + 2
      dialog.nextElementSibling.style.zIndex = topZIndex + 1
      active.setAttribute(PREV, lastIndex + 1) // Remember activeElement
      setTimeout(() => (queryFocusable(dialog)[0] || dialog).focus(), 300) // Wait a tick ensures dialog is visible
    } else {
      lastFocus.removeAttribute(PREV)
      lastFocus.focus()
    }
  }
}

function queryFocusable (context) {
  return queryAll(FOCUSABLE_ELEMENTS, context).filter((el) =>
    el.clientWidth &&
    el.clientHeight &&
    window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
  )
}

/**
 * keepFocus ensures that the user cannot tab outside an
 * active dialog
 * @param {Element} dialog dialog to keep focus within
 * @param {Object} event keyboard event from keydown
 */
function keepFocus (dialog, event) {
  const focusable = queryFocusable(dialog)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
