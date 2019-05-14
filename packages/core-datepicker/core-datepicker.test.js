import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-datepicker.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up properties', withPage, async (t, page) => {
  const date = new Date('2019-04-30T10:44:56')
  await page.setContent(`<core-datepicker timestamp="${date.getTime()}"></core-datepicker>`)
  t.is(await page.$eval('core-datepicker', el => el.year), '2019')
  t.is(await page.$eval('core-datepicker', el => el.month), '04')
  t.is(await page.$eval('core-datepicker', el => el.day), '30')
  t.is(await page.$eval('core-datepicker', el => el.hour), '10')
  t.is(await page.$eval('core-datepicker', el => el.minute), '44')
  t.is(await page.$eval('core-datepicker', el => el.second), '56')
  t.is(await page.$eval('core-datepicker', el => el.date.getTime()), date.getTime())
  t.is(await page.$eval('core-datepicker', el => el.days.join(',')), 'man,tirs,ons,tors,fre,lør,søn')
  t.is(await page.$eval('core-datepicker', el => el.months.join(',')),
    'januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember')
})

test('sets input values from timestamp', withPage, async (t, page) => {
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
  t.true(await page.$$eval('core-datepicker input', els => els.every(el => el.type === 'number')))
  t.true(await page.$$eval('core-datepicker input', els => els.every(el => el.hasAttribute('data-type'))))
  t.is(await page.$eval('core-datepicker input[data-type="year"]', el => el.value), '2019')
  t.is(await page.$eval('core-datepicker input[data-type="month"]', el => el.value), '04')
  t.is(await page.$eval('core-datepicker input[data-type="day"]', el => el.value), '30')
  t.is(await page.$eval('core-datepicker input[data-type="hour"]', el => el.value), '10')
  t.is(await page.$eval('core-datepicker input[data-type="minute"]', el => el.value), '44')
  t.is(await page.$eval('core-datepicker input[data-type="second"]', el => el.value), '56')
  t.is(await page.$eval('core-datepicker input[data-type="timestamp"]', el => el.value), String(date.getTime()))
})

test('populates empty select with months', withPage, async (t, page) => {
  await page.setContent(`
    <core-datepicker>
      <select></select>
    </core-datepicker>
  `)
  await page.waitFor('core-datepicker select option')
  t.is(await page.$eval('core-datepicker select', el => el.childElementCount), 12)
  for (let i = 1; i <= 12; i++) {
    t.is(await page.$eval(`core-datepicker option:nth-child(${i})`, el => el.value), `y-${i}-d`)
  }
  t.is(await page.$eval('core-datepicker option:nth-child(1)', el => el.textContent), 'januar')
  t.is(await page.$eval('core-datepicker option:nth-child(2)', el => el.textContent), 'februar')
  t.is(await page.$eval('core-datepicker option:nth-child(3)', el => el.textContent), 'mars')
  t.is(await page.$eval('core-datepicker option:nth-child(4)', el => el.textContent), 'april')
  t.is(await page.$eval('core-datepicker option:nth-child(5)', el => el.textContent), 'mai')
  t.is(await page.$eval('core-datepicker option:nth-child(6)', el => el.textContent), 'juni')
  t.is(await page.$eval('core-datepicker option:nth-child(7)', el => el.textContent), 'juli')
  t.is(await page.$eval('core-datepicker option:nth-child(8)', el => el.textContent), 'august')
  t.is(await page.$eval('core-datepicker option:nth-child(9)', el => el.textContent), 'september')
  t.is(await page.$eval('core-datepicker option:nth-child(10)', el => el.textContent), 'oktober')
  t.is(await page.$eval('core-datepicker option:nth-child(11)', el => el.textContent), 'november')
  t.is(await page.$eval('core-datepicker option:nth-child(12)', el => el.textContent), 'desember')
})

test('re-uses custom select', withPage, async (t, page) => {
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
  t.is(await page.$eval('core-datepicker select', el => el.childElementCount), 4)
  t.is(await page.$eval('core-datepicker option:nth-child(1)', el => el.value), '---')
  t.is(await page.$eval('core-datepicker option:nth-child(2)', el => el.value), '2016-m-d')
  t.is(await page.$eval('core-datepicker option:nth-child(3)', el => el.value), '19yy-1-1')
})

