import {name, version} from './package.json'
import {addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'
import parse from '@nrk/simple-date-parse'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {33: '-1month', 34: '+1month', 35: 'y-m-99', 36: 'y-m-1', 37: '-1day', 38: '-1week', 39: '+1day', 40: '+1week'}
const MASK = {year: '*-m-d', month: 'y-*-d', day: 'y-m-*', hour: '*:m', minute: 'h:*', second: 'h:m:*'}
const ATTR = 'data-core-date'

// TODO Disable dates (and auto correct to vaild one), no key move when on disabled?

export default function date (elements, options) { // options can be String, Timestamp or Date
  return queryAll(elements).map((element) => {
    const prevDate = parse(element.getAttribute(UUID) || Date.now())
    const nextDate = parse(typeof options === 'undefined' ? prevDate : options, prevDate)
    const isUpdate = prevDate.getTime() === nextDate.getTime() || dispatchEvent(element, 'date.change', {prevDate, nextDate})
    const next = isUpdate ? nextDate : parse(element.getAttribute(UUID) || Date.now())

    element.setAttribute(UUID, next.getTime())
    queryAll(`[${ATTR}]`, element).forEach((el) => {
      const mask = MASK[el.getAttribute(ATTR)] || '*'
      const type = el.nodeName.toLowerCase()

      if (type === 'table') table(el, next)
      else if (type === 'input') input(el, next, mask)
      else if (type === 'select' && !el.firstElementChild) console.log('fill', el)
      else queryAll('input,option', el).forEach((el) => input(el, next, mask))
    })
    // queryAll('select', element).forEach((el) => select(el, next))
    // queryAll('input', element).forEach((el) => input(el, next))
    // queryAll('table', element).forEach((el) => table(el, next))

    // if (isUpdate) {
    //   dispatchEvent(element, 'date.render', {setDisabled: (filter) => {
    //     queryAll('button,option,input[type="radio"],input[type="checkbox"]', element).forEach((el) => {
    //       if (el.value) el.disabled = filter(parse(el.value, next)) // TODO unit, also for select/option
    //     })
    //   }})
    // }
    return element
  })
}

// Expose API and config
date.parse = parse
date.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
date.days = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']

addEvent(UUID, 'change', onChange) // Needed since IE/Edge does not trigger 'input' on <select>
addEvent(UUID, 'input', onChange)
addEvent(UUID, 'click', onChange)
addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.shitKey || event.altKey || !KEYS[event.keyCode]) return
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      date(el, KEYS[event.keyCode])
      queryAll('[aria-pressed="true"]', el).forEach((el) => el.focus())
      event.preventDefault()
      break
    }
  }
})

function onChange ({target}) {
  for (let el = target, value = '', mask; el; el = el.parentElement) {
    if (!value) value = el.value // Button click can have children without value
    if (!mask) mask = el.getAttribute(ATTR)
    if (mask && value && el.hasAttribute(UUID)) {
      console.log(parse(mask.replace('*', value || '*')))
    }
  }

  // (event) => {
  //   for (let el = event.target, val; el; el = el.parentElement) {
  //     const unit = el.getAttribute(ATTR)
  //     if (!val) val = el.value
  //     if (unit) {
  //       if (unit.indexOf('*') === -1) date(document.getElementById(unit), el.value)
  //       unit.replace('*', el.value)
  //     }
  //     if (el.nodeName === 'BUTTON' && el.value) onChange({target: el})
  //   }
  // }

  // for (let el = target; el; el = el.parentElement) {
  //   if (el.hasAttribute(UUID)) return date(el, getValue(target))
  // }
}

function getValue (element, unit) {
  for (let el = element; !unit && el; el = el.parentElement) unit = el.getAttribute(ATTR)
  return (MASK[unit] || '*').replace('*', element.value)
}

function input (control, next, mask) {
  const type = control.getAttribute('type')
  if (type === 'radio' || type === 'checkbox') control.checked = parse(getValue(control), next).getTime() === next.getTime()
  // else if (unit) {
  //   const json = new Date(next.getTime() - next.getTimezoneOffset() * 60000).toJSON()
  //   const [, month, day, hour, minute, second] = json.match(/\d+/g)
  //   const units = ({year: date.getFullYear(), month, day, hour, minute, second})
  //   control.value = units[unit]
  // }
}

function table (table, next) {
  const month = next.getMonth()
  const today = new Date().toJSON().slice(0, 10) // Get ymd part of date
  let day = parse('y-m-1 mon', next) // Monday in first week of month

  if (!table.firstElementChild) {
    table.innerHTML = `
    <thead><tr><th>${date.days.map(escapeHTML).join('</th><th>')}</th></tr></thead>
    <tbody ${ATTR}="y-m-*">${Array(7).join(`<tr>${Array(8).join(`<td><button></button></td>`)}</tr>`)}</tbody>`
  }

  table.createCaption().textContent = `${escapeHTML(date.months[month])}, ${next.getFullYear()}`

  queryAll('button', table).forEach((button) => {
    const isToday = day.toJSON().slice(0, 10) === today
    const isSelected = day.getTime() === next.getTime()
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

function select (select, next) {
  if (select.getAttribute(ATTR) === 'month' && !select.firstElementChild) {
    select.innerHTML = date.months.map((name, index) =>
      `<option value="${index + 1}">${escapeHTML(name)}</option>`
    ).join('')
  }

  queryAll(select.children).forEach((el) => {
    el.selected = parse(getValue(el), next).getTime() === next.getTime()
  })
}
