import { closest, dispatchEvent, getUUID, queryAll } from '../utils'

const FOCUSABLE = '[tabindex],a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

export default class CoreDialog extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    this._open = !this.hidden // Used to ensures actual change in attributeChangedCallback
    this._opener = `data-dialog-${getUUID()}` // Used to identify what element opened the dialog
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', this.modal)
    this.addEventListener('transitionend', this)
    document.addEventListener('keydown', this)
    document.addEventListener('click', this)
    if (this._open) this.attributeChangedCallback(true) // Ensure correct setup backdrop
  }

  disconnectedCallback () {
    this.removeEventListener('transitionend', this)
    document.removeEventListener('keydown', this)
    document.removeEventListener('click', this)
  }

  attributeChangedCallback (force) {
    if (this._open === this.hidden || force === true) { // this._open comparison ensures actual change
      const opener = document.querySelector(`[${this._opener}]`)
      const active = opener || document.activeElement || document.body
      const zIndex = Math.min(Math.max(...queryAll('body *').map(getZIndex)), 2000000000) // Avoid overflowing z-index. See techjunkie.com/maximum-z-index-value

      // Trigger repaint to fix IE11 from not closing dialog
      this.className = this.className // eslint-disable-line
      this.backdrop.hidden = !this.modal || this.hidden
      this._open = !this.hidden

      if (!this.hidden) {
        this.style.zIndex = zIndex + 2
        this.backdrop.style.zIndex = zIndex + 1
        active.setAttribute(this._opener, '') // Remember opener element
        setFocus(this)
        setTimeout(() => setFocus(this)) // Move focus after paint (helps iOS and react portals)
      } else if (opener) {
        opener.focus()
        opener.removeAttribute(this._opener)
        setTimeout(() => opener.focus()) // Move focus after paint (helps iOS and react portals)
      }

      if (force !== true) dispatchEvent(this, 'dialog.toggle')
    }
  }

  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'transitionend' && event.target === this && !this.hidden) setFocus(this)
    else if (event.type === 'click') {
      if (event.target === this.backdrop && !this.strict) return this.close()
      const button = closest(event.target, `button[for]`)
      const action = button && button.getAttribute('for')
      const toggle = action === 'close' ? closest(event.target, this.nodeName) === this : action === this.id

      if (action === this.id) button.setAttribute(this._opener, '') // iOS remember button
      if (toggle) this.hidden = action === 'close'
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

  show () { this.modal = this.hidden = false }

  showModal () {
    this.modal = true
    this.hidden = false
  }

  get open () { return !this.hidden }

  set open (val) { this.hidden = !val }

  get modal () { return this.getAttribute('aria-modal') !== 'false' }

  set modal (val) { this.setAttribute('aria-modal', Boolean(val)) }

  get strict () { return this.hasAttribute('strict') }

  set strict (val) { this.toggleAttribute('strict', val) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }

  set hidden (val) { this.toggleAttribute('hidden', val) }

  get backdrop () {
    const next = this.nextElementSibling
    if (next && next.nodeName === 'BACKDROP') return next
    const back = document.createElement('backdrop')
    back.hidden = true
    return this.insertAdjacentElement('afterend', back)
  }
}

function isVisible (el) {
  return el.clientWidth && el.clientHeight && window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'
}

function getZIndex (element) {
  for (var el = element, zIndex = 1; el; el = el.offsetParent) {
    zIndex += Number(window.getComputedStyle(el).getPropertyValue('z-index')) || 0
  }
  return zIndex
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
