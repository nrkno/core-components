import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CONTROLS = 'input,option,select:empty,table'

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

addEvent(UUID, 'input', onChange)
addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'click', onButton)
addEvent(UUID, 'keydown', (event) => {
  // TODO Change date and move focus
})

function onButton (event) {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.value && el.nodeName === 'BUTTON') onChange({target: el})
  }
}

function onChange ({target}) {
  for (let el = target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      const mask = target.getAttribute('data-mask') || '*'
      return datepicker(el, mask.replace('*', target.value))
    }
  }
}

function setDate (element, date) {
  const prevDate = parse(element.getAttribute(UUID) || Date.now())
  const nextDate = parse(typeof date === 'undefined' ? prevDate : date, prevDate)
  const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', {prevDate, nextDate})
  const showDate = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now()) // dispatchEvent can change attributes, so check again

  element.setAttribute(UUID, showDate.getTime())
  queryAll(CONTROLS, element).forEach((control) => {
    render(control, showDate, prevDate, element)
  })
}

function render(control, nextDate, prevDate, element) {
  const type = control.getAttribute('type') || control.nodeName.toLowerCase()
  const mask = control.getAttribute('data-mask')
  const check = nextDate.getTime() === parse(control.value, nextDate).getTime()

  if (type === 'radio') control.checked = check // TODO Mask radio too
  else if (type === 'option') control.selected = check // TODO Mask selects too
  else if (type === 'select') renderMonths(control, nextDate)
  else if (type === 'table') renderDay(control, nextDate, prevDate)
  else if (mask){
    const pad = (str) => `0${str}`.slice(-2)
    const value = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())} ${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}:${pad(nextDate.getSeconds())}`
    control.value = (value.match(new RegExp(mask.replace('*', '(-?$&)').replace(/[*ymdhs]+/g, '\\d+'))) || [])[1] || ''
  }
}

function renderMonths (select, nextDate) {
  select.innerHTML = datepicker.months.map((name, month) =>
    `<option value="y-${month + 1}-d"${month === nextDate.getMonth()? ' selected' : ''}>${month + 1} - ${escapeHTML(name)}</option>`
  ).join('')
}

function renderDay (table, nextDate, prevDate) {
  const isEmpty = !table.textContent.trim()
  const today = new Date()
  let day = parse(`y-m-1 mon`, nextDate) // Start on first monday of month

  if (isEmpty) {
    table.innerHTML = `
      <thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
      <tbody>${Array(7).join(`<tr>${Array(8).join('<td><button></button></td>')}</tr>`)}</tbody>`
  }

 table.createCaption().textContent = `${datepicker.months[nextDate.getMonth()]}, ${nextDate.getFullYear()}`

  queryAll('button', table).forEach((btn) => {
    const isPressed = isSameDay(day, nextDate)
    const number = day.getDate()

    btn.textContent = number // Set textContent instead of innerHTML to avoid reflow
    btn.value = `${day.getFullYear()}-${day.getMonth() + 1}-${number}`
    btn.setAttribute('tabindex', isPressed - 1)
    btn.setAttribute('aria-pressed', isPressed)
    btn.setAttribute('aria-current', isSameDay(day, today) && 'date')
    btn.setAttribute('aria-disabled', day.getMonth() !== nextDate.getMonth())
    day.setDate(number + 1)
  })
}

function isSameDay (d1, d2) {
  return d1.toJSON().slice(0, 10) === d2.toJSON().slice(0, 10)
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
