import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '@nrk/simple-date-parse'

const ATTR = 'data-core-datepicker'
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEY_CODES = {33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week'}
const MASK = {year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*', timestamp: '*'}
const MS_IN_MINUTES = 60000

export default function datepicker (elements, date) { // options can be String, Timestamp or Date
  const options = typeof date === 'object' ? date : {date}

  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || Date.now())

    const date = parse(typeof options.date === 'undefined' ? prevDate : options.date, prevDate)
    const min = parse(typeof options.min === 'undefined' ? date : (options.min || element.getAttribute(`${UUID}-min`)))
    const max = parse(typeof options.min === 'undefined' ? date : (options.max || element.getAttribute(`${UUID}-max`)))

    const nextDate = parse(Math.max(min, Math.min(max, date))) // Limit datepicker
    console.log(Math.max(min, Math.min(max, date)))
    const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', {prevDate, nextDate})
    const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now()) // dispatchEvent can change attributes to parse prevDate again

    const json = new Date(next.getTime() - next.getTimezoneOffset() * MS_IN_MINUTES).toJSON().match(/\d+/g)
    const unit = {year: next.getFullYear(), month: json[1], day: json[2], hour: json[3], minute: json[4], second: json[5], timestamp: next.getTime()}

    element.setAttribute(UUID, unit.timestamp)
    element.setAttribute(`${UUID}-min`, min.getTime())
    element.setAttribute(`${UUID}-max`, max.getTime())
    queryAll('select', element).forEach((el) => select(el, next))
    queryAll('input', element).forEach((el) => input(el, next, unit))
    queryAll('table', element).forEach((el) => table(el, next, min, max))

    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']

addEvent(UUID, 'change', onChange)
addEvent(UUID, 'click', ({target}) => {
  for (let el = target; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON') return onChange({target: el})
  }
})
addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.shitKey || event.altKey || !KEY_CODES[event.keyCode]) return
  for (let el = event.target, table; el; el = el.parentElement) {
    if (!table && el.nodeName === 'TABLE') table = el // Store table while traversing DOM parents
    if (table && el.hasAttribute(UUID)) { // Only listen to keyCodes inside table inside datepicker
      datepicker(el, KEY_CODES[event.keyCode])
      table.querySelector('[aria-pressed="true"]').focus()
      event.preventDefault()
      break
    }
  }
})

function parseOption (options, element, key, fallback) {
  return parse(typeof options[key] === 'undefined' ? (element.getAttribute(`${UUID}-${key}`) || fallback) : options.min)
}

function onChange ({target}) {
  for (let el = target; el; el = el.parentElement) {
    const elem = document.getElementById(el.getAttribute(ATTR)) || el
    const mask = elem.hasAttribute(UUID) && (MASK[target.getAttribute(`${UUID}-type`)] || '*')
    if (mask) return datepicker(elem, mask.replace('*', target.value))
  }
}

function input (el, date, unit) {
  const type = el.getAttribute(`${UUID}-type`) || el.getAttribute('type')
  if (type === 'radio' || type === 'checkbox') el.checked = parse(el.value, date).getTime() === date.getTime()
  else if (unit[type]) {
    el.setAttribute('type', 'number') // Set input type to number
    el.setAttribute(`${UUID}-type`, type) // And store original input type
    el.value = unit[type]
  }
}

function table (table, date, min, max) {
  if (!table.firstElementChild) {
    table.innerHTML = `
    <caption></caption><thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join(`<td><button></button></td>`)}</tr>`)}</tbody>`
  }

  const month = date.getMonth()
  const today = new Date().toJSON().slice(0, 10) // Get ymd part of date
  let day = parse('y-m-1 mon', date) // Monday in first week of month
  table.caption.textContent = `${escapeHTML(datepicker.months[month])}, ${date.getFullYear()}`

  queryAll('button', table).forEach((button) => {
    const isToday = day.toJSON().slice(0, 10) === today
    const isSelected = day.getTime() === date.getTime()
    const dayInMonth = day.getDate()

    button.textContent = dayInMonth // Set textContent instead of innerHTML avoids reflow
    button.value = `${day.getFullYear()}-${day.getMonth() + 1}-${dayInMonth}`
    button.setAttribute('tabindex', isSelected - 1)
    button.setAttribute('aria-pressed', isSelected)
    button.setAttribute('aria-current', isToday && 'date')
    button.setAttribute('aria-disabled', month !== day.getMonth())
    day.setDate(dayInMonth + 1)
  })
}

function select (select, date) {
  if (!select.firstElementChild) {
    select.innerHTML = datepicker.months.map((name, month) =>
      `<option value="y-${month + 1}-d">${escapeHTML(name)}</option>`
    ).join('')
  }

  queryAll(select.children).forEach((option) => {
    option.selected = parse(option.value, date).getTime() === date.getTime()
  })
}
