const path = require('path')

describe('core-tabs', () => {
  beforeAll(async () => {
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-tabs.min.js') })
  })

  it('sets up all properties', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    expect(await page.$eval('core-tabs', el => el.getAttribute('role'))).toEqual('tablist')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-controls'))).toBeTruthy()
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-controls') === 'panel-1')).toEqual(true)
    expect(await page.$eval('#tab-1', el => el.getAttribute('role'))).toEqual('tab')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-controls'))).toBeTruthy()
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-controls') === 'panel-2')).toEqual(true)
    expect(await page.$eval('#tab-2', el => el.getAttribute('role'))).toEqual('tab')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby'))).toBeTruthy()
    expect(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby') === 'tab-1')).toEqual(true)
    expect(await page.$eval('#panel-1', el => el.getAttribute('role'))).toEqual('tabpanel')
    expect(await page.$eval('#panel-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby'))).toBeTruthy()
    expect(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby') === 'tab-2')).toEqual(true)
    expect(await page.$eval('#panel-2', el => el.getAttribute('role'))).toEqual('tabpanel')
    expect(await page.$eval('#panel-2', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('selects tab by index', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    await page.evaluate(() => document.querySelector('core-tabs').tab = 1)
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
  })

  it('selects tab by id', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    await page.evaluate(() => document.querySelector('core-tabs').tab = 'tab-2')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
  })

  it('selects tab by element', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    await page.evaluate(() => document.querySelector('core-tabs').tab = document.querySelector('#tab-2'))
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
  })

  it('respects aria-controls on tabs', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" aria-controls="panel-1">First tab</button>
        <button id="tab-2" aria-controls="panel-2">Second tab</button>
      </core-tabs>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    expect(await page.$eval('#tab-1', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#tab-1', el => el.getAttribute('tabindex'))).toEqual('0')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('false')
    expect(await page.$eval('#tab-2', el => el.getAttribute('tabindex'))).toEqual('-1')
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('respects aria-controls for single panel', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" aria-controls="panel-1">First tab</button>
        <button id="tab-2" aria-controls="panel-1">Second tab</button>
        <button id="tab-3" aria-controls="panel-2">Third tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    await page.evaluate(() => document.querySelector('core-tabs').tab = 1)
    expect(await page.$eval('#tab-2', el => el.getAttribute('aria-selected'))).toEqual('true')
    expect(await page.$eval('#panel-1', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('#panel-2', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('triggers toggle event', async () => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await page.waitFor('core-tabs [role="tab"]')
    const toggledTab = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('tabs.toggle', ({ target }) => resolve(target.tab.id))
        document.querySelector('core-tabs').tab = 1
      })
    })
    expect(toggledTab).toEqual('tab-2')
    expect(await page.$eval('core-tabs', el => el.tab.id)).toEqual(toggledTab)
  })
})
