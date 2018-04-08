import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'

const ATTR = `data-${name.split('/').pop()}` // Name without scope
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

const DAYS = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn'] // TODO make configurable
const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
const RENDERS = {select: 'month', 'input[type="number"]': 'year', table: 'day'}

export default function datepicker (elements, date = {}) {
  const options = date.constructor === Object ? date : {date} // typeof Date is object so instead check constructor

  return queryAll(elements).map((element) => {
    const date = datepicker.parse(options.date || element.getAttribute(UUID) || element.value)
    const next = element.nextElementSibling

    element.setAttribute(UUID, '')
    element.value = date.getTime() // Store date value. Also makes form submitting work

    Object.keys(RENDERS).forEach((key) => {
      queryAll(key, next).forEach((el) => datepicker[RENDERS[key]](el, date, date))
    })

    return element
  })
}

datepicker.month = function (select, date) {
  const month = date.getMonth()
  select.innerHTML = MONTHS.map((name, i) =>
    `<option value="y-${i + 1}-d"${i === month ? 'selected' : ''}>${i + 1} - ${name}</option>`
  ).join('')
}

datepicker.year = function (input, date) {
  input.value = date.getFullYear()
}

datepicker.day = function (table, date, selected) {
  const today = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  let day = datepicker.parse('yyyy-mm-01 mon', date) // Start on first monday of month
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
    for (let j = 0; j < 7; j++) {
      const value = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
      const isOtherMonth = !isSameMonth(day, date)
      const isSelected = isSameDay(day, selected)
      const isToday = isSameDay(day, today)

      html += `<td><button value="${value}" aria-pressed="${isSelected}" aria-disabled="${isOtherMonth}" aria-current="${isToday && 'date'}">`
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
  for (let currentTarget; target; target = target.parentElement) {
    const prev = target.previousElementSibling
    const attr = target.getAttribute(ATTR)

    if (target.value) currentTarget = target // Store element with value as event source
    if (target.hasAttribute(UUID)) return {currentTarget, target} // Datepicker is <input>
    if (prev && prev.hasAttribute(UUID)) return {currentTarget, target: prev} // Inside datepicker
    if (attr) return {currentTarget, target: document.querySelector(target.getAttribute(ATTR))}
  }
  return {}
}

addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', onChange) // Clicks on buttons can change
addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'keydown', (event) => {
  if (CODE[event.keyCode]) {
    const element = closest(event.target)
    console.log(CODE[event.keyCode], element)
  }
})

function onChange (event) {
  const {target, currentTarget} = closest(event.target)

  if (target && currentTarget) {
    const next = target.nextElementSibling
    const from = currentTarget.value.indexOf('now') === -1 ? target.value : Date.now()
    const show = datepicker.parse(currentTarget.value, from)
    const date = datepicker.parse(target.value)

    // TODO only update on actual change
    // TODO update aria in table to keep focus
    // TODO Kristoffer set focus on month/year change?
    // TODO Update year from input too

    if (currentTarget.nodeName === 'BUTTON') datepicker(target, show)
    else datepicker.day(next.querySelector('table'), show, date) // TODO when there is no table?
  }
}

// [date|timestamp|string], [timestamp|Date]
// + 1 second(s)
// - 1 minute(s)
// + 1 day(s)
// - 1 month(s)
// + 1 year(s)
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
// 100-1-1 - 1st of January year 100
// -100-1-1 - 1st of January year -100
// -081 + y00 = 0
// -181 + y0y = -101
// -181 + y0 = -80
// -181 + y0yy = -81
// -181 + y0 = -180

datepicker.parse = (parse, from) => {
  if (Number(parse)) return new Date(Number(parse)) // Allow timestamps and Date instances

  const text = String(parse).toLowerCase()
  const date = new Date(Number(from) || Date.now())
  const name = {year: 'FullYear', month: 'Month', day: 'Date', hour: 'Hours', minute: 'Minutes', second: 'Seconds'}
  const math = /([+-]\s*\d+)\s*(second|minute|hour|day|month|year)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat)|(sun)/g
  const [, year = 'y', month = 'm', day = 'd'] = text.match(/([-\dy]+)[-/.]([\dm]{1,2})[-/.]([\dd]{1,2})/) || []
  const [, hour = 'h', minute = 'm', second = 's'] = text.match(/([\dh]{1,2}):([\dm]{1,2}):?([\ds]{1,2})?/) || []
  let match = {year, month, day, hour, minute, second}

  Object.keys(match).forEach((unit) => {
    const move = unit === 'month' ? 1 : 0 // Month have zero based index
    const prev = `${date[`get${name[unit]}`]() + move}` // Shift to consistent index
    const next = match[unit].replace(/[^-\d]+/g, (match, index, next) => { // Replace non digit chars
      if (index) return prev.substr(prev.length - next.length + index, match.length) // Inside: copy match.length
      return prev.substr(0, Math.max(0, prev.length - next.length + match.length)) // Start: copy leading chars
    })

    date[`set${name[unit]}`](next - move)
  })

  while ((match = math.exec(text)) !== null) {
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
