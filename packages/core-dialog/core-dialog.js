import {name, version} from './package.json'
import {queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ATTR = 'data-core-dialog'
const KEYS = {ESC: 27, TAB: 9}
const FOCUS_PREVIOUS = `${UUID}-previous`
const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

export default function dialog (dialogs, open) {
  const options = typeof open === 'object' ? open : {open}

  return queryAll(dialogs).map((dialog) => {
    const hasBackdrop = (dialog.nextElementSibling || {}).nodeName === 'BACKDROP'
    const isStrict = typeof options.strict === 'boolean' ? options.strict : dialog.getAttribute(UUID) === 'true'

    dialog.setAttribute(UUID, isStrict)
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
    const action = el.getAttribute(ATTR)
    const prev = el.previousElementSibling
    const isBackdrop = prev && prev.getAttribute(UUID) === 'false' && (el = prev)
    isClose = isClose || isBackdrop || action === 'close'

    if (isClose) el.hasAttribute(UUID) && setOpen(el, false)
    else if (action) dialog(document.getElementById(action), true) // Target dialog
  }
})

// Ensure focus is set after animations
addEvent(UUID, 'transitionend', ({target}) => {
  if (target.hasAttribute(UUID) && target.hasAttribute('open')) setFocus(target)
})

addEvent(UUID, 'keydown', (event) => {
  const key = event.keyCode
  const dialog = !event.defaultPrevented && (key === KEYS.ESC || key === KEYS.TAB) && getTopLevelDialog()
  const isClose = dialog && dialog.getAttribute(UUID) === 'false'

  if (dialog && key === KEYS.TAB) keepFocus(dialog, event)
  if (isClose && key === KEYS.ESC) setOpen(dialog, false, event.preventDefault())
})

const getZIndexOfElement = (element) => {
  for (var el = element, zIndex = 1; el; el = el.offsetParent) {
    zIndex += Number(window.getComputedStyle(el).getPropertyValue('z-index')) || 0
  }
  return zIndex
}

// Find the last focused element before opening the dialog
const getLastFocusedElement = () =>
  queryAll(`[${FOCUS_PREVIOUS}]`).sort((a, b) =>
    a.getAttribute(FOCUS_PREVIOUS) > b.getAttribute(FOCUS_PREVIOUS)
  ).pop() || document.body

const getTopLevelDialog = () =>
  queryAll(`[${UUID}][open]`).sort((a, b) =>
    getZIndexOfElement(a) > getZIndexOfElement(b)
  ).pop()

function setOpen (dialog, open) {
  const active = document.activeElement // Store activeElement as dialog.show() focuses <body>
  const isOpen = dialog.hasAttribute('open')
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(dialog, 'dialog.toggle', {isOpen, willOpen})
  const nextOpen = isUpdate ? willOpen : dialog.hasAttribute('open') // dispatchEvent can change attributes, so check open again
  const backdrop = dialog.nextElementSibling

  if (typeof window.HTMLDialogElement !== 'undefined' && typeof dialog.show === 'function') { // Native support
    dialog.open = !nextOpen // Update to opposite value to ensure show/close can run without error
    dialog[nextOpen ? 'show' : 'close']()
  } else dialog[nextOpen ? 'setAttribute' : 'removeAttribute']('open', '') // Toggle open attribute
  backdrop[nextOpen ? 'removeAttribute' : 'setAttribute']('hidden', '')

  if (isUpdate) { // Update if no event.preventDefault
    const lastFocus = getLastFocusedElement()
    const lastIndex = Number(lastFocus.getAttribute(FOCUS_PREVIOUS)) || 0
    const topZIndex = Math.max(...queryAll('*').map(getZIndexOfElement))

    if (nextOpen) {
      dialog.style.zIndex = topZIndex + 2
      dialog.nextElementSibling.style.zIndex = topZIndex + 1
      active.setAttribute(FOCUS_PREVIOUS, lastIndex + 1) // Remember activeElement
      setFocus(dialog)
    } else {
      lastFocus.removeAttribute(FOCUS_PREVIOUS)
      lastFocus.focus()
    }
  }
}

function getVisibleElements (elements) {
  return elements.filter((el) =>
    el.clientWidth &&
    el.clientHeight &&
    window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
  )
}

function queryFocusable (context) {
  return getVisibleElements(queryAll(FOCUSABLE_ELEMENTS, context))
}

function setFocus (dialog) {
  const autofocusElements = getVisibleElements(queryAll('[autofocus]', dialog))[0]
  if (autofocusElements) return autofocusElements.focus();
  (queryFocusable(dialog)[0] || dialog).focus()
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
  if (event.target === onEdge || !dialog.contains(event.target)) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
