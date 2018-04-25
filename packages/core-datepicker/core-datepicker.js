import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '../../../simple-date-parse/index.js' // While simple-date-parse not on NPM

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '+1day', 39: '-1week', 40: '+1week'}
const MASK = {year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*'}

export default function datepicker (elements, date) { // Date can be String, Timestamp or Date
  return queryAll(elements).map((element) => setDate(element, date))
}
// TODO auto-fill? (years?, month?, hour?, minutes?, day?, seconds?) step, max, min, unit
// TODO Disable dates (and auto correct to vaild one)

// Expose config
datepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
datepicker.days = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']

addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.nodeName === 'BUTTON') onChange({target: el})
  }
})

addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.shitKey || event.altKey || !KEYS[event.keyCode] || event.target.getAttribute('aria-pressed') !== 'true') return
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      event.preventDefault()
      setDate(el, KEYS[event.keyCode]).querySelector('[aria-pressed="true"]').focus()
    }
  }
})

function onChange ({target}) {
  if (!target.value) return // Allow elements without value to have no effect
  for (let el = target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      const mask = MASK[target.getAttribute('data-unit')] || '*'
      return datepicker(el, mask.replace('*', target.value))
    }
  }
}

function setDate (element, date) {
  const prevDate = parse(element.getAttribute(UUID) || Date.now())
  const nextDate = parse(typeof date === 'undefined' ? prevDate : date, prevDate)
  const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'datepicker.change', {prevDate, nextDate})
  const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now())

  element.setAttribute(UUID, next.getTime())
  queryAll('input,select,table', element).forEach((control) => render(control, next))
  console.log('isUpdate', isUpdate)
  if (isUpdate) {
    dispatchEvent(element, 'datepicker.render', {setDisabled: (filter) => {
      queryAll('button,option,input[type="radio"],input[type="checkbox"]', element).forEach((el) => {
        if (el.value) el.disabled = filter(parse(el.value, next))
      })
    }})
  }
  return element
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
    <tbody>${Array(7).join(`<tr>${Array(8).join(`<td><button></button></td>`)}</tr>`)}</tbody>`
}

function renderSelect (select, date, unit) {
  const step = Number(select.getAttribute('data-step')) || 1
  let min = Number(select.getAttribute('data-min'))
  let max = Number(select.getAttribute('data-max'))

  if (unit !== 'year') {
    min = Math.max(min || 0, unit === 'month' ? 1 : 0)
    max = Math.min(max || 99, unit === 'month' ? 12 : (unit === 'hour' ? 24 : 59))
  }
  console.log(min, max)

  select.innerHTML = Array(max + 1).join(0).split('').map((val, index) => {
    return `<option value="${index + min}">${index + min}</option>`
  }).join('')

  // select.innerHTML = datepicker.months.map((name, month) =>
  //   `<option value="y-${month + 1}-d"${month === date.getMonth()? ' selected' : ''}>${month + 1} - ${escapeHTML(name)}</option>`
  // ).join('')

  queryAll(select.children).forEach((option) => {
    const mask = MASK[option.getAttribute('data-unit')] || '*'
    const time = parse(mask.replace('*', option.value), date).getTime()
    option.selected = time === date.getTime()
  })
}
