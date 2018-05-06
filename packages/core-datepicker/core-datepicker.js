import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week'}
const MASK = {year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*'}
// TODO Disable dates (and auto correct to vaild one), no key move when on disabled?

export default function datepicker (elements, date) { // Date can be String, Timestamp or Date
  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || Date.now())
    const nextDate = parse(typeof date === 'undefined' ? prevDate : date, prevDate)
    const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', {prevDate, nextDate})
    const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now())

    element.setAttribute(UUID, next.getTime())
    queryAll('input,select,table', element).forEach((control) => render(control, next))

    // if (isUpdate) {
    //   dispatchEvent(element, 'datepicker.render', {setDisabled: (filter) => {
    //     queryAll('button,option,input[type="radio"],input[type="checkbox"]', element).forEach((el) => {
    //       if (el.value) el.disabled = filter(parse(el.value, next)) // TODO unit, also for select/option
    //     })
    //   }})
    // }
    return element
  })
}

// Expose API and config
datepicker.parse = parse
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']

addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON' && el.value) onChange({target: el})
  }
})

addEvent(UUID, 'keydown', (event) => {
  const hasAction = KEYS[event.keyCode] && event.target.getAttribute('aria-pressed') === 'true'
  if (!hasAction || event.ctrlKey || event.metaKey || event.shitKey || event.altKey) return
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      datepicker(el, KEYS[event.keyCode])
      el.querySelector('[aria-pressed="true"]').focus()
      event.preventDefault()
    }
  }
})

function onChange ({target}) {
  for (let el = target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      const mask = MASK[target.getAttribute('data-unit')] || '*'
      return datepicker(el, mask.replace('*', target.value))
    }
  }
}

function getUnit (date, unit) {
  const json = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON()
  const [year, month, day, hour, minute, second] = json.match(/\d+/g)
  return ({year: date.getFullYear(), month, day, hour, minute, second})[unit]
}

function render (control, date) {
  const type = control.getAttribute('type') || control.nodeName.toLowerCase()
  const unit = control.getAttribute('data-unit')

  if (type === 'radio' || type === 'checkbox') control.checked = date.getTime() === parse((MASK[unit] || '*').replace('*', control.value), date).getTime()
  else if (type === 'select') renderSelect(control, date, unit)
  else if (type === 'table') renderDays(control, date)
  else if (unit) control.value = getUnit(date, unit)
}

function renderDays (table, date) {
  const month = date.getMonth()
  const today = new Date().toJSON().slice(0, 10) // Get ymd part of date
  let day = parse('y-m-1 mon', date) // Monday in first week of month

  if(!table.firstElementChild) {
    table.innerHTML = `
    <thead><tr><th>${datepicker.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody>${Array(7).join(`<tr>${Array(8).join(`<td><button></button></td>`)}</tr>`)}</tbody>`
  }

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

function renderSelect (select, date, unit) {
  if (unit === 'month' && !select.firstElementChild) {
    select.innerHTML = datepicker.months.map((name, index) =>
      `<option value="${index + 1}">${escapeHTML(name)}</option>`
    ).join('')
  }

  queryAll(select.children).forEach((option) => {
    const time = parse((MASK[unit] || '*').replace('*', option.value), date).getTime()
    option.selected = time === date.getTime()
  })
}
