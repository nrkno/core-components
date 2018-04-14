import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CONTROLS = 'input,option,select:empty,table'
const MASK = '*'

export default function datepicker (elements, date = {}) { // Date can be String, Timestamp or Date
  const options = date.constructor === Object ? date : {date} // Check constructor as Date is Object

  return queryAll(elements).map((element) => {
    setDate(element, options.date)
    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']

addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', onButton)
addEvent(UUID, 'keydown', (event) => {
  // TODO Change date and move focus
})

function onButton (event) {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON') onChange({target: el})
  }
}

function onChange ({target}) {
  if (!target.value) return // Allow elements without value to have no effect
  for (let el = target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      const mask = target.getAttribute('data-mask') || MASK
      return datepicker(el, mask.replace(MASK, target.value))
    }
  }
}

function setDate (element, date) {
  const prevDate = parse(element.getAttribute(UUID) || Date.now())
  const nextDate = parse(typeof date === 'undefined' ? prevDate : date, prevDate)
  const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', {prevDate, nextDate})
  const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now()) // dispatchEvent can change attributes, so check again
  const ymdhms = `${next.getFullYear()}-0${next.getMonth() + 1}-0${next.getDate()} 0${next.getHours()}:0${next.getMinutes()}:0${next.getSeconds()}`.replace(/\b0(\d{2})/g, '$1')

  element.setAttribute(UUID, next.getTime())
  queryAll(CONTROLS, element).forEach((control) => render(control, next, ymdhms))
}

function render(control, date, ymdhms) {
  const type = control.getAttribute('type') || control.nodeName.toLowerCase()
  const mask = control.getAttribute('data-mask') || control.parentElement.getAttribute('data-mask') || MASK

  if (type === 'radio' || type === 'checkbox' || type === 'option') renderToggle(control, date, mask)
  else if (type === 'select') renderMonths(control, date)
  else if (type === 'table') renderDays(control, date)
  else control.value = (ymdhms.match(new RegExp(mask.replace(MASK, '(-?$&)').replace(/[*ymdhs]+/g, '\\d+'))) || [])[1] || ''
}

function renderToggle (control, date, mask) {
  const key = control.nodeName === 'OPTION' ? 'selected' : 'checked'
  const val = date.getTime() === parse(mask.replace(MASK, control.value), date).getTime()
  control[key] = val
}

function renderMonths (select, date) {
  select.innerHTML = datepicker.months.map((name, month) =>
    `<option value="y-${month + 1}-d"${month === date.getMonth()? ' selected' : ''}>${month + 1} - ${escapeHTML(name)}</option>`
  ).join('')
}

function renderDays (table, date) {
  const month = date.getMonth()
  const today = new Date().toJSON().slice(0, 10) // Get ymd part of date
  let day = parse(`y-m-1 mon`, date) // Monday in first week of month

  renderTable(table)
  table.createCaption().textContent = `${datepicker.months[month]}, ${date.getFullYear()}`

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

function renderTable (table) {
  if(table.textContent.trim()) return
  table.innerHTML = `
    <thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join('<td><button></button></td>')}</tr>`)}</tbody>`
}

/*
Left          Move focus to the previous day. Will move to the last day of the previous month, if the current day is the first day of a month.
Right         Move focus to the next day. Will move to the first day of the following month, if the current day is the last day of a month.
Up            Move focus to the same day of the previous week. Will wrap to the appropriate day in the previous month.
Down          Move focus to the same day of the following week. Will wrap to the appropriate day in the following month.
PgUp          Move focus to the same date of the previous month. If that date does not exist, focus is placed on the last day of the month.
PgDn          Move focus to the same date of the following month. If that date does not exist, focus is placed on the last day of the month.
Alt+PgUp      Move focus to the same date of the previous year. If that date does not exist (e.g leap year), focus is placed on the last day of the month.
Alt+PgDn      Move focus to the same date of the following year. If that date does not exist (e.g leap year), focus is placed on the last day of the month.
Home          Move to the first day of the month.
End           Move to the last day of the month
Tab/Shift+Tab Navigate between calander grid and close/previous/next selection buttons
Enter/Space   Fill the date textbox with the selected date then close the datepicker widget.
*/
