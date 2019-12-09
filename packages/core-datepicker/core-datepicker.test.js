import parse from '@nrk/simple-date-parse'
import fs from 'fs'
import path from 'path'
import { attr, prop } from '../test-utils'

const coreDatepicker = fs.readFileSync(path.resolve(__dirname, 'core-datepicker.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')
const pad = (val) => `0${val}`.slice(-2)

const YEAR = '2019'
const MONTH = '04'
const DAY = '30'
const HOUR = '12'
const MINUTES = '44'
const SECONDS = '56'
const TIMESTAMP = `${YEAR}-${MONTH}-${DAY}T${HOUR}:${MINUTES}:${SECONDS}Z`

describe('core-datepicker', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreDatepicker)
  })

  it('sets up properties from date-attribute', async () => {
    await browser.executeScript((TIMESTAMP) => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date(TIMESTAMP).getTime()}">
        </core-datepicker>
      `
    }, TIMESTAMP)
    await expect(prop('core-datepicker', 'year')).toEqual(YEAR)
    await expect(prop('core-datepicker', 'month')).toEqual(MONTH)
    await expect(prop('core-datepicker', 'day')).toEqual(DAY)
    const hour = await browser.executeScript((TIMESTAMP) => new Date(TIMESTAMP).getHours(), TIMESTAMP)
    await expect(prop('core-datepicker', 'hour')).toEqual(pad(String(hour)))
    await expect(prop('core-datepicker', 'minute')).toEqual(MINUTES)
    await expect(prop('core-datepicker', 'second')).toEqual(SECONDS)
    await expect(prop('core-datepicker', 'days')).toEqual('man,tirs,ons,tors,fre,lør,søn')
    await expect(prop('core-datepicker', 'months')).toEqual('januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember')
  })

  it('does not have a value when set up without date-attribute', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker>
        </core-datepicker>
      `
    })
    // 'null' because prop casts to string. Actual value is just null
    await expect(prop('core-datepicker', 'year')).toEqual('null')
    await expect(prop('core-datepicker', 'month')).toEqual('null')
    await expect(prop('core-datepicker', 'day')).toEqual('null')
    await expect(prop('core-datepicker', 'hour')).toEqual('null')
    await expect(prop('core-datepicker', 'minute')).toEqual('null')
    await expect(prop('core-datepicker', 'second')).toEqual('null')
    await expect(prop('core-datepicker', 'timestamp')).toEqual('null')
    await expect(prop('core-datepicker', 'date')).toEqual('null')
  })

  it('supports simple-date-parse literals in date-attribute', async () => {
    const inputVal = 'now'
    const parsedNow = parse(inputVal)

    await browser.executeScript((inputVal) => {
      document.body.innerHTML = `
        <core-datepicker date="${inputVal}">
        </core-datepicker>
      `
    }, inputVal)

    await expect(prop('core-datepicker', 'year')).toEqual(String(parsedNow.getFullYear())) // Year is stringified for consistency and truthy '0'
    await expect(prop('core-datepicker', 'month')).toEqual(pad(parsedNow.getMonth() + 1)) // Month is 0-indexed
    await expect(prop('core-datepicker', 'day')).toEqual(pad(parsedNow.getDate()))
    await expect(prop('core-datepicker', 'hour')).toEqual(pad(String(parsedNow.getHours())))
    await expect(prop('core-datepicker', 'minute')).toEqual(pad(parsedNow.getMinutes()))
    await expect(prop('core-datepicker', 'second')).toEqual(pad(parsedNow.getSeconds()))
  })

  // handle removeAttribute('date') (set values to null), don't parse

  it('resets value when date-attribute is removed', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="now">
          <table></table>
        </core-datepicker>
      `
    })
    await expect(prop('core-datepicker', 'year')).toEqual(String(parse('now').getFullYear()))
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await browser.executeScript(() => {
      document.querySelector('core-datepicker').removeAttribute('date')
    })

    // 'null' because prop casts to string. Actual value is just null
    await expect(prop('core-datepicker', 'year')).toEqual('null')
    await expect(prop('core-datepicker', 'month')).toEqual('null')
    await expect(prop('core-datepicker', 'day')).toEqual('null')
    await expect(prop('core-datepicker', 'hour')).toEqual('null')
    await expect(prop('core-datepicker', 'minute')).toEqual('null')
    await expect(prop('core-datepicker', 'second')).toEqual('null')
    await expect(prop('core-datepicker', 'timestamp')).toEqual('null')
    await expect(prop('core-datepicker', 'date')).toEqual('null')
  })

  it('sets input values from date-attribute', async () => {
    await browser.executeScript((TIMESTAMP) => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date(TIMESTAMP).getTime()}">
          <input type="year">
          <input type="month">
          <input type="day">
          <input type="hour">
          <input type="minute">
          <input type="second">
          <input type="timestamp">
        </core-datepicker>
      `
    }, TIMESTAMP)
    await expect(prop('input[data-type="year"]', 'value')).toEqual(YEAR)
    await expect(prop('input[data-type="year"]', 'type')).toEqual('number')
    await expect(prop('input[data-type="month"]', 'value')).toEqual(MONTH)
    await expect(prop('input[data-type="month"]', 'type')).toEqual('number')
    await expect(prop('input[data-type="day"]', 'value')).toEqual(DAY)
    await expect(prop('input[data-type="day"]', 'type')).toEqual('number')
    const hour = await browser.executeScript((TIMESTAMP) => new Date(TIMESTAMP).getHours(), TIMESTAMP)
    await expect(prop('input[data-type="hour"]', 'value')).toEqual(pad(String(hour)))
    await expect(prop('input[data-type="hour"]', 'type')).toEqual('number')
    await expect(prop('input[data-type="minute"]', 'value')).toEqual(MINUTES)
    await expect(prop('input[data-type="minute"]', 'type')).toEqual('number')
    await expect(prop('input[data-type="second"]', 'value')).toEqual(SECONDS)
    await expect(prop('input[data-type="second"]', 'type')).toEqual('number')
    const timestamp = await prop('core-datepicker', 'timestamp')
    await expect(prop('input[data-type="timestamp"]', 'value')).toEqual(timestamp)
    await expect(prop('input[data-type="timestamp"]', 'type')).toEqual('number')
  })

  it('populates empty select with months', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker>
          <select></select>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker select option')))
    await expect(prop('core-datepicker select', 'childElementCount')).toEqual('12')
    for (let i = 1; i <= 12; i++) {
      await expect(prop(`option:nth-child(${i})`, 'value')).toEqual(`y-${i}-d`)
    }
    await expect(prop('option:nth-child(1)', 'textContent')).toEqual('januar')
    await expect(prop('option:nth-child(2)', 'textContent')).toEqual('februar')
    await expect(prop('option:nth-child(3)', 'textContent')).toEqual('mars')
    await expect(prop('option:nth-child(4)', 'textContent')).toEqual('april')
    await expect(prop('option:nth-child(5)', 'textContent')).toEqual('mai')
    await expect(prop('option:nth-child(6)', 'textContent')).toEqual('juni')
    await expect(prop('option:nth-child(7)', 'textContent')).toEqual('juli')
    await expect(prop('option:nth-child(8)', 'textContent')).toEqual('august')
    await expect(prop('option:nth-child(9)', 'textContent')).toEqual('september')
    await expect(prop('option:nth-child(10)', 'textContent')).toEqual('oktober')
    await expect(prop('option:nth-child(11)', 'textContent')).toEqual('november')
    await expect(prop('option:nth-child(12)', 'textContent')).toEqual('desember')
  })

  it('re-uses custom select', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker>
          <select>
            <option>---</option>
            <option value="2016-m-d">Set year to 2016</option>
            <option value="19yy-1-1">Back 100 years and set to January 1st.</option>
            <option value="1985-12-19">December 19, 1985</option>
          </select>
        </core-datepicker>
      `
    })
    await expect(prop('select', 'childElementCount')).toEqual('4')
    await expect(prop('option:nth-child(1)', 'value')).toEqual('---')
    await expect(prop('option:nth-child(2)', 'value')).toEqual('2016-m-d')
    await expect(prop('option:nth-child(3)', 'value')).toEqual('19yy-1-1')
  })

  it('populates empty table', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    const days = (await prop('core-datepicker', 'days')).split(',')
    await expect(days.length).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      await expect(prop(`thead tr th:nth-child(${i})`, 'textContent')).toEqual(days[i - 1])
    }
    await expect($$('table td button[data-adjacent="false"]').count()).toEqual(31)
    await expect(prop('button[autofocus]', 'textContent')).toEqual('1')
  })

  it('marks today\'s date in table', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date().getTime()}">
          <table></table>
        </core-datepicker>
      `
    })

    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('button[aria-current="date"]').isPresent()).toEqual(true)
    const browserDate = await browser.executeScript(() => new Date().getDate())
    await expect(prop('button[aria-current="date"]', 'textContent')).toEqual(String(browserDate))
  })

  it('changes date on day clicked', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect(prop('button[autofocus]', 'textContent')).toEqual('1')
    await $('tbody tr:nth-child(2) td:nth-child(5) button').click()
    await expect(prop('button[autofocus]', 'textContent')).toEqual('11')
  })

  it('changes date and focus on keyboard navigation as expected in adjacent table', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker id="focus-datepicker" date="${new Date('2019-01-01T12:00:00Z').getTime()}">
        </core-datepicker>
        <table data-for="focus-datepicker"></table>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker + table button')))
    await $('button[autofocus]').click()
    let activeElementVal = await browser.wait(() => browser.executeScript(() => document.activeElement.value))
    await expect(activeElementVal).toEqual('2019-1-1')
    await $('button[autofocus]').sendKeys(protractor.Key.ARROW_RIGHT)
    activeElementVal = await browser.wait(() => browser.executeScript(() => document.activeElement.value))
    await expect(activeElementVal).toEqual('2019-1-2')
  })

  it('changes month names', async () => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    await browser.executeScript((months) => {
      document.body.innerHTML = `
        <core-datepicker months="${months.join()}">
          <select></select>
        </core-datepicker>
      `
    }, months)
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker select option')))
    await expect(prop('select', 'childElementCount')).toEqual('12')
    for (let i = 1; i <= 12; i++) {
      await expect(prop(`option:nth-child(${i})`, 'textContent')).toEqual(months[i - 1])
    }
  })

  it('changes day names', async () => {
    const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    await browser.executeScript((days) => {
      document.body.innerHTML = `
        <core-datepicker days="${days.join()}">
          <table></table>
        </core-datepicker>
      `
    }, days)
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table thead')))
    await expect(prop('table thead tr', 'childElementCount')).toEqual('7')
    for (let i = 1; i <= 7; i++) {
      await expect(prop(`thead tr th:nth-child(${i})`, 'textContent')).toEqual(days[i - 1])
    }
  })

  it('disables elements from function', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
      document.querySelector('core-datepicker').disabled = (date) => {
        return date > new Date('2019-01-01T12:00:00Z')
      }
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect(attr('tbody tr:nth-child(1) td:nth-child(1) button', 'disabled')).toMatch(/(null|false)/i)
    // before the date
    await expect($('button:not(disabled)[value="2018-12-31"]').isPresent()).toBeTruthy()
    await expect($('button:not(disabled)[value="2019-1-1"]').isPresent()).toBeTruthy()
    // after
    await expect($('button:disabled[value="2019-1-2"]').isPresent()).toBeTruthy()
  })

  it('triggers change event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-01-01T12:00:00Z').getTime()}">
        </core-datepicker>
      `
      document.addEventListener('datepicker.change', (event) => (window.time = event.detail.getTime()))
      document.querySelector('core-datepicker').date = new Date('2019-01-02T12:00:00Z')
    })
    const time = await browser.executeScript(() => new Date('2019-01-02T12:00:00Z').getTime())
    await expect(browser.executeScript(() => window.time)).toEqual(time)
  })

  it('triggers click day event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date().getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await browser.executeScript(() => {
      document.addEventListener('datepicker.click.day', () => (window.triggered = true))
      document.querySelector('core-datepicker button').click()
    })
    await expect(browser.executeScript(() => window.triggered)).toEqual(true)
  })

  it('does not trigger change event when clicking selected date', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
      document.addEventListener('datepicker.change', () => (window.datepickerChange = true))
    })
    await $('button[autofocus]').click()
    await expect(browser.executeScript(() => window.datepickerChange)).toEqual(null)
  })

  it('does trigger change event when clicking selected date', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker>
          <table></table>
        </core-datepicker>
      `
      document.addEventListener('datepicker.change', () => (window.datepickerChange = true))
    })
    await $('button[tabindex="0"]').click()
    await expect(browser.executeScript(() => window.datepickerChange)).toEqual(true)
  })

  it('has month enabled if one day is disabled', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
      <core-datepicker date="${new Date('2019-05-06').getTime()}">
        <select></select>
      </core-datepicker>
      `
      const disabledDate = new Date('2019-09-06')

      document.querySelector('core-datepicker').disabled = (date) => {
        return date.valueOf() === disabledDate.valueOf()
      }
    })
    await expect(prop('option[value="y-9-d"]', 'disabled')).toEqual('false')
  })

  it('has month disabled if all days are disabled', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-05-06').getTime()}">
          <select></select>
        </core-datepicker>
      `
      document.querySelector('core-datepicker').disabled = (date) => {
        return date.getMonth() === 8
      }
    })
    await expect(prop('option[value="y-9-d"]', 'disabled')).toEqual('true')
  })

  it('selects first available date in month', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker date="${new Date('2019-12-09T00:00:00.00Z').getTime()}">
          <select></select>
          <input type="timestamp">
        </core-datepicker>
      `
      document.querySelector('core-datepicker').disabled = (date) => {
        return date.getMonth() === 10 && !(date < new Date('2019-11-06') && date > new Date('2019-11-03'))
      }
    })
    await $('option[value="y-11-d"]').click()
    const browserDate = await browser.executeScript(() => new Date('2019-11-04T00:00:00.00Z').getTime())
    await expect(prop('input[data-type="timestamp"]', 'value')).toEqual(String(browserDate))
  })
})
