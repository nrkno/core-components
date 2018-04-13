import {name, version} from './package.json'
import {addEvent, escapeHTML, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})

export default function datepicker (elements, date = {}) { // Date can be String, Timestamp or Date
  const options = date.constructor === Object ? date : {date} // Check constructor as Date is object

  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || Date.now()) // from .value?
    const nextDate = parse(options.date || prevDate)
    const isChange = prevDate.getTime() !== nextDate.getTime()
    const isFirstRender = !element.hasAttribute(UUID)

    if (isFirstRender || isChange) {
      element.setAttribute(UUID, nextDate.getTime()) // Store date to compare on next update

      queryAll('select:empty,option,input,textarea,table', element).forEach((el) => {
        render(el, nextDate, element)
      })
    }

    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']

function render(el, date, context) {
  const type = el.getAttribute('type') || el.nodeName.toLowerCase()
  const mask = el.getAttribute('data-mask') || '?'
  const value = parse(mask.replace(/\?+/g, el.value), date)
  const check = value.getTime() === date.getTime()

  // Handle data-mask for all elements
  // Handle document.activeElement - should leave alone?
  // x Handle empty select
  // x Handle option
  // x Handle [type="radio"] (not checkbox as this does not make sence)
  // Handle textarea / input (with data-mask)
  // x Handle table

  if (type === 'radio') el.checked = check
  else if (type === 'option') el.selected = check
  else if (type === 'select') renderMonth(el, date)
  else if (type === 'table') renderDay(el, date)
  else {
    const pad = (str) => `0${str}`.slice(-2)
    const name = ['FullYear', 'Month', 'Date', 'Date', 'Hours', 'Minutes', 'Seconds']
    const [, year = 'y', month = 'm', day = 'd'] = mask.match(/([-?y]+)[-/.]([?m]{1,2})[-/.]([?d]{1,2})/) || []
    const [, hour = 'h', minute = 'm', second = 's'] = mask.match(/([?h]{1,2}):([?m]{1,2}):?([?s]{1,2})?/) || []
    const match = [year, month, day, hour, minute, second]
    let value = ''

    Object.keys(match).map((unit) =>
      match[unit].slice(-1) === '?' ? date[`get${name[unit]}`]() : ''
    ).join('')

    // const pad = (str) => `0${str}`.slice(-2)
    // const str = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    // const mask = pattern.replace(/(\?)(.*\1)?/g, '($&)').replace(/[a-z?]/ig, (m, i) => i ? '\\d+' : '[-\\d]+')
    // const [, ymd, year, month, day, hms, hour, minutes, seconds] = pattern.match(/(([?]+)[./-]([?]+)[./-]([?]+))?\s*(([?]*):([?]+))/)
    //
    //
    //
    // str.match(new RegExp(mask))
    //
    // 'y-m-d ?:?'.replace(/[\w?]\W*/g, (m) => {
    //   const fn = mask.shift()
    //   return m === '?' ? date[fn]() : ''
    // })

    // const pluck = pattern.match(/(\?(.*\?)?)/) || []
    // const index = pattern.split(/[-:\s]/)
    // pattern.match(/(\?).*\1?/g)

    // .replace(/[a-z]|\?(?:.*\?)?/g, (match, index) => {
    //   const unit = index === 0 ? '[-\\d]+' : '\\d+'
    //   return match[0] === '?' ? `(${match.replace(/\?/g, unit)})` : unit
    // })
    //
    // .map((match, index) => {
    //   if (match === '?') return date[mask[index]]()
    // }).join(':')
    // console.log(match)
    // const local = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:$da`
    // const regex = new RegExp('y-m-d ?'.replace(/[a-z]/g, '\\d+').replace(/[?]+/g, '\\b.*\\b'))
    //
    // console.log(local, regex)

    // const unit = dateUnits(show)
    // const mask = `${unit.year}-${unit.month}-${unit}`
    // console.log()
  }
}

function renderMonth (select, date) {
  select.innerHTML = datepicker.months.map((name, i) =>
    `<option value="y-${i + 1}-d"${i === date.getMonth()? ' selected' : ''}>${i + 1} - ${escapeHTML(name)}</option>`
  ).join('')
}

function renderDay (table, date) {
  const today = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  let day = parse(`yyyy-mm-01 mon`, date) // Start on first monday of month
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
    for (let j = 0; j < 7; j++) {
      const value = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`
      const isOtherMonth = !isSameMonth(day, date)
      const isSelected = isSameDay(day, date)
      const isToday = isSameDay(day, today)

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

function dateUnits (date = new Date()) {
  const local = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
  const [year, month, day, hour, minute, second] = local.toJSON().split(/[-.:T]/)
  return {year, month, day, hour, minute, second}
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
  let target
  let element = event.target
  for (; element; element = element.parentElement) {
    if (element.value) target = element // Store element with value as target
    if (element.hasAttribute(UUID)) break
  }

  if (element && target) {
    const date = parse(target.value, element.getAttribute(UUID))

    // TODO max within same month if month-select to avoid 31 marts to 31->30 april?
    // TODO dispatchEvent on date change
    // TODO Update aria in table to keep focus
    // TODO Set focus on grid update always
    // TODO Update year/hours from input too

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
