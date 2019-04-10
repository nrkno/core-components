import { IS_ANDROID, IS_IOS, addEvent, dispatchEvent, getUUID } from '../utils'

export default class CoreToggle extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    if (IS_IOS) document.documentElement.style.cursor = 'pointer' // Fix iOS events for closing popups (https://stackoverflow.com/a/16006333/8819615)
    if (!IS_ANDROID) this.setAttribute('aria-labelledby', this.button.id = this.button.id || getUUID()) // Andriod has a bug and reads only label instead of content

    this.button.setAttribute('aria-expanded', !this.hidden)
    this.button.setAttribute('aria-controls', this.id = this.id || getUUID())
    addEvent(this.nodeName, 'keydown', onKeydown, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents
    addEvent(this.nodeName, 'click', onClick)
  }
  attributeChangedCallback (name, oldValue, newValue) {
    if (this.parentElement && oldValue !== newValue) {
      this.button.setAttribute('aria-expanded', newValue === null)
      try { this.querySelector('[autofocus]') } catch (err) {}
      dispatchEvent(this, 'toggle')
    }
  }
  get button () {
    return document.getElementById(this.getAttribute('for')) || this.previousElementSibling
  }

  get hidden () { return this.hasAttribute('hidden') }
  set hidden (val) { this[val ? 'setAttribute' : 'removeAttribute']('hidden', '') }

  // aria-haspopup triggers forms mode in JAWS, therefore store as custom attr
  get popup () { return this.getAttribute('popup') || this.hasAttribute('popup') }
  set popup (val) { this[val ? 'setAttribute' : 'removeAttribute']('popup', val === true ? '' : val) }
}

function onClick (event) {
  if (event.defaultPrevented) return false // Do not toggle if someone run event.preventDefault()

  for (let el = event.target, item; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON' || el.nodeName === 'A') item = el // interactive element clicked
    if (item && el.nodeName === event.scope) return dispatchEvent(el, 'toggleSelect', item)
  }

  [].forEach.call(document.getElementsByTagName(event.scope), (toggle) => {
    if (toggle.button.contains(event.target)) toggle.hidden = !toggle.hidden // Click on toggle
    else if (toggle.popup && !toggle.hidden) toggle.hidden = !toggle.contains(event.target) // Click in content or outside
  })
}

function onKeydown (event) {
  if (event.keyCode !== 27) return // Only listen to ESC
  for (let el = event.target; el; el = el.parentElement) {
    el = document.getElementById(el.getAttribute('aria-controls')) || el
    if (el.nodeName === event.scope && el.popup && !el.hidden) {
      el.hidden = true
      return event.preventDefault() // Only close inner most toggle and keep maximized window (Safari)
    }
  }
}

// if (options.value) toggle.innerHTML = options.value // Set innerHTML before updating aria-label
// if (popup !== 'false' && popup !== 'true') toggle.setAttribute('aria-label', `${toggle.textContent}, ${popup}`) // Only update aria-label if popup-mode
// this.button.setAttribute('aria-label', this.popup) // TODO better setting value and keeping existing label
