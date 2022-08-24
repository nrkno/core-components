import { closest, dispatchEvent, getUUID, IS_ANDROID, IS_BROWSER, IS_IOS, toggleAttribute } from '../utils'

// Element to ensure overflowing content can be reached by scrolling
const SCROLLER = IS_BROWSER && document.createElement('div')
export default class CoreToggle extends HTMLElement {
  static get observedAttributes () { return ['hidden', 'autoposition'] }

  connectedCallback () {
    if (IS_IOS) document.documentElement.style.cursor = 'pointer' // Fix iOS events for closing popups (https://stackoverflow.com/a/16006333/8819615)
    if (!IS_ANDROID) this.setAttribute('aria-labelledby', this.button.id = this.button.id || getUUID()) // Andriod reads only label instead of content

    this.value = this.button.textContent // Set up aria-label
    this.setAttribute('role', 'group') // Help Edge
    this.button.setAttribute('aria-expanded', this._open = !this.hidden)
    this.button.setAttribute('aria-controls', this.id = this.id || getUUID())
    document.addEventListener('keydown', this, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents
    document.addEventListener('click', this)
  }

  disconnectedCallback () {
    this._button = null
    document.removeEventListener('keydown', this, true)
    document.removeEventListener('click', this)
    handleAutoposition(this, true)
  }

  attributeChangedCallback () {
    if (this._open === this.hidden) { // this._open comparison ensures actual change
      this.button.setAttribute('aria-expanded', this._open = !this.hidden)
      try { this.querySelector('[autofocus]').focus() } catch (err) {}
      handleAutoposition(this, this.hidden)
      dispatchEvent(this, 'toggle')
    }
  }

  handleEvent (event) {
    if (event.defaultPrevented) return
    if (event.type === 'resize' || event.type === 'scroll') return this.updatePosition()
    if (event.type === 'keydown' && event.keyCode === 27) {
      const isButton = event.target.getAttribute && event.target.getAttribute('aria-expanded') === 'true'
      const isHiding = isButton ? event.target === this.button : closest(event.target, this.nodeName) === this
      if (isHiding) {
        this.hidden = true
        this.button.focus() // Move focus back to button
        return event.preventDefault() // Prevent closing maximized Safari and other coreToggles
      }
    }
    if (event.type === 'click') {
      const btn = closest(event.target, 'a,button')
      if (btn && !btn.hasAttribute('aria-expanded') && closest(event.target, this.nodeName) === this) dispatchEvent(this, 'toggle.select', btn)
      else if (btn && btn.getAttribute('aria-controls') === this.id) this.hidden = !this.hidden
      else if (this.popup && !this.contains(event.target)) this.hidden = true // Click in content or outside
    }
  }

  /**
  * updatePosition Exposed for _very_ niche situations, use sparingly
  * @param {HTMLElement} contentEl Reference to the core-toggle element
  */
  updatePosition () {
    if (this._skipPosition || !this.button) return // Avoid infinite loops for mutationObserver
    this._skipPosition = true
    this.style.position = 'fixed' // Set viewModel before reading dimensions
    const triggerRect = this.button.getBoundingClientRect()
    const contentRect = this.getBoundingClientRect()

    const hasSpaceRight = triggerRect.left + contentRect.width < window.innerWidth
    const hasSpaceLeft = triggerRect.right - contentRect.width >= 0
    const hasSpaceUnder = triggerRect.bottom + contentRect.height < window.innerHeight
    const hasSpaceOver = triggerRect.top - contentRect.height > 0

    let leftVal = Math.round((window.innerWidth - contentRect.width) / 2) // Center on screen
    if (contentRect.width > window.innerWidth) {
      leftVal = 0 // Content wider than screen. Anchor to left screen edge to show as much as possible
    } else if (hasSpaceRight) {
      leftVal = triggerRect.left // Anchor to left side
    } else if (hasSpaceLeft) {
      leftVal = triggerRect.right - contentRect.width // Anchor to right side
    }

    // Always place under when no hasSpaceOver, as no OS can scroll further up than window.scrollY = 0
    const placeUnder = hasSpaceUnder || !hasSpaceOver
    const scroll = placeUnder ? window.pageYOffset + triggerRect.bottom + contentRect.height + 30 : 0

    this.style.left = `${leftVal}px`
    this.style.top = `${Math.round(placeUnder ? triggerRect.bottom : triggerRect.top - contentRect.height)}px`
    SCROLLER.style.cssText = `position:absolute;padding:1px;top:${Math.round(scroll)}px`
    setTimeout(() => (this._skipPosition = null)) // Timeout to flush event queue before we can resume acting on mutations
  }

  get button () {
    if (this._button && (this._button.getAttribute('data-for') || this._button.getAttribute('for')) === this.id) return this._button // Speed up
    return (this._button = this.id && document.querySelector(`[for="${this.id}"],[data-for="${this.id}"]`)) || this.previousElementSibling
  }

  // aria-haspopup triggers forms mode in JAWS, therefore store as custom attr
  get popup () {
    return this.getAttribute('data-popup') === 'true' || this.getAttribute('data-popup') || this.hasAttribute('data-popup')
  }

  set popup (val) { this[val === false ? 'removeAttribute' : 'setAttribute']('data-popup', val) }

  get autoposition () { return this.hasAttribute('autoposition') }

  set autoposition (val) { toggleAttribute(this, 'autoposition', val) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }

  set hidden (val) { toggleAttribute(this, 'hidden', val) }

  // Set this.button aria-label, so that visible button text can be augmentet with intention of button
  // Example: Button text: "01.02.2019", aria-label: "01.02.2019, Choose date"
  // Does not update aria-label if not already set to something else than this.popup
  get value () { return this.button.value || this.button.textContent }

  set value (data = false) {
    if (!this.button || !this.popup.length) return
    const button = this.button
    const popup = (button.getAttribute('aria-label') || `,${this.popup}`).split(',')[1]
    const label = data.textContent || data || '' // data can be Element, Object or String

    if (popup === this.popup) {
      const target = button.querySelector('span') || button // Use span to preserve embedded HTML and SVG
      button.value = data.value || label
      target[data.innerHTML ? 'innerHTML' : 'textContent'] = data.innerHTML || label
      button.setAttribute('aria-label', `${button.textContent},${this.popup}`)
    }
  }
}

/**
* handleAutoposition Kept external from element as it is linked to multiple lifecycles and shouldn't be accessible as an internal function
* @param {HTMLElement} self core-toggle instance
* @param {Boolean} teardown if true, clean up and remove
*/
function handleAutoposition (self, teardown) {
  if (teardown) {
    if (self._positionObserver) self._positionObserver.disconnect()
    if (SCROLLER.parentNode) SCROLLER.parentNode.removeChild(SCROLLER)
    self.style.position = self._positionObserver = null
    window.removeEventListener('scroll', self, true) // Use capture to also listen for elements with overflow
    window.removeEventListener('resize', self)
  } else if (self.autoposition) {
    // Attach MutationObserver if supported
    if (!self._positionObserver) self._positionObserver = window.MutationObserver && new window.MutationObserver(self.updatePosition.bind(self))
    if (self._positionObserver) self._positionObserver.observe(self, { childList: true, subtree: true, attributes: true })

    document.body.appendChild(SCROLLER)
    window.addEventListener('scroll', self, true) // Use capture to also listen for elements with overflow
    window.addEventListener('resize', self)
    self.updatePosition() // Initial trigger
  }
}
