import { addStyle, closest, dispatchEvent, toggleAttribute, queryAll } from '../utils'
import parse from '@nrk/simple-date-parse'

const MASK = { year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*', timestamp: '*', null: '*' }
const KEYS = { 33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week' }
const MONTHS = 'januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember'
const DAYS = 'man,tirs,ons,tors,fre,lør,søn'

export default class CoreDatepicker extends HTMLElement {
  static get observedAttributes () { return ['date', 'months', 'days'] }

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

  attributeChangedCallback (attr, prev, next) {
    if (!this.parentNode) return // Only render after connectedCallback
    if (this.disabled(this.date) && !this.disabled(this._date)) return (this.date = this._date) // Jump back

    // Treat null <=> 0 as a valid change despite no apparent diff
    if (this.diff(this.date) || (prev === null && next === '0') || (prev === '0' && next === null)) dispatchEvent(this, 'datepicker.change', this._date = this.date)
    forEachController('button', this, setupButton)
    forEachController('select', this, setupSelect)
    forEachController('input', this, setupInput)
    forEachController('table', this, setupTable)
  }

  handleEvent (event) {
    // Filter event and target
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (event.type === 'keydown' && !KEYS[event.keyCode])) return
    if (!this.contains(event.target) && !closest(event.target, `[for="${this.id}"],[data-for="${this.id}"]`)) return

    if (event.type === 'change') {
      this.date = MASK[event.target.getAttribute('data-type')].replace('*', event.target.value)
    } else if (event.type === 'click') {
      const button = closest(event.target, 'button[value]')
      const table = closest(event.target, 'table')
      if (button) this.date = button.value
      if (button && table) dispatchEvent(this, 'datepicker.click.day')
    } else if (event.type === 'keydown') {
      const table = closest(event.target, 'table')
      if (table) {
        this.date = KEYS[event.keyCode]
        table.querySelector('[autofocus]').focus()
        event.preventDefault() // Prevent scrolling
      }
    }
  }

  diff (val) { return this.parse(val).getTime() - this.timestamp }

  parse (val, from) { return parse(val, from || this._date || Date.now()) }

  get disabled () { return this._disabled || Function.prototype }

  set disabled (fn) {
    if (typeof fn !== 'function') this._disabled = () => Boolean(fn)
    else this._disabled = (val) => val !== null && fn(this.parse(val), this) // null is always false / never disabled
    this.attributeChangedCallback() // Re-render
  }

  get timestamp () { return this._date ? this._date.getTime() : null }

  // Stringify for consistency with pad and for truthy '0'
  get year () { return this._date ? String(this._date.getFullYear()) : null }

  get month () { return this._date ? pad(this._date.getMonth() + 1) : null }

  get day () { return this._date ? pad(this._date.getDate()) : null }

  get hour () { return this._date ? pad(this._date.getHours()) : null }

  get minute () { return this._date ? pad(this._date.getMinutes()) : null }

  get second () { return this._date ? pad(this._date.getSeconds()) : null }

  get date () {
    let dateAttr = this.getAttribute('date')
    if (!dateAttr) {
      dateAttr = this.getAttribute('timestamp')
      if (!dateAttr) return null
      this.removeAttribute('timestamp')
      console.warn(this, 'uses deprecated `timestamp` attribute, please change to use `date`.')
    }
    return this.parse(dateAttr)
  }

  set date (val) {
    return val === null ? this.removeAttribute('date') : this.setAttribute('date', this.parse(val).getTime())
  }

  set months (val) { this.setAttribute('months', [].concat(val).join(',')) }

  get months () { return (this.getAttribute('months') || MONTHS).split(/\s*,\s*/) }

  set days (val) { this.setAttribute('days', [].concat(val).join(',')) }

  get days () { return (this.getAttribute('days') || DAYS).split(/\s*,\s*/) }
}

const pad = (val) => `0${val}`.slice(-2)

const forEachController = (css, self, fn) => [].forEach.call(document.getElementsByTagName(css), (el) => {
  if (self.contains(el) || self.id === (el.getAttribute('data-for') || el.getAttribute('for'))) fn(self, el)
})

function setupButton (self, el) {
  if (!el.value) return // Skip buttons without a set value
  el.type = 'button' // Ensure forms are not submitted by datepicker-buttons
  el.disabled = self.disabled(el.value)
}

function setupInput (self, el) {
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

function setupTable (self, table) {
  if (!table.firstElementChild) {
    table.innerHTML = `
    <caption></caption><thead><tr>${Array(8).join('</th><th>')}</tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join('<td><button type="button"></button></td>')}</tr>`)}</tbody>`
  }

  const today = new Date()
  const date = self._date || today
  const month = date.getMonth()
  const day = self.parse('y-m-1 mon', date) // Monday in first week of month
  table.caption.textContent = `${self.months[month]}, ${date.getFullYear()}`
  queryAll('th', table).forEach((th, day) => (th.textContent = self.days[day]))
  queryAll('button', table).forEach((button) => {
    const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()
    const isSelected = self._date === null ? isToday : !self.diff(day)
    const dayInMonth = day.getDate()
    const dayMonth = day.getMonth()

    button.textContent = dayInMonth // Set textContent instead of innerHTML avoids reflow
    button.value = `${day.getFullYear()}-${dayMonth + 1}-${dayInMonth}`
    button.disabled = self.disabled(day)
    button.setAttribute('tabindex', Number(isSelected) - 1)
    button.setAttribute('data-adjacent', month !== dayMonth)
    button.setAttribute('aria-label', `${dayInMonth}. ${self.months[dayMonth]}`)
    button.setAttribute('aria-current', isToday && 'date')
    toggleAttribute(button, 'autofocus', isSelected)
    day.setDate(dayInMonth + 1)
  })
}

function setupSelect (self, select) {
  if (!select.firstElementChild) {
    select._autofill = true
    select.innerHTML = self.months.map((name, month) =>
      `<option value="y-${month + 1}-d"></option>`
    ).join('')
  }

  queryAll(select.children).forEach((option, month) => {
    if (select._autofill) option.textContent = self.months[month]
    option.disabled = self.disabled(option.value)
    option.selected = !self.diff(option.value)
  })
}
