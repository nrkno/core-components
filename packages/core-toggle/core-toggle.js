import { IS_ANDROID, IS_IOS, closest, dispatchEvent, getUUID } from '../utils'

export default class CoreToggle extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    if (IS_IOS) document.documentElement.style.cursor = 'pointer' // Fix iOS events for closing popups (https://stackoverflow.com/a/16006333/8819615)
    if (!IS_ANDROID) this.setAttribute('aria-labelledby', this.button.id = this.button.id || getUUID()) // Andriod reads only label instead of content

    this.value = this.button.textContent // Set up aria-label
    this.button.setAttribute('aria-expanded', this._open = !this.hidden)
    this.button.setAttribute('aria-controls', this.id = this.id || getUUID())
    document.addEventListener('keydown', this, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents
    document.addEventListener('click', this)
  }
  disconnectedCallback () {
    document.removeEventListener('keydown', this, true)
    document.removeEventListener('click', this)
  }
  attributeChangedCallback () {
    if (this._open === this.hidden) { // this._open comparison ensures actual change
      this.button.setAttribute('aria-expanded', this._open = !this.hidden)
      try { this.querySelector('[autofocus]').focus() } catch (err) {}
      dispatchEvent(this, 'toggle')
    }
  }
  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'keydown' && event.keyCode === 27 && (event.target.getAttribute('aria-expanded') === 'true' ? event.target === this.button : closest(event.target, this.nodeName) === this)) {
      this.button.focus()
      this.hidden = true
      return event.preventDefault() // Prevent closing maximized Safari and other coreToggles
    }
    if (event.type === 'click') {
      const item = closest(event.target, 'a,button')
      if (item && !item.hasAttribute('aria-expanded') && closest(event.target, this.nodeName) === this) dispatchEvent(this, 'toggle.select', item)
      else if (this.button.contains(event.target)) this.hidden = !this.hidden
      else if (this.popup && !this.contains(event.target)) this.hidden = true // Click in content or outside
    }
  }
  get button () { return document.getElementById(this.getAttribute('for')) || this.previousElementSibling }

  // aria-haspopup triggers forms mode in JAWS, therefore store as custom attr
  get popup () { return this.getAttribute('popup') === 'true' || this.getAttribute('popup') || this.hasAttribute('popup') }
  set popup (val) { this[val ? 'setAttribute' : 'removeAttribute']('popup', val) }

  // Sets this.button aria-label, so visible button text can be augmentet with intension of button
  // Example: Button text: "01.02.2019", aria-label: "01.02.2019, Choose date"
  // Does not updates aria-label if not allready set to something else than this.popup
  get value () { return this.button.value || this.button.textContent }
  set value (data = false) {
    if (!this.button || !this.popup.length) return
    const button = this.button
    const popup = (button.getAttribute('aria-label') || `,${this.popup}`).split(',')[1]
    const label = data.textContent || data || '' // data can be Element, Object or String

    if (popup === this.popup) {
      button.value = data.value || label
      button[data.innerHTML ? 'innerHTML' : 'textContent'] = data.innerHTML || label
      button.setAttribute('aria-label', `${button.textContent},${this.popup}`)
    }
  }
}
