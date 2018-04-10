import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const DAYS = ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag', 'søndag']
const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
const RENDERS = {}

export default function datepicker (elements, date = {}) {
  const options = date instanceof Date ? {date} : date
  const dateObj = new Date(options.date || Date.now())

  return queryAll(elements).map((input) => {
    input.setAttribute(UUID, '')

    queryAll('[name],table', input.nextElementSibling).forEach((el) => {
      console.log(el)
      RENDERS[el.name || el.nodeName.toLowerCase()](el, dateObj)
    })

    return input
  })
}

RENDERS.month = (el, date) => {
  const month = date.getMonth()
  el.innerHTML = MONTHS.map((name, i) =>
    `<option value="${i}"${i === month ? 'selected' : ''}>${i + 1} - ${name}</option>`
  ).join('')
}

RENDERS.week = (el, date) => {
  el.value = 0
}

RENDERS.year = (el, date) => {
  el.value = date.getFullYear()
}

RENDERS.table = (el, date) => {
  const today = new Date()
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  let current = getMonday(firstDayOfMonth)
  let html = ''

  for (let i = 0; i < 6; i++) {
    html += '<tr>'
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

  el.innerHTML = `<caption>${MONTHS[month]}, ${year}</caption>
  <thead><tr><th>${DAYS.join('</th><th>')}</th></tr></thead>
  <tbody>${html}</tbody>`
}

// http://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
function getMonday (date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day ? 1 : -6)
  return new Date(d.setDate(diff))
}

function getWeek (date) {
  var date = new Date(date.getTime());
   date.setHours(0, 0, 0, 0);

  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);

  var jan4th = new Date(this.getFullYear(), 0, 4);
  return Math.ceil((((this - jan4th) / 86400000) + jan4th.getDay()+1)/7);

  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - jan4th.getTime()) / 86400000 - 3 + (jan4th.getDay() + 6) % 7) / 7);
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
