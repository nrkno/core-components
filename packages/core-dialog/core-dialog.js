import {name, version} from './package.json'
import {queryAll, addEvent, dispatchEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const UUID_BACKDROP = `${UUID}-backdrop`
const KEYS = {ESC: 27}

const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  a:not([disabled]),
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

const getHighestZIndex = (elements = '*') =>
  queryAll(elements).reduce((zIndex, el) =>
    Math.max(zIndex, Number(window.getComputedStyle(el, null).getPropertyValue('z-index')) || 0)
  , 0)

const getHighestPrevious = (elements = `[${UUID}-previous]`) =>
  queryAll(elements).reduce((lastElement, el) => {
    if (!lastElement) return el
    if (Number(el.getAttribute(`${UUID}-previous`)) >
      Number(lastElement.getAttribute(`${UUID}-previous`))) return el
    return lastElement
  }, null)

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

addEvent(UUID, 'focus', (event) => {
  keepFocus(event)
})

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
    queryAll(`[${UUID}]`).forEach((element) => {
      dialog(element, {open: false})
    })
  }
})

function toggleDialog (dialog, open = false) {
  const isOpen = dialog.getAttribute('open')
  const previousEl = getHighestPrevious()
  if (isOpen !== open && dispatchEvent(dialog, open ? 'dialog.open' : 'dialog.close')) {
    let backdrop = getBackdrop()
    if (!backdrop) backdrop = createBackdrop()
    setupBackdrop(backdrop, open)

    dialog[open ? 'setAttribute' : 'removeAttribute']('open', '')
    if (open) {
      const highestIndex = previousEl ? Number(previousEl.getAttribute(`${UUID}-previous`)) : 0
      document.activeElement.setAttribute(`${UUID}-previous`, highestIndex + 1)
      dialog.style.zIndex = getHighestZIndex() + 1
      const focusable = queryAll(FOCUSABLE_ELEMENTS, dialog)
      .filter((element) => isVisiblyFocusable(element))
      focusable[0].focus()
    } else {
      if (previousEl) {
        previousEl.removeAttribute(`${UUID}-previous`)
        previousEl.focus()
      }
      dialog.style.zIndex = 0
    }
  }
}

function setupBackdrop (backdrop, open = false) {
  backdrop.setAttribute(UUID_BACKDROP, '')
  // We cannot remove the backdrop while there are active dialogs, that's why we
  // first check the list before the options
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
  if (window.getComputedStyle(element).getPropertyValue('visibility') === 'hidden') {
    return false
  }
  return true
}

function keepFocus (event) {
  const dialogs = queryAll(`[${UUID}]`)
  let activeDialog = null
  for (let i = 0; i < dialogs.length; i++) {
    if (dialogs[i].hasAttribute('open')) {
      activeDialog = dialogs[i]
      break
    }
  }

  // If no dialog is active, we don't need to do anything
  if (!activeDialog) { return }

  // Find all focusable elements and make sure they are not hidden with css
  const focusable = queryAll(FOCUSABLE_ELEMENTS, activeDialog)
    .filter((element) => isVisiblyFocusable(element))

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(event.target)) {
    focusable[0] ? focusable[focusable.length - 1].focus() : focusable[0].focus()
  }
}

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
