import { closest, escapeHTML, dispatchEvent, queryAll } from '../utils'
import parse from '@nrk/simple-date-parse'

const MASK = { year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*', timestamp: '*' }
const KEYS = { 33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week' }

export default class CoreDatepicker extends HTMLElement {
  static get observedAttributes () { return ['timestamp'] }

  connectedCallback () {
    this._date = this.date // Store for later comparison and speeding up things
    document.addEventListener('click', this)
    document.addEventListener('change', this)
    document.addEventListener('keydown', this)
    setTimeout(() => this.attributeChangedCallback()) // Render after children is parsed
  }
  disconnectedCallback () {
    this._date = this._disabled = null // Garbage collection
    document.removeEventListener('click', this)
    document.removeEventListener('change', this)
    document.removeEventListener('keydown', this)
  }
  attributeChangedCallback () {
    if (!this._date) return // Only render after connectedCallback
    if (this.disabled(this.date) && !this.disabled(this._date)) return (this.date = this._date) // Jump back
    if (this.diff(this.date)) dispatchEvent(this, 'datepicker.change', this._date = this.date)

    forEach('button', this, button)
    forEach('select', this, select)
    forEach('input', this, input)
    forEach('table', this, table)
  }
  handleEvent (event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.type === 'keydown' && !KEYS[event.keyCode])) return
    if (!this.contains(event.target) && !closest(event.target, `[${this.external}="${this.id}"]`)) return

    const table = closest(event.target, 'table')
    const value = KEYS[event.keyCode] || (closest(event.target, 'button') || event.target).value
    const mask = MASK[event.target.getAttribute('data-type')] || '*'

    if (event.type === 'keydown' ? table : value) this.date = mask.replace('*', value) // Keydown only in table
    if (event.type === 'click' && table && value) dispatchEvent(this, 'datepicker.click.day')
    if (event.type === 'keydown' && table) {
      event.preventDefault() // Prevent scrolling
      table.querySelector('[autofocus]').focus()
    }
  }
  diff (val) { return this.parse(val).getTime() - this.timestamp }
  parse (val, from) { return parse(val, from || this._date) }

  get external () { return 'data-core-datepicker' }
  get disabled () { return this._disabled || Function.prototype }
  set disabled (fn) {
    this._disabled = typeof fn === 'function' ? (val) => fn(this.parse(val), this) : () => fn // Auto parse dates
    this.attributeChangedCallback() // Re-render
  }

  get timestamp () { return String(this._date.getTime()) }
  get year () { return String(this._date.getFullYear()) } // Stringify for consistency and for truthy '0'
  get month () { return pad(this._date.getMonth() + 1) }
  get day () { return pad(this._date.getDate()) }
  get hour () { return pad(this._date.getHours()) }
  get minute () { return pad(this._date.getMinutes()) }
  get second () { return pad(this._date.getSeconds()) }
  get date () { return parse(this.getAttribute('timestamp') || this._date || Date.now()) }
  set date (val) { return this.setAttribute('timestamp', this.parse(val).getTime()) }
}

// Expose API
CoreDatepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
CoreDatepicker.days = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']

const pad = (val) => `0${val}`.slice(-2)
const forEach = (css, self, fn) => [].forEach.call(document.getElementsByTagName(css), (el) => {
  if (self.contains(el) || self.id === el.getAttribute(self.external)) fn(self, el, self._date)
})

function button (self, el) {
  el.disabled = self.disabled(el.value)
}

function input (self, el) {
  const type = el.getAttribute('data-type') || el.getAttribute('type')

  if (type === 'radio' || type === 'checkbox') {
    el.disabled = self.disabled(el.value)
    el.checked = !self.diff(el.value)
  } else if (MASK[type]) {
    el.setAttribute('type', 'number') // Set input type to number
    el.setAttribute('data-type', type) // And store original type
    el.value = self[type]
  }
}

function table (self, table) {
  if (!table.firstElementChild) {
    table.innerHTML = `
    <caption></caption><thead><tr><th>${CoreDatepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join('<td><button type="button"></button></td>')}</tr>`)}</tbody>`
  }

  const today = new Date()
  const month = self.date.getMonth()
  const day = self.parse('y-m-1 mon') // Monday in first week of month
  table.caption.textContent = `${CoreDatepicker.months[month]}, ${self.year}`

  queryAll('button', table).forEach((button) => {
    const isSelected = !self.diff(day)
    const dayInMonth = day.getDate()
    const dayMonth = day.getMonth()

    button.textContent = dayInMonth // Set textContent instead of innerHTML avoids reflow
    button.value = `${day.getFullYear()}-${dayMonth + 1}-${dayInMonth}`
    button.disabled = self.disabled(day)
    button.tabIndex = isSelected - 1
    button.setAttribute(`${self.external}-adjacent`, month !== dayMonth)
    button.setAttribute('aria-label', `${dayInMonth}. ${CoreDatepicker.months[dayMonth]}`)
    button.setAttribute('aria-current', day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear() && 'date')
    button[isSelected ? 'setAttribute' : 'removeAttribute']('autofocus', '')
    day.setDate(dayInMonth + 1)
  })
}

function select (self, select) {
  if (!select.firstElementChild) {
    select.innerHTML = CoreDatepicker.months.map((name, month) =>
      `<option value="y-${month + 1}-d">${escapeHTML(name)}</option>`
    ).join('')
  }

  queryAll(select.children).forEach((option) => {
    option.disabled = self.disabled(option.value)
    option.selected = !self.diff(option.value)
  })
}
