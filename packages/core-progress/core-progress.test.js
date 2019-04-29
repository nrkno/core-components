const path = require('path')

describe('core-progress', () => {
  beforeAll(async () => {
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-progress.min.js') })
  })

  it('sets up properties', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('role'))).toEqual('img')
    expect(await page.$eval('core-progress', el => el.getAttribute('type'))).toEqual('linear')
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
  })

  it('updates label from value', async () => {
    await page.setContent(`<core-progress value="0.2"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('20%')
    await page.evaluate(() => document.querySelector('core-progress').value = 0)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
    await page.evaluate(() => document.querySelector('core-progress').value = 1)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('100%')
  })

  it('updates label from value as radial', async () => {
    await page.setContent(`<core-progress value="0.2" type="radial"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('20%')
    await page.evaluate(() => document.querySelector('core-progress').value = 0)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('0%')
    await page.evaluate(() => document.querySelector('core-progress').value = 1)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('100%')
  })

  it('updates label from indeterminate value', async () => {
    await page.setContent(`<core-progress value="Loading..."></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('Loading...')
  })

  it('calculates percentage from max', async () => {
    await page.setContent(`<core-progress value="0.5"></core-progress>`)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('50%')
    await page.evaluate(() => document.querySelector('core-progress').max = 10)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('5%')
    await page.evaluate(() => document.querySelector('core-progress').max = 100)
    expect(await page.$eval('core-progress', el => el.getAttribute('aria-label'))).toEqual('1%')
  })

  it('triggers change event', async () => {
    await page.setContent(`<core-progress></core-progress>`)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('change', resolve)
        document.querySelector('core-progress').max = 2
      })
    })
  })
})
