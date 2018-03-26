import {name, version} from './package.json'
import {queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const UUID_BACKDROP = `${UUID}-backdrop`
const UUID_ACTIVE = `${UUID}-active`
const KEYS = {ESC: 27}

const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

const getHighestZIndex = () =>
  queryAll('*').reduce((zIndex, el) =>
    Math.max(zIndex, Number(window.getComputedStyle(el, null).getPropertyValue('z-index')) || 0)
  , 0)

export default function dialog (elements, options) {
  // window[UUID_ACTIVE] is our list of active dialogs.
  // Maybe it should not be bound to version?
  if (typeof window !== 'undefined' && typeof window[UUID_ACTIVE] === 'undefined') {
    window[UUID_ACTIVE] = []
    document.addEventListener('focus', keepFocus, true)
    bindButtonsToOpenDialog()
  }

  let backdrop = getBackdrop()
  if (!backdrop) backdrop = createBackdrop()
  setupBackdrop(backdrop, options.open)

  return queryAll(elements).forEach((element) => {
    setupDialogContainer(element, options.open)
    bindButtonsInDialog(element)
    return element
  })
}

dialog.close = (element) => {
  if (dispatchEvent(element, 'dialog.close')) {
    setupDialogContainer(element, false)
    setupBackdrop(getBackdrop(), false)
  }
}

dialog.open = (element) => {
  if (dispatchEvent(element, 'dialog.open')) {
    setupDialogContainer(element, true)
    setupBackdrop(getBackdrop(), true)
  }
}

function setupDialogContainer (dialog, open = false) {
  dialog.setAttribute(UUID, '')
  dialog.setAttribute('aria-modal', true)
  dialog.setAttribute('tabindex', '-1')
  dialog.setAttribute('role', 'dialog')
  dialog[open ? 'setAttribute' : 'removeAttribute']('open', '')
  if (open) {
    dialog.style.zIndex = getHighestZIndex() + 1
    window[UUID_ACTIVE].push(dialog)
  } else {
    window[UUID_ACTIVE].find((el, idx) => {
      if (el === dialog) window[UUID_ACTIVE].splice(idx, 1)
    })
    dialog.style.zIndex = 0
  }
}

function setupBackdrop (backdrop, open = false) {
  backdrop.setAttribute(UUID_BACKDROP, '')
  // We cannot remove the backdrop while there are active dialogs, that's why we
  // first check the list before the options
  backdrop[window[UUID_ACTIVE].length > 0 || open ? 'removeAttribute' : 'setAttribute']('hidden', '')
}

function getBackdrop () {
  return document.querySelector(`[${UUID_BACKDROP}]`)
}

function createBackdrop (open) {
  const backdrop = document.createElement('div')
  // Should probably not add class. But just doing it for now to simplify styling
  backdrop.classList.add('nrk-dialog-backdrop')
  // document.addEventListener('focus', keepFocus, true)
  // document.addEventListener('keydown', exitOnEscape)
  document.documentElement.appendChild(backdrop)
  return backdrop
}

function isVisiblyFocusable (element) {
  if (window.getComputedStyle(element).getPropertyValue('visibility') === 'hidden') {
    return false
  }
  return true
}

function keepFocus (event) {
  // If no dialog is active, we don't need to do anything
  if (window[UUID_ACTIVE].length === 0) { return }
  const activeDialog = window[UUID_ACTIVE][window[UUID_ACTIVE].length - 1]

  // Find all focusable elements and make sure they are not hidden with css
  const focusable = queryAll(FOCUSABLE_ELEMENTS, activeDialog)
    .filter((element) => isVisiblyFocusable(element))

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(event.target)) {
    focusable[0] ? focusable[focusable.length - 1].focus() : focusable[0].focus()
  }
}

function bindButtonsInDialog (element) {
  queryAll('[data-dialog="close"]', element).forEach((button) => {
    button.addEventListener('click', (event) => dialog.close(element))
  })
}

function bindButtonsToOpenDialog () {
  queryAll('[data-dialog="open"]').forEach((button) => {
    const dialogEl = document.querySelector(`#${button.getAttribute('data-dialog-ref')}`)
    if (dialogEl) {
      button.setAttribute('aria-controls', button.getAttribute('data-dialog-ref'))
      button.addEventListener('click', (event) => dialog.open(dialogEl))
    }
  })
}

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode === KEYS.ESC) {
    queryAll(`[${UUID}]`).forEach((element) => {
      dialog.close(element)
    })
  }
})

/**
 * Desired behavior:
 */
// ============================================
// dialog('.dialog-1', { some: 'options' })
// Example html of how core-dialog can be used
// <button data-dialog="william">Åpne dialog</button>
//  <div class="dialog-1" hidden id="william" role="dialog">
//   <h1>Vil du slette spørsmål?</h1>
//   <div>Some content stuff</div>
//   <div>
//     <!-- Footer layer with actions -->
//     <!-- User must bind button to do dialog.close() -->
//     <button data-dialog="close">Lukk</button>
//   </div>
// </div>

// ============================================
// Example jsx of how core-dialog can be used
// <CoreDialog open={this.props.isOpen}>
//   <h1>Some title stuff</h1>
//   <div>Some content stuff</div>
//   <div>
//     <!-- Footer layer with actions -->
//     <button onClick={this.toggleIsOpen}>Lukk</button>
//   </div>
// </CoreDialog>
