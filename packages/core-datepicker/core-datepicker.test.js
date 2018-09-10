const coreDatepicker = require('./core-datepicker.min')

const standardHTML = `
<div class="my-datepicker">
  <input type="timestamp" />
  <select></select>
  <table></table>
</div>
`

const customSelectHTML = `
<div class="my-datepicker">
  <input type="timestamp" />
  <select>
    <option value="2016-m-d">Set year to 2016</option>
    <option value="19yy-1-1">Back 100 years and set to January 1st.</option>
    <option value="1985-12-19">December 19, 1985</option>
  </select>
  <select></select>
  <table></table>
</div>
`

describe('core-datepicker', () => {
  beforeEach(() => {
    coreDatepicker.months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember']
    coreDatepicker.days = ['man', 'tirs', 'ons', 'tors', 'fre', 'lør', 'søn']
  })

  it('should exists', () => {
    expect(coreDatepicker).toBeInstanceOf(Function)
  })

  it('should dispatch render when datepicker is initialized ', () => {
    document.body.innerHTML = standardHTML
    const callback = jest.fn()
    const datepickerEl = document.querySelector('.my-datepicker')

    datepickerEl.addEventListener('datepicker.render', callback)

    coreDatepicker(datepickerEl)
    expect(callback).toBeCalled()
  })

  it('should set selected date if date parameter is set', () => {
    document.body.innerHTML = standardHTML
    const datepickerEl = document.querySelector('.my-datepicker')
    const now = new Date()

    coreDatepicker(datepickerEl, now.getTime())
    expect(Number(datepickerEl.querySelector('input').value)).toEqual(now.getTime())
  })

  it('should change month names in select when replacing months property', () => {
    document.body.innerHTML = standardHTML
    const monthsEn = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    const datepickerEl = document.querySelector('.my-datepicker')

    coreDatepicker.months = monthsEn

    coreDatepicker(datepickerEl)
    datepickerEl.querySelectorAll('select option').forEach((option, index) => {
      expect(option.textContent).toEqual(monthsEn[index])
    })
  })

  it('should change days names in table when replacing days property', () => {
    document.body.innerHTML = standardHTML
    const daysTest = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    const datepickerEl = document.querySelector('.my-datepicker')

    coreDatepicker.days = daysTest
    coreDatepicker(datepickerEl)
    datepickerEl.querySelectorAll('thead tr th').forEach((option, index) => {
      expect(option.textContent).toEqual(daysTest[index])
    })
  })

  describe('<input />', () => {
    it('should set selected year if input is type year', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test year type
      inputEl.type = 'year'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getFullYear())
    })

    it('should set selected month if input is type month', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test month type
      inputEl.type = 'month'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getMonth() + 1)
    })

    it('should set selected day if input is type day', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test day type
      inputEl.type = 'day'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getDate())
    })

    it('should set selected hour if input is type hour', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test hour type
      inputEl.type = 'hour'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getHours())
    })

    it('should set selected minute if input is type minute', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test minute type
      inputEl.type = 'minute'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getMinutes())
    })

    it('should set selected second if input is type second', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const inputEl = datepickerEl.querySelector('input')
      const now = new Date()

      // Test second type
      inputEl.type = 'second'

      coreDatepicker(datepickerEl, now.getTime())
      expect(Number(inputEl.value)).toEqual(now.getSeconds())
    })
  })

  describe('<select>', () => {
    it('should use custom select if specified and not overwrite options', () => {
      document.body.innerHTML = customSelectHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const selectEl = datepickerEl.querySelector('select')

      coreDatepicker(datepickerEl)
      expect(selectEl.childElementCount).toEqual(3)
      expect(selectEl.children[0].value).toEqual('2016-m-d')
      expect(selectEl.children[0].textContent).toEqual('Set year to 2016')
    })

    it('should support multiple select (one custom and one default)', () => {
      document.body.innerHTML = customSelectHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const selectsEl = datepickerEl.querySelectorAll('select')

      coreDatepicker(datepickerEl)
      expect(selectsEl.length).toEqual(2)
      expect(selectsEl[0].children[0].textContent).toEqual('Set year to 2016')
      expect(selectsEl[1].children[0].textContent).toEqual(coreDatepicker.months[0])
    })
  })

  describe('<table>', () => {
    it('should show days of the week in header', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      coreDatepicker(datepickerEl)

      const tableHeaders = datepickerEl.querySelectorAll('table th')
      expect(tableHeaders.length).toEqual(7)
      tableHeaders.forEach((el, i) => expect(el.textContent).toEqual(coreDatepicker.days[i]))
    })
    it('should display the current month with all dates', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const tableEl = datepickerEl.querySelector('table')
      const nowJan = new Date()
      // Set date to January so we can always assume 31 days in the month
      nowJan.setMonth(0)

      coreDatepicker(datepickerEl, nowJan)

      expect(tableEl.querySelectorAll('tbody td button[aria-disabled="false"]').length).toEqual(31)
    })
    it('should change date if a day is clicked', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const tableEl = datepickerEl.querySelector('table')
      // Fri Jan 12 2018
      const current = new Date(1515774608994)

      coreDatepicker(datepickerEl, current)
      const jan1Btn = tableEl.querySelector('tbody tr td button')
      const jan12Btn = tableEl.querySelector('tbody tr:nth-child(2) td:nth-child(5) button')

      jan1Btn.click()
      expect(jan1Btn.getAttribute('data-core-datepicker-selected')).toEqual('true')
      expect(jan12Btn.getAttribute('data-core-datepicker-selected')).toEqual('false')
    })

    it('should disable the dates specified by disable method', () => {
      document.body.innerHTML = standardHTML
      const datepickerEl = document.querySelector('.my-datepicker')
      const tableEl = datepickerEl.querySelector('table')
      // Fri Jan 12 2018
      const current = new Date(1515774608994)

      datepickerEl.addEventListener('datepicker.render', (event) => {
        event.detail.disable((date) => date > current)
      })

      coreDatepicker(datepickerEl, current)

      const currentBtn = tableEl.querySelector('tbody tr:nth-child(2) td:nth-child(5) button')
      const prevBtn = tableEl.querySelector('tbody tr:nth-child(2) td:nth-child(4) button')
      const nextBtn = tableEl.querySelector('tbody tr:nth-child(2) td:nth-child(6) button')

      expect(currentBtn.hasAttribute('disabled')).toBe(false)
      expect(prevBtn.hasAttribute('disabled')).toBe(false)
      expect(nextBtn.hasAttribute('disabled')).toBe(true)
      tableEl.querySelectorAll('tbody tr:nth-child(3) td')
        .forEach((td) => expect(td.children[0].hasAttribute('disabled')).toEqual(true))
    })
  })
})
