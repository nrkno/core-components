const path = require('path')

describe('core-tabs', () => {
  beforeAll(async () => {
    await page.addScriptTag({ path: path.join(__dirname, 'core-tabs.min.js') })
    page.on('console', msg => console.log(msg))
  })

  it('should init with all props', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    expect(await page.$eval('core-tabs', el => el.getAttribute('role'))).toEqual('tablist')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-controls'))).toBeTruthy()
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-controls') === document.querySelector('#panel-1').id)).toEqual(true)
    expect(await page.$eval('#tab-1', el => el.getAttribute('role'))).toEqual('tab')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-controls'))).toBeTruthy()
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-controls') === document.querySelector('#panel-2').id)).toEqual(true)
    expect(await page.$eval('#tab-2', el => el.getAttribute('role'))).toEqual('tab')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby'))).toBeTruthy()
    expect(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby') === document.querySelector('#tab-1').id)).toEqual(true)
    expect(await page.$eval('#panel-1', el => el.getAttribute('role'))).toEqual('tabpanel')
    expect(await page.$eval('#panel-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby'))).toBeTruthy()
    expect(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby') === document.querySelector('#tab-2').id)).toEqual(true)
    expect(await page.$eval('#panel-2', el => el.getAttribute('role'))).toEqual('tabpanel')
    expect(await page.$eval('#panel-2', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })

it.skip('should init with reversed panels', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" aria-control="panel-1">First tab</button>
        <button id="tab-2" aria-controls="panel-2">Second tab</button>
      </core-tabs>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    `)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })


  it.skip('should init with active tab index', async () => {
    await page.setContent(`
      <core-tabs tab="2">
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(false)
  })

  it.skip('should respect for attribute?', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1" for="tab-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it.skip('should respect aria-controls on same panel', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" aria-controls="panel-1">First tab</button>
        <button id="tab-2" aria-controls="panel-1">Second tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby') === document.querySelector('#tab-1').id)).toEqual(true)
  })

  it.skip('should trigger tabs.toggle', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" aria-controls="panel-1">First tab</button>
        <button id="tab-2" aria-controls="panel-1">Second tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)

    const toggledTab = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('core-tabs.toggle', ({ target }) => resolve(target.tab.id))
        document.querySelector('core-tabs').tab = 1
      })
    })

    expect(toggledTab).toEqual('tab-2')
    expect(await page.$eval('core-tabs', el => el.tab.id)).toEqual(toggledTab)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
  })
})
