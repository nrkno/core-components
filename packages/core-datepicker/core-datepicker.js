import { name, version } from './package.json'
import { addEvent, escapeHTML, dispatchEvent, queryAll } from '../utils'
import parse from '@nrk/simple-date-parse'

const ATTR = 'data-core-datepicker'
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEY_CODES = { 33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week' }
const MASK = { year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*', timestamp: '*' }
const MS_IN_MINUTES = 60000

export default function datepicker (elements, date) { // date can be String, Timestamp or Date
  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || date)
    let nextDate = parse(typeof date === 'undefined' ? prevDate : date, prevDate)
    let disable = () => false

    dispatchEvent(element, 'datepicker.render', { nextDate, prevDate, disable: (fn) => (disable = fn) })
    if (disable(nextDate)) nextDate = prevDate // Jump back to prev date if next is disabled

    const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', { prevDate, nextDate })
    const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now()) // dispatchEvent can change attributes to parse prevDate again
    const json = new Date(next.getTime() - next.getTimezoneOffset() * MS_IN_MINUTES).toJSON().match(/\d+/g)
    const unit = { year: next.getFullYear(), month: json[1], day: json[2], hour: json[3], minute: json[4], second: json[5], timestamp: next.getTime() }

    element.setAttribute(UUID, unit.timestamp)
    queryAll('button').forEach((el) => button(el, next, disable, element))
    queryAll('select', element).forEach((el) => select(el, next, disable))
    queryAll('input', element).forEach((el) => input(el, next, disable, unit))
    queryAll('table', element).forEach((el) => table(el, next, disable))

    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']

addEvent(UUID, 'change', onChange)
addEvent(UUID, 'click', ({ target }) => {
  for (let el = target; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON') return onChange({ target: el })
  }
})
addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.shitKey || event.altKey || !KEY_CODES[event.keyCode]) return
  for (let el = event.target, table; el; el = el.parentElement) {
    if (!table && el.nodeName === 'TABLE') table = el // Store table while traversing DOM parents
    if (table && el.hasAttribute(UUID)) { // Only listen to keyCodes inside table inside datepicker
      datepicker(el, KEY_CODES[event.keyCode])
      table.querySelector(`[${ATTR}-selected="true"]`).focus()
      event.preventDefault()
      break
    }
  }
})

function onChange ({ target }) {
  for (let el = target, table; el; el = el.parentElement) {
    const elem = document.getElementById(el.getAttribute(ATTR)) || el
    const mask = elem.hasAttribute(UUID) && (MASK[target.getAttribute(`${UUID}-type`)] || '*')

    if (!table && el.nodeName === 'TABLE') table = el // Store table while traversing DOM parents
    if (mask) {
      const nextDate = mask.replace('*', target.value)
      const isUpdate = !elem.contains(table) || dispatchEvent(elem, 'datepicker.click.day', {
        currentTarget: target,
        relatedTarget: table,
        prevDate: parse(elem.getAttribute(UUID)),
        nextDate: parse(nextDate)
      })

      return isUpdate && datepicker(elem, nextDate)
    }
  }
}

function input (el, date, disable, unit) {
  const type = el.getAttribute(`${UUID}-type`) || el.getAttribute('type')
  if (type === 'radio' || type === 'checkbox') {
    const val = parse(el.value, date)
    el.disabled = disable(val)
    el.checked = val.getTime() === date.getTime()
  } else if (unit[type]) {
    el.setAttribute('type', 'number') // Set input type to number
    el.setAttribute(`${UUID}-type`, type) // And store original input type
    el.value = unit[type]
  }
}

function table (table, date, disable) {
  if (!table.firstElementChild) {
    table.innerHTML = `
    <caption></caption><thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join(`<td><button type="button"></button></td>`)}</tr>`)}</tbody>`
  }

  const today = new Date()
  let day = parse('y-m-1 mon', date) // Monday in first week of month
  table.caption.textContent = `${escapeHTML(datepicker.months[date.getMonth()])}, ${date.getFullYear()}`

  queryAll('button', table).forEach((button) => {
    const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()
    const isSelected = day.getTime() === date.getTime()
    const dayInMonth = day.getDate()

    button.textContent = dayInMonth // Set textContent instead of innerHTML avoids reflow
    button.value = `${day.getFullYear()}-${day.getMonth() + 1}-${dayInMonth}`
    button.disabled = disable(day)
    button.setAttribute('tabindex', isSelected - 1)
    button.setAttribute(`${ATTR}-selected`, isSelected)
    button.setAttribute('aria-label', `${dayInMonth}. ${datepicker.months[day.getMonth()]}`)
    button[isToday ? 'setAttribute' : 'removeAttribute']('aria-current', 'date')
    button[isSelected ? 'setAttribute' : 'removeAttribute']('autofocus', '')
    day.setDate(dayInMonth + 1)
  })
}

function button (el, date, disable, picker) {
  if (el.getAttribute(ATTR) === picker.id || picker.contains(el)) {
    el.disabled = disable(parse(el.value, date))
  }
}

function select (select, date, disable) {
  if (!select.firstElementChild) {
    select.innerHTML = datepicker.months.map((name, month) =>
      `<option value="y-${month + 1}-d">${escapeHTML(name)}</option>`
    ).join('')
  }

  queryAll(select.children).forEach((option) => {
    const val = parse(option.value, date)
    option.disabled = disable(val)
    option.selected = val.getTime() === date.getTime()
  })
}
