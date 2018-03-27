import {name, version} from './package.json'
import {queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const UUID_BACKDROP = `${UUID}-backdrop`
const UUID_PREVIOUS = `${UUID}-previous`
const KEYS = {ESC: 27}

const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

const getZIndexOfElement = (element) =>
  Number(window.getComputedStyle(element).getPropertyValue('z-index')) || 0

const getHighestZIndex = (elements = '*') =>
  queryAll(elements).reduce((zIndex, el) =>
    Math.max(zIndex, getZIndexOfElement(el))
  , 0)

// Find the last focused element before opening the dialog
const getLastFocusedElement = (elements = `[${UUID_PREVIOUS}]`) =>
  queryAll(elements).reduce((lastElement, el) => {
    if (!lastElement) return el
    if (Number(el.getAttribute(`${UUID_PREVIOUS}`)) >
      Number(lastElement.getAttribute(`${UUID_PREVIOUS}`))) return el
    return lastElement
  }, null)

const getTopLevelDialog = () =>
  queryAll(`[${UUID}]`).reduce((topDialog, dialog) => {
    if (!topDialog || (
      getZIndexOfElement(dialog) > getZIndexOfElement(topDialog)
    )) topDialog = dialog
    return topDialog
  })

export default function dialog (dialogs, options) {
  return queryAll(dialogs).forEach((dialog) => {
    dialog.setAttribute(UUID, '')
    dialog.setAttribute('aria-modal', true)
    dialog.setAttribute('tabindex', '-1')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-label', options.label)

    toggleDialog(dialog, options.open)
    return dialog
  })
}

addEvent(UUID, 'focus', keepFocus)

addEvent(UUID, 'click', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    const action = el.getAttribute('data-dialog')
    if (action === 'close' && el.parentElement.hasAttribute(UUID)) {
      dialog(el.parentElement, {open: false})
    } else if (action) dialog(action, {open: true})
  }
})

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode === KEYS.ESC) {
    const topDialog = getTopLevelDialog()
    topDialog && dialog(topDialog, {open: false})
  }
})

function toggleDialog (dialog, open = false, overwrite) {
  const isOpen = dialog.getAttribute('open')
  const previousEl = getLastFocusedElement()
  if (isOpen === null && !open) return
  console.log(`will toggle dialog "${isOpen}", "${open}"`, dialog, open)
  // Only dispatch event if there is a diff between previous state and new state
  if ((isOpen !== open && dispatchEvent(dialog, open ? 'dialog.open' : 'dialog.close'))) {
    // console.log('toggle dialog')
    let backdrop = getBackdrop()
    if (!backdrop) backdrop = createBackdrop()
    const highestIndex = previousEl ? Number(previousEl.getAttribute(`${UUID_PREVIOUS}`)) : 0
    // We cannot remove the backdrop if there still exists dialogs
    setupBackdrop(backdrop, highestIndex > 1 || open)
    console.log('open will trigger: ', open ? 'setAttribute' : 'removeAttribute')
    dialog[open ? 'setAttribute' : 'removeAttribute']('open', '')
    if (open) {
      document.activeElement.setAttribute(`${UUID_PREVIOUS}`, highestIndex + 1)
      dialog.style.zIndex = getHighestZIndex() + 1
      const focusable = queryAll(FOCUSABLE_ELEMENTS, dialog)
        .filter((element) => isVisiblyFocusable(element))
      focusable[0].focus()
    } else {
      if (previousEl) {
        previousEl.removeAttribute(`${UUID_PREVIOUS}`)
        previousEl.focus()
      }
      dialog.style.zIndex = 0
    }
  }
}

function setupBackdrop (backdrop, open = false) {
  backdrop.setAttribute(UUID_BACKDROP, '')
  backdrop[open ? 'removeAttribute' : 'setAttribute']('hidden', '')
}

function getBackdrop () {
  return document.querySelector(`[${UUID_BACKDROP}]`)
}

function createBackdrop (open) {
  const backdrop = document.createElement('div')
  // Should probably not add class. But just doing it for now to simplify styling
  backdrop.classList.add('nrk-dialog-backdrop')
  document.documentElement.appendChild(backdrop)
  return backdrop
}

function isVisiblyFocusable (element) {
  return window.getComputedStyle(element).getPropertyValue('visibility') !== 'hidden'
}

function keepFocus (event) {
  let activeDialog = getTopLevelDialog()
  // If no dialog is active, we don't need to do anything
  if (!activeDialog || !activeDialog.hasAttribute('open')) { return }

  // Find all focusable elements and make sure they are not hidden with css
  const focusable = queryAll(FOCUSABLE_ELEMENTS, activeDialog)
    .filter((element) => isVisiblyFocusable(element))

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(event.target)) {
    focusable[0] ? focusable[focusable.length - 1].focus() : focusable[0].focus()
  }
}
