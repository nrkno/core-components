import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const DAYS = ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function datepicker (elements, date = {}) {
  const options = date instanceof Date ? {date} : date
  const html = render(new Date(options.date || Date.now()))

  return queryAll(elements).map((input) => {
    input.setAttribute(UUID, '')
    input.nextElementSibling.innerHTML = html

    return input
  })
}

// http://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
function getMonday (date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day ? 1 : -6)
  return new Date(d.setDate(diff))
}

function render (date) {
  const today = new Date()
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  let current = getMonday(firstDayOfMonth)
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += `<tr>`
    for (let j = 0; j < 7; j++) {
      const isSameMonth = current.getMonth() === month
      const isToday = today.setHours(0, 0, 0, 0) === current.setHours(0, 0, 0, 0)
      const value = current.getDate() // TODO with month

      html += `<td>
        <button title="${isToday ? 'I dag' : ''}" aria-pressed="${value === day}"  style="${isSameMonth ? '' : 'opacity:.3'}${isToday ? ';color:red' : ''}">
          ${value}
        </button>
      </td>`
      current.setDate(value + 1)
    }
    html += '</tr>'
  }

  return `
    <label>
      <span>Måned</span>
      <select name="month">
        ${MONTHS.map((name, i) =>
    `<option value="${i}"${i === month ? 'selected' : ''}>${i + 1} - ${name}</option>`
  ).join('')}
      </select>
    </label>
    <label>
      <span>År</span>
      <input type="number" name="year" value="${year}">
    </label>
    <table>
      <caption>${MONTHS[month]}, ${year}</caption>
      <thead><tr><th>${DAYS.join('</th><th>')}</th></tr></thead>
      <tbody>${html}</tbody>
    </table>`
}

addEvent(UUID, 'change', (event) => {
  for (let el = event.target; el; el = el.parentElement) {
    const prev = el.previousElementSibling
    if (prev && prev.hasAttribute(UUID)) {
      // datepicker(prev, new Date(
      //   el.querySelector('[name="year"]').value,
      //   el.querySelector('[name="month"]').value,
      //   el.querySelector('[name="day"]:checked').value
      // ))
    }
  }
})
