import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const ATTR = `data-${name.split('/').pop()}` // Name without scope
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

const DAYS = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag'] // TODO make configurable
const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
const RENDERS = {select: 'month', 'input[type="number"]': 'year', table: 'day'}

export default function datepicker (elements, date = {}) {
  const options = date.constructor === Object ? date : {date} // typeof Date is object so instead check constructor

  return queryAll(elements).map((element) => {
    const prev = datepicker.parse(element.value || Date.now())
    const date = datepicker.parse(options.date || prev)
    const show = datepicker.parse(options.show || date)
    const next = element.nextElementSibling

    element.setAttribute(UUID, '')
    element.value = date.getTime() // Store date value. Also makes form submitting work

    Object.keys(RENDERS).forEach((key) => {
      queryAll(key, next).forEach((el) => datepicker[RENDERS[key]](el, date, date))
    })

    return element
  })
}

datepicker.parse = parse
datepicker.month = function (select, date) {
  const month = date.getMonth()
  if (select.selectedIndex !== month) select.innerHTML = MONTHS.map((name, i) =>
    `<option value="y-${i + 1}-d"${i === month ? 'selected' : ''}>${i + 1} - ${name}</option>` // TODO Unsafe name
  ).join('')
}

datepicker.year = function (input, date) {
  const year = date.getFullYear()
  if (input.value !== year) input.value = year
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

      html += `<td><button value="${value}" tabindex="${isSelected - 1}" aria-pressed="${isSelected}" aria-disabled="${isOtherMonth}" aria-current="${isToday && 'date'}">`
      html += `${day.getDate()}</button></td>`
      day.setDate(day.getDate() + 1)
    }
    html += '</tr>'
  }

   // TODO Unsafe days
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
    // const element = closest(event.target)
    // console.log(CODE[event.keyCode], element)
  }
})

function onChange (event) {
  const {target, currentTarget} = closest(event.target)

  if (target && currentTarget) {
    const next = target.nextElementSibling
    const move = currentTarget.nodeName === 'BUTTON'
    const show = datepicker.parse(currentTarget.value, target.value)
    const date = datepicker.parse(move ? show : target.value, target.value)

    // TODO only update on actual change
    // TODO update aria in table to keep focus
    // TODO set focus on grid update always
    // TODO Update year from input too

    datepicker(target, {show, date})
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
