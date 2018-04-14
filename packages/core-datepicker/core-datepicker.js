import {name, version} from './package.json'
import {addEvent, escapeHTML, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

export default function datepicker (elements, date = {}) { // Date can be String, Timestamp or Date
  const options = date.constructor === Object ? date : {date} // Check constructor as Date is Object

  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || options.date || Date.now()) // from .value?
    const nextDate = parse(options.date || prevDate)
    // const isChange = prevDate.getTime() !== nextDate.getTime()
    // const isFirstRender = !element.hasAttribute(UUID)
    // if (isFirstRender || isChange) {}

    element.setAttribute(UUID, nextDate.getTime()) // Store date to compare on next update
    queryAll('select:empty,option,input,textarea,table', element).forEach((control) => {
      render(control, nextDate, prevDate, element)
    })

    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']

function render(control, nextDate, prevDate, element) {
  const type = control.getAttribute('type') || control.nodeName.toLowerCase()
  const check = nextDate.getTime() === parse(control.value, nextDate).getTime()

  // Handle data-mask for all elements
  // x Handle empty select
  // x Handle option
  // x Handle [type="radio"] (not checkbox as this does not make sence)
  // Handle textarea / input (with data-mask)
  // x Handle table

  if (type === 'radio') control.checked = check
  else if (type === 'option') control.selected = check
  else if (type === 'select') renderMonths(control, nextDate)
  else if (type === 'table') renderDay(control, nextDate, prevDate)
  else {
    const mask = control.getAttribute('data-mask') || ''
    const pad = (str) => `0${str}`.slice(-2)
    let value = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())} ${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}:${pad(nextDate.getSeconds())}`
    // const [, year, month, day] = mask.match(/([y?]+)[-/.]([m?]+)[-/.]([d?]+)/) || []
    // const [, hour, minute, second] = mask.match(/([h?]+):([m?]+):?([s?]+)?/) || []
    // const match = {year, month, day, hour, minute, second}
    // console.log(match)

    if (mask) {
      value = (value.match(new RegExp(mask.replace('*', '(-?$&)').replace(/[*ymdhs]+/g, '\\d+'))) || [])[1] || ''
    }
    control.value = value
  }
}
function dateUnits (date = new Date()) {
  const local = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
  const [year, month, day, hour, minute, second] = local.toJSON().split(/[-.:T]/)
  return {year, month, day, hour, minute, second}
}

function renderMonths (select, date) {
  select.innerHTML = datepicker.months.map((name, i) =>
    `<option value="y-${i + 1}-d"${i === date.getMonth()? ' selected' : ''}>${i + 1} - ${escapeHTML(name)}</option>`
  ).join('')
}

function renderDay (table, nextDate, prevDate) {
  const today = new Date()
  const year = nextDate.getFullYear()
  const month = nextDate.getMonth()
  let day = parse(`y-m-1 mon`, nextDate) // Start on first monday of month
  let html = ''

  // TODO only swap attributes if same year and month, not render everything

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
    for (let j = 0; j < 7; j++) {
      const value = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
      const isOtherMonth = !isSameMonth(day, nextDate)
      const isSelected = isSameDay(day, nextDate)
      const isToday = isSameDay(day, nextDate)

      html += `<td><button value="${value}" tabindex="${isSelected - 1}" aria-pressed="${isSelected}" aria-disabled="${isOtherMonth}" aria-current="${isToday && 'date'}">`
      html += `${day.getDate()}</button></td>`
      day.setDate(day.getDate() + 1)
    }
    html += '</tr>'
  }

  table.innerHTML = `<caption>${escapeHTML(datepicker.months[month])}, ${year}</caption><thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead><tbody>${html}</tbody>`
}

const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear()
const isSameMonth = (d1, d2) => isSameYear(d1, d2) && d1.getMonth() === d2.getMonth()
const isSameDay = (d1, d2) => isSameYear(d1, d2) && isSameMonth(d1, d2) && d1.getDate() === d2.getDate()

addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', onChange) // Clicks on buttons can change
addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'keydown', (event) => {
  if (CODE[event.keyCode]) {
    // const element = closest(event.target)
    // console.log(CODE[event.keyCode], element)
  }
})

function onChange (event) {
  let control
  let element = event.target
  for (; element; element = element.parentElement) {
    if (element.value) control = element // Store element with value as control
    if (element.hasAttribute(UUID)) break
  }
  console.log(event.type, event.target)

  if (element && control) {
    const mask = control.getAttribute('data-mask') || '*'
    const date = parse(mask.replace('*', control.value), element.getAttribute(UUID))

    // TODO dispatchEvent on date change
    // TODO Update aria in table to keep focus
    // TODO Set focus on grid update always

    datepicker(element, date)
  }
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
