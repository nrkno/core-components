import fs from 'fs'
import path from 'path'

const coreDatepicker = fs.readFileSync(path.resolve(__dirname, 'core-datepicker.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')
const pad = (val) => `0${val}`.slice(-2)

describe('core-datepicker', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreDatepicker)
  })

  it('sets up properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-04-30T12:44:56Z').getTime()}"> </core-datepicker>
      `
    })
    await expect($('core-datepicker').getAttribute('year')).toEqual('2019')
    await expect($('core-datepicker').getAttribute('month')).toEqual('04')
    await expect($('core-datepicker').getAttribute('day')).toEqual('30')
    const browserHours = await browser.executeScript('return new Date("2019-04-30T12:44:56Z").getHours()')
    await expect($('core-datepicker').getAttribute('hour')).toEqual(pad(String(browserHours)))
    await expect($('core-datepicker').getAttribute('minute')).toEqual('44')
    await expect($('core-datepicker').getAttribute('second')).toEqual('56')
    await expect(browser.executeScript(() => document.querySelector('core-datepicker').days.join(','))).toEqual('man,tirs,ons,tors,fre,lør,søn')
    await expect(browser.executeScript(() => document.querySelector('core-datepicker').months.join(',')))
      .toEqual('januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember')
  })

  it('sets input values from timestamp', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-04-30T10:44:56Z').getTime()}">
          <input type="year">
          <input type="month">
          <input type="day">
          <input type="hour">
          <input type="minute">
          <input type="second">
          <input type="timestamp">
        </core-datepicker>
      `
    })
    await expect($('core-datepicker input[data-type="year"]').getAttribute('value')).toEqual('2019')
    await expect($('core-datepicker input[data-type="year"]').getAttribute('type')).toEqual('number')
    await expect($('core-datepicker input[data-type="month"]').getAttribute('value')).toEqual('04')
    await expect($('core-datepicker input[data-type="month"]').getAttribute('type')).toEqual('number')
    await expect($('core-datepicker input[data-type="day"]').getAttribute('value')).toEqual('30')
    await expect($('core-datepicker input[data-type="day"]').getAttribute('type')).toEqual('number')
    const browserDate = await browser.executeScript(() => new Date('2019-04-30T10:44:56Z').getHours())
    await expect($('core-datepicker input[data-type="hour"]').getAttribute('value')).toEqual(pad(String(browserDate)))
    await expect($('core-datepicker input[data-type="hour"]').getAttribute('type')).toEqual('number')
    await expect($('core-datepicker input[data-type="minute"]').getAttribute('value')).toEqual('44')
    await expect($('core-datepicker input[data-type="minute"]').getAttribute('type')).toEqual('number')
    await expect($('core-datepicker input[data-type="second"]').getAttribute('value')).toEqual('56')
    await expect($('core-datepicker input[data-type="second"]').getAttribute('type')).toEqual('number')
    const timestamp = await $('core-datepicker').getAttribute('timestamp')
    await expect($('core-datepicker input[data-type="timestamp"]').getAttribute('value')).toEqual(timestamp)
    await expect($('core-datepicker input[data-type="timestamp"]').getAttribute('type')).toEqual('number')
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
    await expect(browser.executeScript(() => document.querySelector('core-datepicker select').childElementCount)).toEqual(12)
    for (let i = 1; i <= 12; i++) {
      await expect($(`core-datepicker option:nth-child(${i})`).getAttribute('value')).toEqual(`y-${i}-d`)
    }
    await expect($('core-datepicker option:nth-child(1)').getText()).toEqual('januar')
    await expect($('core-datepicker option:nth-child(2)').getText()).toEqual('februar')
    await expect($('core-datepicker option:nth-child(3)').getText()).toEqual('mars')
    await expect($('core-datepicker option:nth-child(4)').getText()).toEqual('april')
    await expect($('core-datepicker option:nth-child(5)').getText()).toEqual('mai')
    await expect($('core-datepicker option:nth-child(6)').getText()).toEqual('juni')
    await expect($('core-datepicker option:nth-child(7)').getText()).toEqual('juli')
    await expect($('core-datepicker option:nth-child(8)').getText()).toEqual('august')
    await expect($('core-datepicker option:nth-child(9)').getText()).toEqual('september')
    await expect($('core-datepicker option:nth-child(10)').getText()).toEqual('oktober')
    await expect($('core-datepicker option:nth-child(11)').getText()).toEqual('november')
    await expect($('core-datepicker option:nth-child(12)').getText()).toEqual('desember')
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
    await expect(browser.executeScript(() => document.querySelector('core-datepicker select').childElementCount)).toEqual(4)
    await expect($('core-datepicker option:nth-child(1)').getAttribute('value')).toEqual('---')
    await expect($('core-datepicker option:nth-child(2)').getAttribute('value')).toEqual('2016-m-d')
    await expect($('core-datepicker option:nth-child(3)').getAttribute('value')).toEqual('19yy-1-1')
  })

  it('populates empty table', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    const days = await browser.executeScript(() => document.querySelector('core-datepicker').days)
    await expect(days.length).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      await expect($(`core-datepicker thead tr th:nth-child(${i})`).getText()).toEqual(days[i - 1])
    }
    await expect($$('core-datepicker table td button[data-adjacent="false"]').count()).toEqual(31)
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('1')
  })

  it('marks today\'s date in table', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date().getTime()}">
          <table></table>
        </core-datepicker>
      `
    })

    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker button[aria-current="date"]').isPresent()).toEqual(true)
    const browserDate = await browser.executeScript('return new Date().getDate()')
    await expect($('core-datepicker button[aria-current="date"]').getText()).toEqual(String(browserDate))
  })

  it('changes date on day clicked', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('1')
    await $('core-datepicker tbody tr:nth-child(2) td:nth-child(5) button').click()
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('11')
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
    await expect(browser.executeScript(() => document.querySelector('core-datepicker select').childElementCount)).toEqual(12)
    for (let i = 1; i <= 12; i++) {
      await expect($(`core-datepicker option:nth-child(${i})`).getText()).toEqual(months[i - 1])
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
    await expect(browser.executeScript(() => document.querySelector('core-datepicker table thead tr').childElementCount)).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      await expect($(`core-datepicker thead tr th:nth-child(${i})`).getText()).toEqual(days[i - 1])
    }
  })

  it('disables elements from function', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-01-01T12:00:00Z').getTime()}">
          <table></table>
        </core-datepicker>
      `
    })
    await browser.executeScript(function () {
      document.querySelector('core-datepicker').disabled = function (date) {
        return date > new Date('2019-01-01T12:00:00Z')
      }
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker tbody tr:nth-child(1) td:nth-child(1) button').getAttribute('disabled')).toEqual(null)
    // before the date
    await expect($('button:not(disabled)[value="2018-12-31"]').isPresent()).toBeTruthy()
    await expect($('button:not(disabled)[value="2019-1-1"]').isPresent()).toBeTruthy()
    // after
    await expect($('button:disabled[value="2019-1-2"]').isPresent()).toBeTruthy()
  })

  it('triggers change event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-datepicker timestamp="${new Date('2019-01-01T12:00:00Z').getTime()}">
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
        <core-datepicker timestamp="${new Date().getTime()}">
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
})
