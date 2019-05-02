const path = require('path')

describe('core-datepicker', () => {
  beforeAll(async () => {
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-datepicker.min.js') })
  })

  it('sets up properties', async () => {
    const date = new Date('2019-04-30T10:44:56')
    await page.setContent(`<core-datepicker timestamp="${date.getTime()}"></core-datepicker>`)
    expect(await page.$eval('core-datepicker', el => el.year)).toEqual('2019')
    expect(await page.$eval('core-datepicker', el => el.month)).toEqual('04')
    expect(await page.$eval('core-datepicker', el => el.day)).toEqual('30')
    expect(await page.$eval('core-datepicker', el => el.hour)).toEqual('10')
    expect(await page.$eval('core-datepicker', el => el.minute)).toEqual('44')
    expect(await page.$eval('core-datepicker', el => el.second)).toEqual('56')
    expect(await page.$eval('core-datepicker', el => el.date.getTime())).toEqual(date.getTime())
    expect(await page.$eval('core-datepicker', el => el.days.join(','))).toEqual('man,tirs,ons,tors,fre,lør,søn')
    expect(await page.$eval('core-datepicker', el => el.months.join(',')))
      .toEqual('januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember')
  })

  it('sets input values from timestamp', async () => {
    const date = new Date('2019-04-30T10:44:56')
    await page.setContent(`
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
    expect(await page.$$eval('core-datepicker input', els => els.every(el => el.type === 'number'))).toEqual(true)
    expect(await page.$$eval('core-datepicker input', els => els.every(el => el.hasAttribute('data-type')))).toEqual(true)
    expect(await page.$eval('core-datepicker input[data-type="year"]', el => el.value)).toEqual('2019')
    expect(await page.$eval('core-datepicker input[data-type="month"]', el => el.value)).toEqual('04')
    expect(await page.$eval('core-datepicker input[data-type="day"]', el => el.value)).toEqual('30')
    expect(await page.$eval('core-datepicker input[data-type="hour"]', el => el.value)).toEqual('10')
    expect(await page.$eval('core-datepicker input[data-type="minute"]', el => el.value)).toEqual('44')
    expect(await page.$eval('core-datepicker input[data-type="second"]', el => el.value)).toEqual('56')
    expect(await page.$eval('core-datepicker input[data-type="timestamp"]', el => el.value)).toEqual(String(date.getTime()))
  })

  it('populates empty select with months', async () => {
    await page.setContent(`
      <core-datepicker>
        <select></select>
      </core-datepicker>
    `)
    await page.waitFor('core-datepicker select option')
    expect(await page.$eval('core-datepicker select', el => el.childElementCount)).toEqual(12)
    for (let i = 1; i <= 12; i++) {
      expect(await page.$eval(`core-datepicker option:nth-child(${i})`, el => el.value)).toEqual(`y-${i}-d`)
    }
    expect(await page.$eval('core-datepicker option:nth-child(1)', el => el.textContent)).toEqual('januar')
    expect(await page.$eval('core-datepicker option:nth-child(2)', el => el.textContent)).toEqual('februar')
    expect(await page.$eval('core-datepicker option:nth-child(3)', el => el.textContent)).toEqual('mars')
    expect(await page.$eval('core-datepicker option:nth-child(4)', el => el.textContent)).toEqual('april')
    expect(await page.$eval('core-datepicker option:nth-child(5)', el => el.textContent)).toEqual('mai')
    expect(await page.$eval('core-datepicker option:nth-child(6)', el => el.textContent)).toEqual('juni')
    expect(await page.$eval('core-datepicker option:nth-child(7)', el => el.textContent)).toEqual('juli')
    expect(await page.$eval('core-datepicker option:nth-child(8)', el => el.textContent)).toEqual('august')
    expect(await page.$eval('core-datepicker option:nth-child(9)', el => el.textContent)).toEqual('september')
    expect(await page.$eval('core-datepicker option:nth-child(10)', el => el.textContent)).toEqual('oktober')
    expect(await page.$eval('core-datepicker option:nth-child(11)', el => el.textContent)).toEqual('november')
    expect(await page.$eval('core-datepicker option:nth-child(12)', el => el.textContent)).toEqual('desember')
  })

  it('re-uses custom select', async () => {
    await page.setContent(`
      <core-datepicker>
        <select>
          <option>---</option>
          <option value="2016-m-d">Set year to 2016</option>
          <option value="19yy-1-1">Back 100 years and set to January 1st.</option>
          <option value="1985-12-19">December 19, 1985</option>
        </select>
      </core-datepicker>
    `)
    expect(await page.$eval('core-datepicker select', el => el.childElementCount)).toEqual(4)
    expect(await page.$eval('core-datepicker option:nth-child(1)', el => el.value)).toEqual('---')
    expect(await page.$eval('core-datepicker option:nth-child(2)', el => el.value)).toEqual('2016-m-d')
    expect(await page.$eval('core-datepicker option:nth-child(3)', el => el.value)).toEqual('19yy-1-1')
  })

  it('populates empty table', async () => {
    const date = new Date('2018-01-01')
    await page.setContent(`
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await page.waitFor('core-datepicker table button')
    const days = await page.$eval('core-datepicker', el => el.days)
    expect(days.length).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      expect(await page.$eval(`core-datepicker thead tr th:nth-child(${i})`, el => el.textContent)).toEqual(days[i-1])
    }
    expect(await page.$$eval(`core-datepicker table td button[data-adjacent="false"]`, els => els.length)).toEqual(31)
    expect(await page.$eval('core-datepicker button[autofocus]', el => el.textContent)).toEqual('1')
  })

  it('marks today\'s date in table', async () => {
    const date = new Date()
    await page.setContent(`
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await page.waitFor('core-datepicker table button')
    expect(await page.$eval('core-datepicker button[aria-current="date"]', el => el !== null)).toBeTruthy()
    expect(await page.$eval('core-datepicker button[aria-current="date"]', el => el.textContent)).toEqual(String(date.getDate()))
  })

  it('changes date on day clicked', async () => {
    const date = new Date('2018-01-01')
    await page.setContent(`
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await page.waitFor('core-datepicker table button')
    expect(await page.$eval('core-datepicker button[autofocus]', el => el.textContent)).toEqual('1')
    await page.click('core-datepicker tbody tr:nth-child(2) td:nth-child(5) button')
    expect(await page.$eval('core-datepicker button[autofocus]', el => el.textContent)).toEqual('12')
  })

  it('changes month names', async () => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    await page.setContent(`
      <core-datepicker months="${months.join()}">
        <select></select>
      </core-datepicker>`
    )
    await page.waitFor('core-datepicker select option')
    expect(await page.$eval('core-datepicker select', el => el.childElementCount)).toEqual(12)
    for (let i = 1; i <= 12; i++) {
      expect(await page.$eval(`core-datepicker option:nth-child(${i})`, el => el.textContent)).toEqual(months[i-1])
    }
  })

  it('changes day names', async () => {
    const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    await page.setContent(`
      <core-datepicker days="${days.join()}">
        <table></table>
      </core-datepicker>`
    )
    await page.waitFor('core-datepicker table thead')
    expect(await page.$eval('core-datepicker table thead tr', el => el.childElementCount)).toEqual(7)
    for (let i = 1; i <= 7; i++) {
      expect(await page.$eval(`core-datepicker thead tr th:nth-child(${i})`, el => el.textContent)).toEqual(days[i-1])
    }
  })

  it('disables elements from function', async () => {
    const date = new Date('2018-01-01')
    await page.setContent(`
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>
    `)
    await page.evaluate(() => document.querySelector('core-datepicker').disabled = date => date > new Date('2018-01-01'))
    await page.waitFor('core-datepicker table button')

    expect(await page.$eval('core-datepicker tbody tr:nth-child(1) td:nth-child(1) button', el => el.disabled)).toEqual(false)
    expect(await page.$$eval('core-datepicker tbody tr:nth-child(2) button', els => els.every(el => el.disabled))).toEqual(true)
    expect(await page.$$eval('core-datepicker tbody tr:nth-child(3) button', els => els.every(el => el.disabled))).toEqual(true)
    expect(await page.$$eval('core-datepicker tbody tr:nth-child(4) button', els => els.every(el => el.disabled))).toEqual(true)
  })

  it('triggers change event', async () => {
    const date = new Date('2018-01-01')
    const expected = new Date('2018-01-02')
    await page.setContent(`<core-datepicker timestamp="${date.getTime()}"></core-datepicker>`)
    const newDate = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('datepicker.change', ({ detail }) => resolve(detail.getTime()))
        document.querySelector('core-datepicker').date = new Date('2018-01-02')
      })
    })
    expect(newDate).toEqual(expected.getTime())
  })

  it('triggers click day event', async () => {
    const date = new Date('2018-01-01')
    await page.setContent(`
      <core-datepicker timestamp="${date.getTime()}">
        <table></table>
      </core-datepicker>`
    )
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('datepicker.click.day', resolve)
        document.querySelector('core-datepicker tbody tr:nth-child(2) td:nth-child(7) button').click()
      })
    })
  })
})
