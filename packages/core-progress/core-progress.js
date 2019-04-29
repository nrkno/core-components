import { addStyle, dispatchEvent } from '../utils'

export default class CoreProgress extends HTMLElement {
  static get observedAttributes () { return ['type', 'value', 'max'] }

  connectedCallback () {
    this.setAttribute('role', 'img') // Role img makes screen readers happy
    addStyle(this.nodeName, `${this.nodeName}{display:block;fill:none;stroke:currentColor;stroke-width:10;stroke-dasharray:283;stroke-dashoffset:283}`)
  }
  attributeChangedCallback (name, prev, next) {
    if (this.parentElement && name === 'type') {
      this.innerHTML = next !== 'radial' ? '' : '<svg style="display:block" width="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" transform="rotate(-90 50 50)"/></svg>'
    }
    const percentage = this.indeterminate ? 100 : this.percentage
    this[this.indeterminate ? 'setAttribute' : 'removeAttribute']('indeterminate', '')
    this.setAttribute('aria-label', this.indeterminate || `${this.percentage}%`)

    console.log(this, percentage)
    if (this.type === 'line') this.style.width = `${percentage}%`
    if (this.type === 'radial') this.style.strokeDashoffset = Math.round(((100 - percentage) / 100) * 283)
    if (next !== String(prev || this[name])) dispatchEvent(this, 'change') // Only trigger event on actual change
  }
  get indeterminate () { return isNaN(parseFloat(this.getAttribute('value'))) && this.getAttribute('value') }
  get percentage () { return Math.round(this.value / this.max * 100) || 0 }
  get value () { return this.indeterminate || Number(this.getAttribute('value')) }
  set value (val) { this.setAttribute('value', val) }
  get max () { return Number(this.getAttribute('max')) || 1 }
  set max (val) { this.setAttribute('max', val) }
  get type () { return this.getAttribute('type') || 'line' }
  set type (val) { this.setAttribute('type', val) }
}