test('populates empty table', withPage, async (t, page) => {
  const date = new Date('2018-01-01')
  await page.setContent(`
    <core-datepicker timestamp="${date.getTime()}">
      <table></table>
    </core-datepicker>
  `)
  await page.waitFor('core-datepicker table button')
  const days = await page.$eval('core-datepicker', el => el.days)
  t.is(days.length, 7)
  for (let i = 1; i <= 7; i++) {
    t.is(await page.$eval(`core-datepicker thead tr th:nth-child(${i})`, el => el.textContent), days[i - 1])
  }
  t.is(await page.$$eval(`core-datepicker table td button[data-adjacent="false"]`, els => els.length), 31)
  t.is(await page.$eval('core-datepicker button[autofocus]', el => el.textContent), '1')
})

test('marks today\'s date in table', withPage, async (t, page) => {
  const date = new Date()
  await page.setContent(`
    <core-datepicker timestamp="${date.getTime()}">
      <table></table>
    </core-datepicker>
  `)
  await page.waitFor('core-datepicker table button')
  t.true(await page.$eval('core-datepicker button[aria-current="date"]', el => el !== null))
  t.is(await page.$eval('core-datepicker button[aria-current="date"]', el => el.textContent), String(date.getDate()))
})

test('changes date on day clicked', withPage, async (t, page) => {
  const date = new Date('2018-01-01')
  await page.setContent(`
    <core-datepicker timestamp="${date.getTime()}">
      <table></table>
    </core-datepicker>
  `)
  await page.waitFor('core-datepicker table button')
  t.is(await page.$eval('core-datepicker button[autofocus]', el => el.textContent), '1')
  await page.click('core-datepicker tbody tr:nth-child(2) td:nth-child(5) button')
  t.is(await page.$eval('core-datepicker button[autofocus]', el => el.textContent), '12')
})

test('changes month names', withPage, async (t, page) => {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
  await page.setContent(`
    <core-datepicker months="${months.join()}">
      <select></select>
    </core-datepicker>`
  )
  await page.waitFor('core-datepicker select option')
  t.is(await page.$eval('core-datepicker select', el => el.childElementCount), 12)
  for (let i = 1; i <= 12; i++) {
    t.is(await page.$eval(`core-datepicker option:nth-child(${i})`, el => el.textContent), months[i - 1])
  }
})

test('changes day names', withPage, async (t, page) => {
  const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
  await page.setContent(`
    <core-datepicker days="${days.join()}">
      <table></table>
    </core-datepicker>`
  )
  await page.waitFor('core-datepicker table thead')
  t.is(await page.$eval('core-datepicker table thead tr', el => el.childElementCount), 7)
  for (let i = 1; i <= 7; i++) {
    t.is(await page.$eval(`core-datepicker thead tr th:nth-child(${i})`, el => el.textContent), days[i - 1])
  }
})

test('disables elements from function', withPage, async (t, page) => {
  const date = new Date('2018-01-01')
  await page.setContent(`
    <core-datepicker timestamp="${date.getTime()}">
      <table></table>
    </core-datepicker>
  `)
  await page.evaluate(() => (document.querySelector('core-datepicker').disabled = date => date > new Date('2018-01-01')))
  await page.waitFor('core-datepicker table button')

  t.false(await page.$eval('core-datepicker tbody tr:nth-child(1) td:nth-child(1) button', el => el.disabled))
  t.true(await page.$$eval('core-datepicker tbody tr:nth-child(2) button', els => els.every(el => el.disabled)))
  t.true(await page.$$eval('core-datepicker tbody tr:nth-child(3) button', els => els.every(el => el.disabled)))
  t.true(await page.$$eval('core-datepicker tbody tr:nth-child(4) button', els => els.every(el => el.disabled)))
})

test('triggers change event', withPage, async (t, page) => {
  const date = new Date('2018-01-01')
  const expected = new Date('2018-01-02')
  await page.setContent(`<core-datepicker timestamp="${date.getTime()}"></core-datepicker>`)
  const newDate = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('datepicker.change', ({ detail }) => resolve(detail.getTime()))
      document.querySelector('core-datepicker').date = new Date('2018-01-02')
    })
  })
  t.is(newDate, expected.getTime())
})

test('triggers click day event', withPage, async (t, page) => {
  const date = new Date('2018-01-01')
  await page.setContent(`
    <core-datepicker timestamp="${date.getTime()}">
      <table></table>
    </core-datepicker>`
  )
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('datepicker.click.day', resolve)
      document.querySelector('core-datepicker button').click()
    })
  })
  t.pass()
})
