import { addStyle, dispatchEvent } from '../utils'

export default class CoreProgress extends HTMLElement {
  static get observedAttributes () { return ['type', 'value', 'max'] }

  connectedCallback () {
    this.setAttribute('role', 'img') // Role img makes screen readers happy
    this.setAttribute('aria-label', this.getAttribute('aria-label') || '0%') // Ensure aria-label also without attributes
    addStyle(this.nodeName, `${this.nodeName}{display:block;fill:none;stroke-width:15}`)
  }
  attributeChangedCallback (name, prev, next) {
    const changeType = this.parentElement && name === 'type' && prev !== next
    const percentage = this.indeterminate ? 100 : this.percentage

    this.setAttribute('aria-label', this.indeterminate || `${this.percentage}%`)
    this.toggleAttribute('indeterminate', this.indeterminate)

    if (this.type === 'linear') this.style.width = `${percentage}%`
    if (this.type === 'radial') this.style.strokeDashoffset = Math.round((100 - percentage) * Math.PI)
    if (changeType) this.innerHTML = next !== 'radial' ? '' : '<svg style="display:block;overflow:hidden;border-radius:100%" width="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" stroke-dashoffset="0"/><circle cx="50" cy="50" r="50" stroke="currentColor" stroke-dasharray="314.159" transform="rotate(-90 50 50)"/></svg>'
    if (name === 'value' && Number(next) !== Number(prev)) dispatchEvent(this, 'change') // Only trigger event on actual change
  }
  get indeterminate () { return isNaN(parseFloat(this.getAttribute('value'))) && this.getAttribute('value') }
  get percentage () { return Math.round(this.value / this.max * 100) || 0 }
  get value () { return this.indeterminate || Number(this.getAttribute('value')) }
  set value (val) { this.setAttribute('value', val) }
  get max () { return Number(this.getAttribute('max')) || 1 }
  set max (val) { this.setAttribute('max', val) }
  get type () { return this.getAttribute('type') || 'linear' }
  set type (val) { this.setAttribute('type', val) }
}
