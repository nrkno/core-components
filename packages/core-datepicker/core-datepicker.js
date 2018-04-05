import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'
import strtotime from './strtotime'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

const DAYS = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']
const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
const RENDERS = {select: 'month', input: 'year', table: 'day'}

export default function datepicker (buttons, options = {}) {
  return queryAll(buttons).map((button) => {
    const date = parseDate(button.value)

    button.setAttribute(UUID, '')
    button.value = date.toISOString() // Store date value

    queryAll(Object.keys(RENDERS).join(','), button.nextElementSibling).forEach((el) => {
      datepicker[RENDERS[el.nodeName.toLowerCase()]](el, date, date)
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
  let day = getMonday(new Date(year, month, 1))
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
    for (let j = 0; j < 7; j++) {
      const isDayInMonth = isSameMonth(day, date)
      const isSelected = isSameDay(day, selected)
      const isToday = isSameDay(day, today)

      html += `<td>
        <button title="${isToday ? 'I dag' : ''}" aria-pressed="${isSelected}" style="${isDayInMonth ? '' : 'opacity:.3'}${isToday ? ';color:red' : ''}">
          ${day.getDate()}
        </button>
      </td>`
      day.setDate(day.getDate() + 1)
    }
    html += '</tr>'
  }

  table.innerHTML = `<caption>${MONTHS[month]}, ${year}</caption>
  <thead><tr><th>${DAYS.join('</th><th>')}</th></tr></thead>
  <tbody>${html}</tbody>`
}

const isSameYear = (d1, d2) => d1.getFullYear() === d2.getFullYear()
const isSameMonth = (d1, d2) => isSameYear(d1, d2) && d1.getMonth() === d2.getMonth()
const isSameDay = (d1, d2) => isSameYear(d1, d2) && isSameMonth(d1, d2) && d1.getDate() === d2.getDate()

function parseDate (date) {
  return date instanceof Date ? date : new Date(strtotime(date || 'now'))
}

// https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date#answer-4156562
function getMonday(date) {
  const mon = new Date(date)
  const day = date.getDay() || 7 // Converting Sunday to 7
  mon.setHours(day === 1 ? 0 : (day - 1) * -24)
  return mon
}

function closest (element) {
  for (let el = element; el; el = el.parentElement) {
    const prev = el.previousElementSibling
    if (prev && prev.hasAttribute(UUID)) return prev
  }
}

addEvent(UUID, 'input', onChange)
addEvent(UUID, 'change', onChange)
addEvent(UUID, 'click', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.name === 'day') {
      const element = closest(event.target)
      const content = element.nextElementSibling
      const table = content.querySelector('table')
      const show = new Date(element.value)
      const date = new Date(strtotime(el.value) * 1000)
      console.log(show, date)

      datepicker.day(table, show, date) // TODO, when there is no table?
    }
  }
})
addEvent(UUID, 'keydown', (event) => {
  if (CODE[event.keyCode]) {
    const element = closest(event.target)
    console.log(CODE[event.keyCode], element)
  }
})

function onChange (event) {
  const element = closest(event.target)

  if (element) {
    const content = element.nextElementSibling
    const table = content.querySelector('table')
    const date = new Date(element.getAttribute(UUID))
    const show = new Date(date)

    show.setFullYear(content.querySelector('[name="year"]').value)
    show.setMonth(content.querySelector('[name="month"]').value)
    console.log(date, show)

    datepicker.day(table, show, date) // TODO, when there is no table?
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
