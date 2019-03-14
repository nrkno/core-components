import { name, version } from './package.json'
import { queryAll, addEvent, dispatchEvent } from '../utils'

let OPENER
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ATTR = 'data-core-dialog'
const KEYS = { ESC: 27, TAB: 9 }
const OPENER_ATTR = `${UUID}-opener`
const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

export default function dialog (dialogs, open) {
  const options = typeof open === 'object' ? open : { open }

  return queryAll(dialogs).map((dialog) => {
    const hasFocusable = queryAll(FOCUSABLE_ELEMENTS, dialog).length
    const hasBackdrop = (dialog.nextElementSibling || {}).nodeName === 'BACKDROP'
    const strict = typeof options.strict === 'boolean' ? options.strict : dialog.getAttribute(UUID) === 'true'
    const modal = typeof options.modal === 'boolean' ? options.modal : dialog.getAttribute('aria-modal') !== 'false'
    const label = options.label || dialog.getAttribute('aria-label')

    dialog.setAttribute(UUID, strict)
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', modal)
    if (!hasBackdrop) dialog.insertAdjacentElement('afterend', document.createElement('backdrop'))
    if (!hasFocusable) console.warn(dialog, 'is initialized without focusable elements. Please add [tabindex="-1"] the main element (for instance a <h1>)')
    if (!label) console.warn(dialog, 'is missing the aria-label attribute')
    else dialog.setAttribute('aria-label', label)

    setOpen(dialog, options.open, options.opener)
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
    else if (action) dialog(document.getElementById(action), { open: true, opener: el }) // Target dialog
  }
})

// Ensure focus is set after animations
addEvent(UUID, 'transitionend', ({ target }) => { // NB: target can be document
  if (target.hasAttribute && target.hasAttribute(UUID) && target.hasAttribute('open')) setFocus(target)
  else if (OPENER) setTimeout(() => (OPENER = OPENER && OPENER.focus()), 16) // Move focus after paint
})

addEvent(UUID, 'keydown', (event) => {
  const key = event.keyCode
  const dialog = (key === KEYS.ESC || key === KEYS.TAB) && getTopLevelDialog()

  if (dialog && key === KEYS.TAB) keepFocus(dialog, event)
  if (dialog && key === KEYS.ESC && dialog.getAttribute(UUID) === 'false') {
    if (!event.defaultPrevented) setOpen(dialog, false) // Only close if not prevented
    event.preventDefault() // Prevent leaving maximized window in Safari
  }
})

const getZIndexOfElement = (element) => {
  for (var el = element, zIndex = 1; el; el = el.offsetParent) {
    zIndex += Number(window.getComputedStyle(el).getPropertyValue('z-index')) || 0
  }
  return zIndex
}

// Find the last focused element before opening the dialog
const getLastFocusedElement = () =>
  queryAll(`[${OPENER_ATTR}]`).sort((a, b) =>
    a.getAttribute(OPENER_ATTR) > b.getAttribute(OPENER_ATTR)
  ).pop()

const getTopLevelDialog = () =>
  queryAll(`[${UUID}][open]`).sort((a, b) =>
    getZIndexOfElement(a) > getZIndexOfElement(b)
  ).pop()

function setOpen (dialog, open, opener = document.activeElement) {
  const isOpen = dialog.hasAttribute('open')
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isNative = typeof window.HTMLDialogElement !== 'undefined' && typeof dialog.show === 'function'
  const isUpdate = isOpen === willOpen || dispatchEvent(dialog, 'dialog.toggle', { isOpen, willOpen })
  const nextOpen = isUpdate ? willOpen : dialog.hasAttribute('open') // dispatchEvent can change attributes, so check open again
  const nextBack = nextOpen && dialog.getAttribute('aria-modal') !== 'false'
  const backdrop = dialog.nextElementSibling
  const lastFocus = isUpdate && getLastFocusedElement() // Store before open, as native dialog moves focus to [autofocus]

  if (isNative) {
    dialog.open = !nextOpen // Update to opposite value to ensure show/close can run without error
    dialog[nextOpen ? 'show' : 'close']()
  } else {
    dialog[nextOpen ? 'setAttribute' : 'removeAttribute']('open', '') // Toggle open attribute
    // Trigger repaint to fix IE11 from not closing dialog
    dialog.className = dialog.className // eslint-disable-line
  }
  backdrop[nextBack ? 'removeAttribute' : 'setAttribute']('hidden', '')

  if (isUpdate) {
    const lastIndex = Number(lastFocus && lastFocus.getAttribute(OPENER_ATTR)) || 0
    const topZIndex = Math.min(Math.max(...queryAll('*').map(getZIndexOfElement)), 2000000000) // Avoid overflowing z-index. See techjunkie.com/maximum-z-index-value

    if (nextOpen) {
      dialog.style.zIndex = topZIndex + 2
      dialog.nextElementSibling.style.zIndex = topZIndex + 1
      if (opener && opener.setAttribute) opener.setAttribute(OPENER_ATTR, lastIndex + 1) // Remember opener element
      setFocus(dialog)
    } else if (lastFocus) {
      (OPENER = lastFocus).removeAttribute(OPENER_ATTR) // Focus opener after transition
    }
  }
}

function isVisible (el) {
  return el.clientWidth && el.clientHeight &&
    window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
}

function setFocus (dialog) {
  if (dialog.contains(document.activeElement)) return // Do not move if focus is already inside
  queryAll('[autofocus]', dialog)
    .concat(queryAll(FOCUSABLE_ELEMENTS, dialog))
    .concat(dialog)
    .filter(isVisible)
    .every(el => el.focus()) // Only focuses the first visible element
}

/**
 * keepFocus ensures that the user cannot tab outside an
 * active dialog
 * @param {Element} dialog dialog to keep focus within
 * @param {Object} event keyboard event from keydown
 */
function keepFocus (dialog, event) {
  const focusable = queryAll(FOCUSABLE_ELEMENTS, dialog).filter(isVisible)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge || !dialog.contains(event.target)) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
