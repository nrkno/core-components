import { closest, dispatchEvent, toggleAttribute, queryAll } from '../utils'

const NATIVE_FOCUSABLE = 'a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,audio,video,iframe,area,[contenteditable],[draggable]'
// All native focusable plus tabindex with ordered values
const KEYBOARD_FOCUSABLE = `[tabindex]:not([tabindex^="-"]),${NATIVE_FOCUSABLE}`
// All native and programatic
const PROGRAMATIC_FOCUSABLE = `[tabindex],${NATIVE_FOCUSABLE}`
const BACKDROP_OFF = 'off'
const BACKDROP_ON = 'on'
const KEY = {
  TAB: 'Tab',
  ESC_IE: 'Esc',
  ESC: 'Escape'
}

export default class CoreDialog extends HTMLElement {
  static get observedAttributes () { return ['hidden', 'backdrop'] }

  connectedCallback () {
    this._focus = true // Used to check if connectedCallback has run
    this.attributeChangedCallback() // Ensure correct setup backdrop
    this.addEventListener('transitionend', this)
    document.addEventListener('keydown', this)
    document.addEventListener('click', this)
  }

  disconnectedCallback () {
    reFocus(this._focus) // Try moving focus back to <button>
    if (this._generatedBackdrop) this._generatedBackdrop.parentNode.removeChild(this._generatedBackdrop) // Remove generated backdrop element
    this._focus = this._generatedBackdrop = null // Garbage collection
    this.removeEventListener('transitionend', this)
    document.removeEventListener('keydown', this)
    document.removeEventListener('click', this)
  }

  attributeChangedCallback (attr, prev, next) {
    if (this._focus) { // Only trigger after connectedCallback
      const prevBack = attr === 'backdrop' && getBackdrop(this, prev)
      const nextBack = this.backdrop

      // Trigger repaint to fix IE11 from not closing dialog, and allow animating new backdrop
      this.className = this.className // eslint-disable-line
      this.setAttribute('role', 'dialog')
      this.setAttribute('aria-modal', Boolean(nextBack))
      if (prevBack) prevBack.setAttribute('hidden', '') // Hide previous backdrop
      if (nextBack) toggleAttribute(nextBack, 'hidden', this.hidden)

      if (this.hidden) {
        reFocus(this._focus)
      } else {
        let zIndex = window.getComputedStyle(this).getPropertyValue('z-index')
        if ((zIndex === 'auto' || zIndex === '0') && this.style.zIndex === '') { // Place this dialog over uppermost dialog if not controlled in CSS or JS
          const below = queryAll(this.nodeName).filter((el) => el !== nextBack && !this.contains(el) && isVisible(el))
          zIndex = Math.min(Math.max(1, ...below.map(getZIndex)), 2000000000) // Avoid overflowing z-index. See techjunkie.com/maximum-z-index-value
          if (nextBack) nextBack.style.zIndex = zIndex + 1
          this.style.zIndex = zIndex + 2
        }
        this._focus = document.activeElement || document.body // Remember last focused element
        setTimeout(() => setInitialFocus(this)) // Move focus after paint (helps iOS and react portals)
      }
      // React might re-mount the DOM, so make sure prev and next did actually change
      if (attr === 'hidden' && next !== prev) dispatchEvent(this, 'dialog.toggle')
    }
  }

  handleEvent (event) {
    if (event.defaultPrevented) return
    const { type, key, target } = event

    if (type === 'transitionend' && target === this && !this.hidden) setInitialFocus(this) // Move focus after transition
    else if (type === 'click') {
      if (target === this.backdrop && !this.strict) return this.close() // Click on backdrop
      const button = closest(target, 'button')
      const action = button && (button.getAttribute('data-for') || button.getAttribute('for'))

      if (action === 'close' && closest(target, this.nodeName) === this) {
        this.close()
      } else if (action === this.id) {
        this.show()
      }
    } else if (type === 'keydown' && (key === KEY.TAB || key === KEY.ESC || key === KEY.ESC_IE) && !this.hidden) {
      const topDialog = queryAll(`${this.nodeName}:not([hidden])`).sort((a, b) => getZIndex(a) - getZIndex(b)).pop()
      if (topDialog !== this) return // Event target can be <body> when dialog has no focused element
      if (key === KEY.TAB) keepFocus(this, event) // TAB
      if ((key === KEY.ESC || key === KEY.ESC_IE) && !this.strict) { // ESC
        event.preventDefault() // Prevent leaving maximized window in Safari
        this.close()
      }
    }
  }

  close () { this.hidden = true }

  show () { this.hidden = false }

  get open () { return !this.hidden }

  set open (val) { this.hidden = !val }

  get strict () { return this.hasAttribute('strict') }

  set strict (val) { toggleAttribute(this, 'strict', val) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }

  set hidden (val) { toggleAttribute(this, 'hidden', val) }

  get backdrop () { return getBackdrop(this, this.getAttribute('backdrop')) }

  set backdrop (val) { typeof val === 'string' ? this.setAttribute('backdrop', val) : this.removeAttribute('backdrop') }
}

function getBackdrop (self, attr) {
  const next = self.nextElementSibling
  const attrLower = String(attr).toLowerCase()
  if (!self.parentNode || attrLower === BACKDROP_OFF) return false
  if (attr && attrLower !== BACKDROP_ON) {
    return document.getElementById(attr) ||
      console.warn(self, `cannot find backdrop element with id: ${attr}`) ||
      false
  }
  if (next && next.nodeName === 'BACKDROP') return next
  self._generatedBackdrop = document.createElement('backdrop')
  return self.insertAdjacentElement('afterend', self._generatedBackdrop)
}

function isVisible (el) {
  return el.offsetWidth && el.offsetHeight && window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
}

function getZIndex (element) {
  let zIndex = 1
  for (let el = element; el; el = el.offsetParent) {
    zIndex += Number(window.getComputedStyle(el).getPropertyValue('z-index')) || 0
  }
  return zIndex
}

function reFocus (el) {
  setTimeout(() => { // Move focus after paint (helps iOS and react portals)
    try { el.focus() } catch (err) {} // Element might have been removed
  })
}

function setInitialFocus (el) {
  if (el.contains(document.activeElement) || !isVisible(el)) return // Do not move if focus is already inside
  const focusable = queryAll('[autofocus]', el).concat(queryAll(PROGRAMATIC_FOCUSABLE, el)).filter(isVisible)[0]
  try { focusable.focus() } catch (err) { console.warn(el, 'is initialized without focusable elements. Please add [tabindex="-1"] the main element (for instance a <h1>)') }
}

function keepFocus (el, event) {
  const focusable = queryAll(KEYBOARD_FOCUSABLE, el).filter(isVisible)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge || !el.contains(event.target)) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
