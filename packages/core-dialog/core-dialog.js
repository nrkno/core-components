import { closest, dispatchEvent, toggleAttribute, queryAll } from '../utils'

const FOCUSABLE = '[tabindex],a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

export default class CoreDialog extends HTMLElement {
  static get observedAttributes () { return ['hidden', 'backdrop'] }

  connectedCallback () {
    this._focus = true // Used to check if connectedCallback has run
    this._autoBackdrop = null
    this.attributeChangedCallback() // Ensure correct setup backdrop
    this.addEventListener('transitionend', this)
    document.addEventListener('keydown', this)
    document.addEventListener('click', this)
  }

  disconnectedCallback () {
    reFocus(this._focus) // Try moving focus back to <button>
    if (this._autoBackdrop) this._autoBackdrop.parentNode.removeChild(this._autoBackdrop) // Remove generated backdrop element
    this._focus = this._autoBackdrop = null // Garbage collection
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
        setTimeout(() => setFocus(this)) // Move focus after paint (helps iOS and react portals)
      }
      // React might re-mount the DOM, so make sure prev and next did actually change
      if (attr === 'hidden' && next !== prev) dispatchEvent(this, 'dialog.toggle')
    }
  }

  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'transitionend' && event.target === this && !this.hidden) setFocus(this) // Move focus after transition
    else if (event.type === 'click') {
      if (event.target === this.backdrop && !this.strict) return this.close() // Click on backdrop
      const button = closest(event.target, 'button')
      const action = button && (button.getAttribute('data-for') || button.getAttribute('for'))

      if (action === 'close' && closest(event.target, this.nodeName) === this) this.close()
      else if (action === this.id) {
        this.show()
      }
    } else if (event.type === 'keydown' && (event.keyCode === 9 || event.keyCode === 27) && !this.hidden) {
      const topDialog = queryAll(`${this.nodeName}:not([hidden])`).sort((a, b) => getZIndex(a) - getZIndex(b)).pop()
      if (topDialog !== this) return // event.target can be <body> when dialog has no focused element
      if (event.keyCode === 9) keepFocus(this, event) // TAB
      if (event.keyCode === 27 && !this.strict) { // ESC
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

  set backdrop (val) { this.setAttribute('backdrop', val || 'false') }
}

function getBackdrop (el, attr) {
  const next = el.nextElementSibling
  if (!el.parentNode || attr === 'false') return false
  if (attr && attr !== 'true') return document.getElementById(attr) || false
  if (next && next.nodeName === 'BACKDROP') return next
  el._autoBackdrop = document.createElement('backdrop')
  return el.insertAdjacentElement('afterend', el._autoBackdrop)
}

function isVisible (el) {
  return el.clientWidth && el.clientHeight && window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
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

function setFocus (el) {
  if (el.contains(document.activeElement) || !isVisible(el)) return // Do not move if focus is already inside
  const focusable = queryAll('[autofocus]', el).concat(queryAll(FOCUSABLE, el)).filter(isVisible)[0]
  try { focusable.focus() } catch (err) { console.warn(el, 'is initialized without focusable elements. Please add [tabindex="-1"] the main element (for instance a <h1>)') }
}

function keepFocus (el, event) {
  const focusable = queryAll(FOCUSABLE, el).filter(isVisible)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge || !el.contains(event.target)) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
