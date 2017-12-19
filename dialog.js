import {getElements, weakState, getWeakState} from './utils'

// First attempt to focus on the property with autofocus.
// If no such element exists, set focus to first focusable element.

const KEY = 'nrk-dialog'
const KEY_BACKDROP = 'nrk-dialog-backdrop'
const FOCUSABLE_ELEMENTS = [
  '[tabindex]:not([disabled])',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])'
]

// The stack of active dialogs where the last element should be the dialog
// that is on "top".
const ACTIVE_DIALOG_STACK = []

const setBackdrop = () => {
  // If a backdrop already exists we do not want to create another one
  if (document.querySelector(`.${KEY_BACKDROP}`)) { return }

  const backdrop = document.createElement('div')
  backdrop.setAttribute('aria-hidden', true)
  backdrop.classList.add(KEY_BACKDROP)
  document.body.appendChild(backdrop)
}

const removeBackdrop = () => {
  const backdrop = document.querySelector(`.${KEY_BACKDROP}`)
  backdrop && backdrop.parentElement.removeChild(backdrop)
}

// Attempt to focus on an autofocus target first. If none exists we will focus
// on the first focusable element.
const focusOnFirstFocusableElement = (el) => {
  const autofocusEl = el.querySelector('[autofocus]:not([disabled])')
  const { firstFocusableElement } = getWeakState(el)
  if (autofocusEl) {
    autofocusEl.focus()
    return
  }
  firstFocusableElement && firstFocusableElement.focus()
}

const findFirstAndLastFocusableElements = (el) => {
  const targets = el.querySelectorAll(FOCUSABLE_ELEMENTS.join(', '))
  return {
    firstFocusableElement: targets[0],
    lastFocusableElement: targets[targets.length - 1]
  }
}

const setActiveStateForElement = (el) => {
  return weakState(el, {
    focusBeforeModalOpen: document.activeElement,
    ...findFirstAndLastFocusableElements(el)
  })
}

// Will toggle the open state of the dialog depending on what the fn function
// returns or what (Boolean) value fn has.
const toggle = (el, index, fn, invert) => {
  let active = typeof fn === 'function' ? fn(el, index) : Boolean(fn)
  active = invert ? !active : active

  active ? el.setAttribute('open', '') : el.removeAttribute('open')
  active ? setBackdrop() : removeBackdrop()

  if (active) {
    ACTIVE_DIALOG_STACK.indexOf(el) >= 0 || ACTIVE_DIALOG_STACK.push(el)
    setActiveStateForElement(el)
    focusOnFirstFocusableElement(el)
  } else {
    // Should be able to pop when removing as the last element is the active dialog
    ACTIVE_DIALOG_STACK.pop()
    const state = getWeakState(el)
    // Focus on the last focused thing before the dialog modal was opened
    state.focusBeforeModalOpen && state.focusBeforeModalOpen.focus()
    // Delete state for element
    weakState(el)
  }
}

const keepFocus = (e) => {
  const activeDialog = ACTIVE_DIALOG_STACK[ACTIVE_DIALOG_STACK.length - 1]
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) { return }

  const state = getWeakState(activeDialog)
  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(e.target)) {
    state.activeElement === state.lastFocusableElement ? state.firstFocusableElement.focus() : state.lastFocusableElement.focus()
  } else {
    state.activeElement = e.target
  }
}

const exitOnEscape = (e) => {
  if (e.keyCode === 27) {
    const activeDialog = ACTIVE_DIALOG_STACK.pop()
    activeDialog && window.test.dialog(activeDialog).close()
  }
}

// Initialize the element with necessary attributes for a dialog
const initialize = (el, options) => {
  el.hasAttribute('role') || el.setAttribute('role', 'dialog')
  el.hasAttribute('tabindex') || el.setAttribute('tabindex', '-1')
  el.hasAttribute('aria-modal') || el.setAttribute('aria-modal', 'true')
}

function dialog (selector, options) {
  this.elements = getElements(selector)
  this.elements.forEach((el) => initialize(el, options))

  /** -------- PUBLIC FUNCTIONS -------- **/
  this.open = (fn = true) => {
    this.elements.forEach((el, idx) => toggle(el, idx, fn))
    return this
  }

  this.close = (fn = false) => {
    this.elements.forEach((el, idx) => toggle(el, idx, fn))
    return this
  }

  return this
}

