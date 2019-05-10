const puppeteer = require('puppeteer')
const path = require('path')
let browser, page

describe('core-progress', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-progress.min.js') })
  })

  afterAll(async () => { await browser.close() })

  it('sets up properties', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    expect(await page.$eval('core-progress', el => el.type)).toEqual('linear')
    expect(await page.$eval('core-progress', el => el.value)).toEqual(0)
    expect(await page.$eval('core-progress', el => el.getAttribute('role'))).toEqual('img')
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
  })

  it('updates label from value', async () => {
    await page.setContent(`<core-progress value="0.2"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('20%')
    await page.evaluate(() => (document.querySelector('core-progress').value = 0))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
    await page.evaluate(() => (document.querySelector('core-progress').value = 1))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('100%')
  })

  it('updates label from value as radial', async () => {
    await page.setContent(`<core-progress value="0.2" type="radial"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('20%')
    await page.evaluate(() => (document.querySelector('core-progress').value = 0))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
    await page.evaluate(() => (document.querySelector('core-progress').value = 1))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('100%')
  })

  it('updates label from indeterminate value', async () => {
    await page.setContent(`<core-progress value="Loading..."></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('Loading...')
  })

  it('calculates percentage from max', async () => {
    await page.setContent(`<core-progress value="0.5"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('50%')
    await page.evaluate(() => (document.querySelector('core-progress').max = 10))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('5%')
    await page.evaluate(() => (document.querySelector('core-progress').max = 100))
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('1%')
  })

  it('does not trigger change event on max', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('change', reject)
        document.querySelector('core-progress').max = 2
        setTimeout(resolve)
      })
    })
  })

  it('triggers change event on value', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('change', resolve)
        document.querySelector('core-progress').value = 2
      })
    })
  })

  it('triggers change event on indeterminate value', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('change', resolve)
        document.querySelector('core-progress').value = 'Loading...'
      })
    })
  })
})
