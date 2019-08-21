import fs from 'fs'
import path from 'path'

const coreDatepicker = fs.readFileSync(path.resolve(__dirname, 'core-datepicker.min.js'), 'utf-8')

describe('core-datepicker', () => {

  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(coreDatepicker)
  })

  it('sets up properties', async () => {
    const date = new Date('2019-04-30T10:44:56')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}"></core-datepicker>
    `)
    await expect($('core-datepicker').getAttribute('year')).toEqual('2019')
    await expect($('core-datepicker').getAttribute('month')).toEqual('04')
    await expect($('core-datepicker').getAttribute('day')).toEqual('30')
    await expect($('core-datepicker').getAttribute('hour')).toEqual('10')
    await expect($('core-datepicker').getAttribute('minute')).toEqual('44')
    await expect($('core-datepicker').getAttribute('second')).toEqual('56')
    await expect(browser.executeScript(() => document.querySelector('core-datepicker').date.getTime())).toEqual(date.getTime())
    await expect(browser.executeScript(() => document.querySelector('core-datepicker').days.join(','))).toEqual('man,tirs,ons,tors,fre,lør,søn')
    await expect(browser.executeScript(() => document.querySelector('core-datepicker').months.join(',')))
      .toEqual('januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember')
  })

  it('sets input values from timestamp', async () => {
    const date = new Date('2019-04-30T10:44:56')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <input type="year">
        <input type="month">
        <input type="day">
        <input type="hour">
        <input type="minute">
        <input type="second">
        <input type="timestamp">
      </core-datepicker>
    `)
    await $$('core-datepicker input').each(el => expect(el.getAttribute('type')).toEqual('number'))
    await $$('core-datepicker input').each(el => expect(el.getAttribute('data-type')).toBeTruthy())
    await expect($('core-datepicker input[data-type="year"]').getAttribute('value')).toEqual('2019')
    await expect($('core-datepicker input[data-type="month"]').getAttribute('value')).toEqual('04')
    await expect($('core-datepicker input[data-type="day"]').getAttribute('value')).toEqual('30')
    await expect($('core-datepicker input[data-type="hour"]').getAttribute('value')).toEqual('10')
    await expect($('core-datepicker input[data-type="minute"]').getAttribute('value')).toEqual('44')
    await expect($('core-datepicker input[data-type="second"]').getAttribute('value')).toEqual('56')
    await expect($('core-datepicker input[data-type="timestamp"]').getAttribute('value')).toEqual(String(date.getTime()))
  })

  it('populates empty select with months', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker>
        <select></select>
      </core-datepicker>
    `)
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
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker>
        <select>
          <option>---</option>
          <option value="2016-m-d">Set year to 2016</option>
          <option value="19yy-1-1">Back 100 years and set to January 1st.</option>
          <option value="1985-12-19">December 19, 1985</option>
        </select>
      </core-datepicker>
    `)
    await expect(browser.executeScript(() => document.querySelector('core-datepicker select').childElementCount)).toEqual(4)
    await expect($('core-datepicker option:nth-child(1)').getAttribute('value')).toEqual('---')
    await expect($('core-datepicker option:nth-child(2)').getAttribute('value')).toEqual('2016-m-d')
    await expect($('core-datepicker option:nth-child(3)').getAttribute('value')).toEqual('19yy-1-1')
  })

  it('populates empty table', async () => {
    const date = new Date('2018-01-01')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    const days = await browser.executeScript(() => document.querySelector('core-datepicker').days)
    await expect(days.length).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      await expect($(`core-datepicker thead tr th:nth-child(${i})`).getText()).toEqual(days[i - 1])
    }
    await expect($$(`core-datepicker table td button[data-adjacent="false"]`).count()).toEqual(31)
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('1')
  })

  it('marks today\'s date in table', async () => {
    const date = new Date()
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker button[aria-current="date"]').isPresent()).toEqual(true)
    await expect($('core-datepicker button[aria-current="date"]').getText()).toEqual(String(date.getDate()))
  })

  it('changes date on day clicked', async () => {
    const date = new Date('2018-01-01')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('1')
    await $('core-datepicker tbody tr:nth-child(2) td:nth-child(5) button').click()
    await expect($('core-datepicker button[autofocus]').getText()).toEqual('12')
  })

  it('changes month names', async () => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker months="${months.join()}">
        <select></select>
      </core-datepicker>`
    )
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker select option')))
    await expect(browser.executeScript(() => document.querySelector('core-datepicker select').childElementCount)).toEqual(12)
    for (let i = 1; i <= 12; i++) {
      await expect($(`core-datepicker option:nth-child(${i})`).getText()).toEqual(months[i - 1])
    }
  })

  it('changes day names', async () => {
    const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker days="${days.join()}">
        <table></table>
      </core-datepicker>`
    )
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table thead')))
    await expect(browser.executeScript(() => document.querySelector('core-datepicker table thead tr').childElementCount)).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      await expect($(`core-datepicker thead tr th:nth-child(${i})`).getText()).toEqual(days[i - 1])
    }
  })

  it('disables elements from function', async () => {
    const date = new Date('2018-01-01')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await browser.executeScript(() => (document.querySelector('core-datepicker').disabled = (date) => date > new Date('2018-01-01')))
    await browser.wait(ExpectedConditions.presenceOf($('core-datepicker table button')))
    await expect($('core-datepicker tbody tr:nth-child(1) td:nth-child(1) button').getAttribute('disabled')).toEqual(null)
    await $$('core-datepicker tbody tr:nth-child(2) button').each((el) => expect(el.getAttribute('disabled')).toEqual('true'))
    await $$('core-datepicker tbody tr:nth-child(3) button').each((el) => expect(el.getAttribute('disabled')).toEqual('true'))
    await $$('core-datepicker tbody tr:nth-child(4) button').each((el) => expect(el.getAttribute('disabled')).toEqual('true'))
  })

  it('triggers change event', async () => {
    const date = new Date('2018-01-01')
    const expected = new Date('2018-01-02')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}"></core-datepicker>
    `)
    await browser.executeScript(() => {
      document.addEventListener('datepicker.change', ({ detail }) => {
        document.body.appendChild(Object.assign(document.createElement('i'), { textContent: detail.getTime() }))
      })
      document.querySelector('core-datepicker').date = new Date('2018-01-02')
    })
    await expect(browser.isElementPresent($('i'))).toEqual(true)
    await expect($('i').getText()).toEqual(String(expected.getTime()))
  })

  it('triggers click day event', async () => {
    const date = new Date('2018-01-01')
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>`
    )
    await browser.executeScript(() => {
      document.addEventListener('datepicker.click.day', () => (document.body.appendChild(document.createElement('i'))))
      document.querySelector('core-datepicker button').click()
    })
    await expect(browser.isElementPresent($('i'))).toEqual(true)
  })
})
