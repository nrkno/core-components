import {attr, getElements, weakState, getWeakState} from './utils'

// First attempt to focus on the property with autofocus.
// If no such element exists, set focus to first focusable element.

let BACKDROP
const KEY = 'dialog-@VERSION'
const KEY_UNIVERSAL = 'data-dialog-xxx'
const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  button:not([disabled])',
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled])`

// Attempt to focus on an autofocus target first. If none exists we will focus
// on the first focusable element.
const focusOnFirstFocusableElement = (el) => {
  const autofocusElement = el.querySelector('[autofocus]:not([disabled])')
  const focusableElement = el.querySelector(FOCUSABLE_ELEMENTS)
  ;(autofocusElement || focusableElement || el).focus()
}

const getHighestZIndex = () =>
  getElements('*').reduce((zIndex, el) =>
    Math.max(zIndex, Number(window.getComputedStyle(el, null).getPropertyValue('z-index')) || 0)
  , 0)

const getActive = () => document.querySelector(`[${KEY_UNIVERSAL}]`)

const setActiveStateForElement = (el) => {
  const prevActive = getActive()
  attr(prevActive, {KEY_UNIVERSAL: null})
  el.setAttribute(KEY_UNIVERSAL, '')

  return weakState(el, {
    prevActive,
    focusBeforeModalOpen: document.activeElement
  })
}

// Will toggle the open state of the dialog depending on what the fn function
// returns or what (Boolean) value fn has.
const toggle = (el, index, fn, open = true) => {
  const active = Boolean(typeof fn === 'function' ? fn(el, index) : fn) === open

  attr(el, {open: active || null})
  BACKDROP.hidden = Boolean(weakState(el).get('prevActive'))

  if (active) {
    el.style.zIndex = getHighestZIndex() + 1
    setActiveStateForElement(el)
    focusOnFirstFocusableElement(el)
    // set focus
  } else {
    // Should be able to pop when removing as the last element is the active dialog
    const state = getWeakState(el)
    // Focus on the last focused thing before the dialog modal was opened
    state.focusBeforeModalOpen && state.focusBeforeModalOpen.focus()
    // Delete state for element
    weakState(el)
  }
}

const keepFocus = (event) => {
  const activeDialog = getActive()
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) { return }

  const state = getWeakState(activeDialog)
  const focusable = activeDialog.querySelectorAll(FOCUSABLE_ELEMENTS)

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (!activeDialog.contains(event.target)) {
    state.activeElement === focusable[0] ? focusable[focusable.length - 1].focus() : focusable[0].focus()
  } else {
    state.activeElement = event.target
  }
}

const exitOnEscape = (event) => {
  if (event.keyCode === 27) dialog(getActive()).close()
}

function dialog (selector, options) {
  if (!(this instanceof dialog)) return new dialog(selector, options) //eslint-disable-line

  // Initialize the element with necessary attributes for a dialog
  this.elements = attr(this.elements, {
    role: 'dialog',
    tabindex: -1,
    'aria-modal': true
  })

  return this
}

dialog.prototype.open = function (fn = true) {
  this.elements.forEach((el, index) => toggle(el, index, fn))
  return this
}

dialog.prototype.close = function (fn = false) {
  this.elements.forEach((el, index) => toggle(el, index, fn, false))
  return this
}

// @TODO Should I ensure this is not called everytime this component is required?
// The functions are scoped to the data accessible to the component, which means
// that two separate components technically don't interfere with each other
if (typeof document !== 'undefined' && !document.getElementById(KEY)) {
  attr(BACKDROP = document.createElement('div'), {hidden: true, id: KEY})
  document.addEventListener('focus', keepFocus, true)
  document.addEventListener('keydown', exitOnEscape)
  document.documentElement.appendChild(BACKDROP)
}

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
