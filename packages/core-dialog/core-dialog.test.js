const puppeteer = require('puppeteer')
const path = require('path')
let browser, page

describe('core-dialog', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-dialog.min.js') })
  })

  afterAll(async () => { await browser.close() })

  it('sets up properties', async () => {
    await page.setContent(`
      <button for="dialog-1">Open</button>
      <core-dialog id="dialog-1" hidden></core-dialog>
    `)
    expect(await page.$eval('core-dialog', el => el.getAttribute('role'))).toEqual('dialog')
    expect(await page.$eval('core-dialog', el => el.getAttribute('aria-modal'))).toEqual('true')
  })

  it('opens and closes', async () => {
    await page.setContent(`
      <button for="dialog">Open</button>
      <core-dialog id="dialog" hidden>
        <div>Some content</div>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.click('button[for="dialog"]')
    expect(await page.$eval('core-dialog', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.click('button[for="close"]')
    expect(await page.$eval('core-dialog', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden'))).toEqual(true)
    await page.evaluate(() => (document.querySelector('core-dialog').hidden = false))
    expect(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.evaluate(() => (document.querySelector('core-dialog').hidden = true))
    expect(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('opens and closes nested', async () => {
    await page.setContent(`
      <button for="dialog-outer">Open</button>
      <core-dialog id="dialog-outer" hidden>
        <div>Some content</div>
        <button type="button" autofocus>Autofocus</button>
        <button for="dialog-inner">Open inner</button>
        <core-dialog id="dialog-inner" hidden>
          <div>Nested content</div>
          <button for="close">Close</button>
        </core-dialog>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.click('button[for="dialog-outer"]')
    await page.click('button[for="dialog-inner"]')
    expect(await page.$eval('#dialog-outer + backdrop', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#dialog-outer #dialog-inner + backdrop', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.click('#dialog-inner button[for="close"]')
    expect(await page.$eval('#dialog-inner', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('#dialog-inner + backdrop', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#dialog-outer + backdrop', el => el.hasAttribute('hidden'))).toEqual(false)
  })

  it('closes nested with esc', async () => {
    await page.setContent(`
      <button for="dialog-outer">Open</button>
      <core-dialog id="dialog-outer" hidden>
        <div>Some content</div>
        <button type="button" autofocus>Autofocus</button>
        <button for="dialog-inner">Open inner</button>
        <core-dialog id="dialog-inner" hidden>
          <div>Nested content</div>
          <button for="close">Close</button>
        </core-dialog>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.click('button[for="dialog-outer"]')
    await page.click('button[for="dialog-inner"]')
    await page.keyboard.press('Escape')
    expect(await page.$eval('#dialog-inner', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.keyboard.press('Escape')
    expect(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('respects aria-modal option', async () => {
    await page.setContent(`
      <button for="dialog">Open</button>
      <core-dialog id="dialog" aria-modal="false" hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.click('button[for="dialog"]')
    expect(await page.$eval('core-dialog', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('respects strict option', async () => {
    await page.setContent(`
      <button for="dialog">Open</button>
      <core-dialog id="dialog" strict hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.click('button[for="dialog"]')
    expect(await page.$eval('core-dialog', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.evaluate(() => document.querySelector('core-dialog + backdrop').click())
    expect(await page.$eval('core-dialog', el => el.hasAttribute('hidden'))).toEqual(false)
  })

  it('triggers toggle event', async () => {
    await page.setContent(`
      <button for="dialog">Open</button>
      <core-dialog id="dialog" hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('dialog.toggle', resolve)
        document.querySelector('core-dialog').hidden = false
      })
    })
  })
})