// @TODO TEMPORARY CODE. Doing the same as details just to make sure this code is
// not called multiple times
if (typeof document !== 'undefined' && !document.getElementById(`${KEY}-style`)) {
  document.head.insertAdjacentHTML('afterbegin',            // Insert css in top for easy overwriting
    `<style id="${KEY}-style">`)
  document.addEventListener('focusin', keepFocus)
  document.addEventListener('keydown', exitOnEscape)
}

window.test = {}
window.test.dialog = dialog
module.exports = dialog
// dialog('dette er selected').open('test')

// function Dialog (el, type) {
//   this.open = false
//   this.el = el
//   this.backdrop = null
//   this.keepFocusListener = this.keepFocus.bind(this)
//   this.focusBeforeModalOpen = null
//   this.activeElement = null
//   this.firstFocusableElement = null
//   this.lastFocusableElement = null

//   this.el.show = this.show.bind(this)
//   this.el.showModal = this.showModal.bind(this)
//   this.el.close = this.close.bind(this)
//   document.addEventListener('keydown', this.exitOnEscape.bind(this))
// }

// Dialog.prototype.show = function () {
//   this.el.hasAttribute('open') || this.setOpen(true)
//   this.focusOnFirstFocusableElement()
// }

// Dialog.prototype.showModal = function () {
//   if (!this.el.hasAttribute('open')) {
//     this.focusBeforeModalOpen = document.activeElement
//     this.setBackdrop()
//     this.setOpen(true)
//     this.positionModal()
//     this.focusOnFirstFocusableElement()
//     document.addEventListener('focusin', this.keepFocusListener)
//   }
// }

// Dialog.prototype.close = function () {
//   this.setOpen(false)
//   this.removeBackdrop()
//   // Focus on the element that was last focused before opening the modal
//   this.focusBeforeModalOpen.focus()
// }

// Dialog.prototype.setBackdrop = function () {
//   this.backdrop = document.createElement('div')
//   this.backdrop.setAttribute('aria-hidden', true)
//   this.backdrop.classList.add('core-dialog-backdrop')
//   // this.el.parentElement.insertBefore(this.backdrop, this.el)
//   document.body.appendChild(this.backdrop)
//   this.backdrop.addEventListener('click', this.activateOverlayBlocking.bind(this))
// }

// Dialog.prototype.removeBackdrop = function () {
//   if (this.backdrop) {
//     this.backdrop.parentElement.removeChild(this.backdrop)
//   }
// }

// Dialog.prototype.activateOverlayBlocking = function (e) {
//   e.stopPropagation()
//   e.preventDefault()
// }

// Dialog.prototype.positionModal = function () {
//   this.el.style.top = Math.round((window.innerHeight - this.el.clientHeight) / 2) + 'px'
//   this.el.style.left = Math.round((window.innerWidth - this.el.clientWidth) / 2) + 'px'
// }

// Dialog.prototype.setOpen = function (value) {
//   if (value) {
//     this.el.hasAttribute('open') || this.el.setAttribute('open', '')
//   } else {
//     this.el.removeAttribute('open')
//   }
// }

// Dialog.prototype.exitOnEscape = function (e) {
//   if (e.keyCode === 27 && this.el.hasAttribute('open')) {
//     this.close()
//   }
// }

// Dialog.prototype.focusOnFirstFocusableElement = function () {
//   const focusableElements = ['[autofocus]', '[tabindex]', 'button', 'input', 'select', 'textarea']
//   const query = focusableElements.map(function (el) {
//     return `${el}:not([disabled])`
//   })
//   let targets = this.el.querySelectorAll(query.join(', '))
//   this.firstFocusableElement = targets[0]
//   this.lastFocusableElement = targets[targets.length - 1]
//   targets && targets[0].focus()
// }

// Dialog.prototype.keepFocus = function (e) {
//   // If focus moves us outside the dialog, we need to refocus to inside the dialog
//   if (!this.el.contains(e.target)) {
//     this.activeElement === this.lastFocusableElement ? this.firstFocusableElement.focus() : this.lastFocusableElement.focus()
//   } else {
//     this.activeElement = document.activeElement
//   }
// }

// module.exports = Dialog
