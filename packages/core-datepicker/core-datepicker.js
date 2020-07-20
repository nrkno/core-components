import { addStyle, closest, dispatchEvent, toggleAttribute, queryAll } from '../utils'
import parse from '@nrk/simple-date-parse'

const FILL = {
  month: (self, value) => daysInMonth(self.parse(value)).filter(day => !self.disabled(day))[0] || value,
  null: (_self, value) => value
}
const DISABLED = {
  month: (self, value) => daysInMonth(self.parse(value)).map((day) => self.disabled(day)).reduce((a, b) => a && b),
  null: (self, value) => self.disabled(value)
}
const MASK = { year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*', timestamp: '*', null: '*' }
const KEYS = { 33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week' }
const MONTHS = 'januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember'
const DAYS = 'man,tirs,ons,tors,fre,lør,søn'

export default class CoreDatepicker extends HTMLElement {
  static get observedAttributes () { return ['timestamp', 'months', 'days'] }

  connectedCallback () {
    this._date = this.date // Store for later comparison and speeding up things
    document.addEventListener('click', this)
    document.addEventListener('change', this)
    document.addEventListener('keydown', this)
    setTimeout(() => this.attributeChangedCallback()) // Render after children is parsed
    addStyle(this.nodeName, `${this.nodeName}{display:block}`) //  default to display block
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
    if (!this.contains(event.target) && !closest(event.target, `[for="${this.id}"]`)) return
    if (event.type === 'change') {
      const date = MASK[event.target.getAttribute('data-type')].replace('*', event.target.value)
      this.date = FILL[event.target.getAttribute('data-fill')](this, date)
    } else if (event.type === 'click') {
      const button = closest(event.target, 'button[value]')
      const table = closest(event.target, 'table')
      if (button) this.date = button.value
      if (button && table) dispatchEvent(this, 'datepicker.click.day')
    } else if (event.type === 'keydown' && closest(event.target, 'table')) {
      this.date = KEYS[event.keyCode]
      this.querySelector('[autofocus]').focus()
      event.preventDefault() // Prevent scrolling
    }
  }

  diff (val) { return this.parse(val).getTime() - this.timestamp }

  parse (val, from) { return parse(val, from || this._date) }

  get disabled () { return this._disabled || Function.prototype }

  set disabled (fn) {
    this._disabled = typeof fn === 'function' ? (val) => fn(this.parse(val), this) : () => fn // Auto parse dates
    this.attributeChangedCallback() // Re-render
  }

  get timestamp () { return String(this._date.getTime()) }

  // Stringify for consistency and for truthy '0'
  get year () { return String(this._date.getFullYear()) }

  get month () { return pad(this._date.getMonth() + 1) }

  get day () { return pad(this._date.getDate()) }

  get hour () { return pad(this._date.getHours()) }

  get minute () { return pad(this._date.getMinutes()) }

  get second () { return pad(this._date.getSeconds()) }

  get date () { return parse(this.getAttribute('timestamp') || this._date || Date.now()) }

  set date (val) { return this.setAttribute('timestamp', this.parse(val).getTime()) }

  set months (val) { this.setAttribute('months', [].concat(val).join(',')) }

  get months () { return (this.getAttribute('months') || MONTHS).split(/\s*,\s*/) }

  set days (val) { this.setAttribute('days', [].concat(val).join(',')) }

  get days () { return (this.getAttribute('days') || DAYS).split(/\s*,\s*/) }
}

const pad = (val) => `0${val}`.slice(-2)
const forEach = (css, self, fn) => [].forEach.call(document.getElementsByTagName(css), (el) => {
  if (self.contains(el) || self.id === el.getAttribute(self.external)) fn(self, el)
})

function button (self, el) {
  if (!el.value) return // Skip buttons without a set value
  el.type = 'button' // Ensure forms are not submitted by datepicker-buttons
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
    <caption></caption><thead><tr>${Array(8).join('</th><th>')}</tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join('<td><button type="button"></button></td>')}</tr>`)}</tbody>`
  }

  const today = new Date()
  const month = self.date.getMonth()
  const day = self.parse('y-m-1 mon') // Monday in first week of month
  table.caption.textContent = `${self.months[month]}, ${self.year}`

  queryAll('th', table).forEach((th, day) => (th.textContent = self.days[day]))
  queryAll('button', table).forEach((button) => {
    const isSelected = !self.diff(day)
    const dayInMonth = day.getDate()
    const dayMonth = day.getMonth()

    button.textContent = dayInMonth // Set textContent instead of innerHTML avoids reflow
    button.value = `${day.getFullYear()}-${dayMonth + 1}-${dayInMonth}`
    button.disabled = self.disabled(day)
    button.tabIndex = isSelected - 1
    button.setAttribute('data-adjacent', month !== dayMonth)
    button.setAttribute('aria-label', `${dayInMonth}. ${self.months[dayMonth]}`)
    button.setAttribute('aria-current', day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear() && 'date')
    toggleAttribute(button, 'autofocus', isSelected)
    day.setDate(dayInMonth + 1)
  })
}

function select (self, select) {
  if (!select.firstElementChild) {
    select._autofill = true
    select.setAttribute('data-fill', 'month')
    select.innerHTML = self.months.map((name, month) =>
      `<option value="y-${month + 1}-d"></option>`
    ).join('')
  }
  const disabled = DISABLED[select.getAttribute('data-fill')]
  queryAll(select.children).forEach((option, month) => {
    if (select._autofill) option.textContent = self.months[month]
    option.disabled = disabled(self, option.value)
    option.selected = !self.diff(option.value)
  })
}

function daysInMonth (dateInMonth) {
  const date = new Date(dateInMonth)
  date.setDate(1)

  const month = date.getMonth()
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}
