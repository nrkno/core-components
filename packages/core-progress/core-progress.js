import { addStyle, dispatchEvent } from '../utils'

export default class CoreProgress extends HTMLElement {
  static get observedAttributes () { return ['value', 'min', 'max'] }

  connectedCallback () {
    this._max = this.max // Store for later comparison
    this._value = this.value
    this.setAttribute('role', 'img') // Role img makes screen readers happy
    addStyle(this.nodeName, `${this.nodeName}::after{content:attr(aria-label)}`) // Textual progress
  }
  attributeChangedCallback () {
    if (!this._value) return // Only render after connectedCallback
    const oldValue = this._value
    const newValue = this.value
    const max = this.max
    const indeterminate = this.indeterminate
    const percentage = Math.round(newValue / max * 100) || 0

    const noChanges = newValue === oldValue && max === this.getAttribute('max') && indeterminate !== this.hasAttribute('value')
    const canUpdate = noChanges || dispatchEvent(this, 'progress.change')
    const value = canUpdate ? newValue : oldValue

    if (this.indeterminate) {
      this.removeAttribute('value')
      this.setAttribute('aria-label', value)
    } else {
      this.setAttribute('max', max) // Set max before value to make IE happy
      this.setAttribute('value', value)
      this.setAttribute('aria-label', `${this.percentage}%`)
    }
  }
  get indeterminate () { return Number(this.value) !== parseFloat(this.value) } // handle numeric string values
  get percentage () { return Math.round(this.value / this.max * 100) || 0 }
  get value () { return Number(this.getAttribute('value')) || 0 }
  set value (val) { this.setAttribute('value', val) }
  get max () { return Number(this.getAttribute('max') || 1) }
  set max (val) { this.setAttribute('max', val) }
}
