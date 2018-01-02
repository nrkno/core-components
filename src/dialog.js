import {attr, getElements, weakState} from './utils'

let BACKDROP
const KEY = 'dialog-@VERSION'
const KEY_UNIVERSAL = 'data-dialog-xxx'
const FOCUSABLE_ELEMENTS = `
  [tabindex]:not([disabled]),
  button:not([disabled]),
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
  prevActive && prevActive.removeAttribute(KEY_UNIVERSAL)
  el.setAttribute(KEY_UNIVERSAL, '')

  return weakState(el, {
    prevActive,
    focusBeforeModalOpen: document.activeElement
  }).get(el)
}

// Will toggle the open state of the dialog depending on what the fn function
// returns or what (Boolean) value fn has.
const toggle = (el, index, fn, open = true) => {
  const isOpen = Boolean(typeof fn === 'function' ? fn(el, index) : fn) === open

  attr(el, {open: isOpen ? '' : null})

  if (isOpen) {
    el.style.zIndex = getHighestZIndex() + 1
    setActiveStateForElement(el)
    focusOnFirstFocusableElement(el)
    BACKDROP.hidden = false
    // set focus
  } else {
    BACKDROP.hidden = !(weakState().get(el).prevActive)
    el.removeAttribute(KEY_UNIVERSAL)
    if (!BACKDROP.hidden) {
      weakState().get(el).prevActive.setAttribute(KEY_UNIVERSAL, '')
    }
    // Should be able to pop when removing as the last element is the active dialog
    const state = weakState().get(el)
    // Focus on the last focused thing before the dialog modal was opened
    state.focusBeforeModalOpen && state.focusBeforeModalOpen.focus()
    // Delete state for element
    weakState(el, false)
  }
}

const keepFocus = (event) => {
  const activeDialog = getActive()
  // If no dialog is active, we don't need to do anything
  if (!activeDialog) { return }

  const state = weakState().get(activeDialog)
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

export function dialog (selector, options) {
  if (!(this instanceof dialog)) return new dialog(selector, options) //eslint-disable-line

  // Initialize the element with necessary attributes for a dialog
  this.elements = attr(getElements(selector), {
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
  this.elements.forEach((el, index) => toggle(el, index, fn))
  return this
}

export function createBackdrop () {
  attr(BACKDROP = document.createElement('div'), {hidden: true, id: KEY})
  // @todo: General styling. Should be removed?
  BACKDROP.classList.add('nrk-dialog-backdrop')
  document.addEventListener('focus', keepFocus, true)
  document.addEventListener('keydown', exitOnEscape)
  document.documentElement.appendChild(BACKDROP)
}

if (typeof document !== 'undefined' && !document.getElementById(KEY)) {
  createBackdrop()
}
