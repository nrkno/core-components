import { closest, dispatchEvent, queryAll } from '../utils'

let OPENER
const OPENER_ATTR = `data-core-dialog-focus`
const FOCUSABLE = '[tabindex],a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'

export default class CoreDialog extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', this.modal)
    this.setAttribute('open', this._open = !this.hidden)
    document.addEventListener('transitionend', this)
    document.addEventListener('keydown', this)
    document.addEventListener('click', this)
  }
  disconnectedCallback () {
    document.removeEventListener('transitionend', this)
    document.removeEventListener('keydown', this)
    document.removeEventListener('click', this)
  }
  attributeChangedCallback (name) {
    console.log(name)
    if (this._open === this.hidden) { // this._open comparison ensures actual change
      const active = document.activeElement || document.body
      const lastFocus = getLastFocusedElement() // Store before open, as native dialog moves focus to [autofocus]
      const lastIndex = Number(lastFocus && lastFocus.getAttribute(OPENER_ATTR)) || 0
      const topZIndex = Math.min(Math.max(...queryAll('body *').map(getZIndex)), 2000000000) // Avoid overflowing z-index. See techjunkie.com/maximum-z-index-value

      this.setAttribute('open', this._open = !this.hidden)
      // Trigger repaint to fix IE11 from not closing dialog
      this.className = this.className // eslint-disable-line
      this.backdrop.hidden = !(!this.hidden && this.modal)
      console.log(this.modal, !this.hidden)

      if (!this.hidden) {
        this.style.zIndex = topZIndex + 2
        this.backdrop.style.zIndex = topZIndex + 1
        if (active) active.setAttribute(OPENER_ATTR, lastIndex + 1) // Remember opener element
        setFocus(this)
      } else if (lastFocus) {
        (OPENER = lastFocus).removeAttribute(OPENER_ATTR) // Focus opener after transition
      }

      dispatchEvent(this, 'dialog.toggle')
    }
  }
  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'click') {
      if (!this.hidden && !this.strict && event.target === this.backdrop) return this.close()
      const button = closest(event.target, '[data-core-dialog]')
      const action = button && button.getAttribute('data-core-dialog')
      const target = action === 'close' ? this.contains(event.target) : document.getElementById(action)

      if (target === true) this.hidden = true
      else if (target) target.hidden = false
    } else if (event.type === 'transitionend' && event.target === this) {
      if (!this.hidden) setFocus(this)
      else if (OPENER) setTimeout(() => (OPENER = OPENER && OPENER.focus())) // Move focus after paint
    } else if (event.type === 'keydown' && !this.hidden && getTopLevelDialog(this.nodeName) === this) {
      if (event.keyCode === 9) keepFocus(this, event) // TAB
      if (event.keyCode === 27 && !this.strict) { // ESC
        event.preventDefault() // Prevent leaving maximized window in Safari
        this.hidden = true
      }
    }
  }

  close () { this.hidden = true }
  show () { this.hidden = this.modal = false }
  showModal () {
    this.modal = true
    this.hidden = false
  }

  get open () { return !this.hidden }
  set open (val) { this.hidden = !val }
  get modal () { return this.hasAttribute('aria-modal') !== 'false' }
  set modal (val) { return this.setAttribute('aria-modal', Boolean(val)) }
  get strict () { return this.hasAttribute('strict') }
  set strict (val) { return this[val ? 'setAttribute' : 'removeAttribute']('strict', '') }

  get backdrop () {
    const next = this.nextElementSibling
    if (next && next.nodeName === 'BACKDROP') return next
    const back = document.createElement('backdrop')
    back.hidden = true
    return this.insertAdjacentElement('afterend', back)
  }
}

const isVisible = (el) =>
  el.clientWidth && el.clientHeight && window.getComputedStyle(el).getPropertyValue('visibility') !== 'hidden'

const getZIndex = (element) => {
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

const getTopLevelDialog = (nodeName) =>
  queryAll(`${nodeName}:not([hidden])`).sort((a, b) => getZIndex(a) > getZIndex(b)).pop()

function setFocus (el) {
  if (el.contains(document.activeElement)) return // Do not move if focus is already inside
  const focusable = queryAll('[autofocus]', el).concat(queryAll(FOCUSABLE, el)).filter(isVisible)[0]
  if (focusable) focusable.focus() // Only focuses the first visible element
  else console.warn(el, 'is initialized without focusable elements. Please add [tabindex="-1"] the main element (for instance a <h1>)')
}

function keepFocus (dialog, event) {
  const focusable = queryAll(FOCUSABLE, dialog).filter(isVisible)
  const onEdge = focusable[event.shiftKey ? 0 : focusable.length - 1]

  // If focus moves us outside the dialog, we need to refocus to inside the dialog
  if (event.target === onEdge || !dialog.contains(event.target)) {
    event.preventDefault()
    focusable[event.shiftKey ? focusable.length - 1 : 0].focus()
  }
}
