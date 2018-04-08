import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'

const ATTR = `data-${name.split('/').pop()}` // Name without scope
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

const DAYS = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']
const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
const RENDERS = {select: 'month', input: 'year', table: 'day'}

export default function datepicker (buttons, date = {}) {
  const options = date.constructor === Object ? date :  {date} // Date is object so check cunstructor

  return queryAll(buttons).map((button) => {
    const show = datepicker.parse(options.date || button.getAttribute(UUID) || button.value)

    button.setAttribute(UUID, show.toJSON())
    // button.value = show.toISOString() // Store date value

    queryAll(Object.keys(RENDERS).join(','), button.nextElementSibling).forEach((el) => {
      datepicker[RENDERS[el.nodeName.toLowerCase()]](el, show, show)
    })
    return button
  })
}

datepicker.month = function (select, date){
  const month = date.getMonth()
  select.innerHTML = MONTHS.map((name, i) =>
    `<option value="${i}"${i === month ? 'selected' : ''}>${i + 1} - ${name}</option>`
  ).join('')
}

datepicker.year = function (input, date){
  input.value = date.getFullYear()
}

datepicker.day = function (table, date, selected){
  const today = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  let day = datepicker.parse('yyyy-mm-01 mon', date) // Start on first monday of month
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
    for (let j = 0; j < 7; j++) {
      const isDayInMonth = isSameMonth(day, date)
      const isSelected = isSameDay(day, selected)
      const isToday = isSameDay(day, today)

      html += `<td><button title="${isToday ? 'I dag' : ''}" aria-pressed="${isSelected}" style="${isDayInMonth ? '' : 'opacity:.3'}${isToday ? ';color:red' : ''}">`
      html += `${day.getDate()}</button></td>`
      day.setDate(day.getDate() + 1)
    }
    html += '</tr>'
  }

  table.innerHTML = `<caption>${MONTHS[month]}, ${year}</caption><thead><tr><th>${DAYS.join('</th><th>')}</th></tr></thead><tbody>${html}</tbody>`
}

const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear()
const isSameMonth = (d1, d2) => isSameYear(d1, d2) && d1.getMonth() === d2.getMonth()
const isSameDay = (d1, d2) => isSameYear(d1, d2) && isSameMonth(d1, d2) && d1.getDate() === d2.getDate()

function closest (target) {
  for (var currentTarget = target; target; target = target.parentElement) {
    const prev = target.previousElementSibling ||target
    const attr = target.getAttribute(ATTR) // Will fail when empty
    if (attr) return {currentTarget: target, target: document.querySelector(attr)}
    if (target.hasAttribute(UUID) || prev.hasAttribute(UUID)) break
  }
  return {target, currentTarget}
}

addEvent(UUID, 'input', onChange)
addEvent(UUID, 'change', onChange) // IE/Edge does not trigger input on <select>
addEvent(UUID, 'click', (event) => {
  const {target, currentTarget} = closest(event.target)
  console.log(closest(event.target))

  if (target) {
    const from = currentTarget.value.indexOf('now') === -1 ? target.getAttribute(UUID) : Date.now()
    const date = datepicker.parse(currentTarget.value, from)

    return datepicker(target, date) // TODO, when there is no table?
  }
})
addEvent(UUID, 'keydown', (event) => {
  if (CODE[event.keyCode]) {
    const element = closest(event.target)
    console.log(CODE[event.keyCode], element)
  }
})

function onChange (event) {
  const {target} = closest(event.target)
  console.log(event.type, element)

  if (target) {
    const content = target.nextElementSibling
    const table = content.querySelector('table')
    const date = new Date(target.getAttribute(UUID))
    const show = new Date(date)

    show.setFullYear(content.querySelector('[name="year"]').value)
    show.setMonth(content.querySelector('[name="month"]').value)

    datepicker.day(table, show, date) // TODO, when there is no table?
  }
}

// Date.parse
// + 1 second(s)
// + 1 minute(s)
// + 1 day(s)
// + 1 month(s)
// + 1 year(s)

// - 1 minute(s)
// - 1 day(s)
// - 1 month(s)
// - 1 year(s)

// 00:00 - 1 year(s)
// yyyy-mm-01 + 1 year
// monday + 1 days

// tue + 7 days(s)
// friday = friday this week, can be in future and past
// monday - 3 days = friday guaranteed last week
// sunday + 5 days = friday guaranteed next week
// 2018-01-dd + 1 week
// yyyy-mm-01 + 1 month(s) - 1 day = end current month
// yy00-01-01 - 100 year(s)

datepicker.parse = (parse, now) => {
  if (isFinite(new Date(parse))) return new Date(parse) // Try parsing natively first

  const text = String(parse).toLowerCase()
  const date = new Date(now || Date.now()) // Allow another now
  const name = {year: 'FullYear', month: 'Month', day: 'Date', hour: 'Hours', minute: 'Minutes', second: 'Seconds'}
  const math = /([+-]\s*\d+)\s*(second|minute|hour|day|month|year)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)/g
  const [, year = 'yyyy', month = 'mm', day = 'dd'] = text.match(/([\dy]{4})-([\dm]{2})-([\dd]{2})/) || []
  const [, hour = 'hh', minute = 'mm', second = 'ss'] = text.match(/([\dh]{2}):([\dm]{2}):?([\ds]{2})?/) || []
  let match = {year, month, day, hour, minute, second}

  Object.keys(match).forEach((unit) => {
    const move = unit === 'month' ? 1 : 0 // Fix zero based month index
    const prev = `000${date[`get${name[unit]}`]() + move}`.slice(-match[unit].length) // PadLeft to same length
    const next = match[unit].replace(/\D/g, (v, k) => prev[k]) // Replace non-digits with prev values
    date[`set${name[unit]}`](next - move)
  })

  while((match = math.exec(text)) !== null) {
    const unit = match[2]
    const size = Number(String(match[1]).replace(/\s/g, '')) // Keep plus/minus but strip whitespace
    const day = match.slice(2).indexOf(match[0]) // Weekdays starts at 3rd index but is not zero based

    if (unit) date[`set${name[unit]}`](date[`get${name[unit]}`]() + size)
    else date.setDate(date.getDate() - (date.getDay() || 7) + day) // Make sunday 7th day
  }

  return date
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
