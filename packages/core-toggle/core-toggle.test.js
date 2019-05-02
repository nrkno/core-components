const path = require('path')

describe('core-toggle', () => {
  beforeAll(async () => {
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-toggle.min.js') })
  })

  it('sets up all properties', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden></core-toggle>
    `)
    expect(await page.$eval('button', el => el.getAttribute('aria-expanded'))).toEqual('false')
    expect(await page.$eval('button', el => el.getAttribute('aria-controls') === document.querySelector('core-toggle').id)).toEqual(true)
    expect(await page.$eval('core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('core-toggle', el => el.getAttribute('aria-labelledby') === document.querySelector('button').id)).toEqual(true)
  })

  it('opens and closes toggle', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden></core-toggle>
    `)
    await page.click('button')
    expect(await page.$eval('button', el => el.getAttribute('aria-expanded'))).toEqual('true')
    await page.click('button')
    expect(await page.$eval('button', el => el.getAttribute('aria-expanded'))).toEqual('false')
    await page.click('button')
    expect(await page.$eval('button', el => el.getAttribute('aria-expanded'))).toEqual('true')
    await page.click('button')
    expect(await page.$eval('button', el => el.getAttribute('aria-expanded'))).toEqual('false')
  })

  it('opens and closes nested toggle', async () => {
    await page.setContent(`
      <button id="outer">Toggle outer</button>
      <core-toggle hidden>
        <button id="inner">Toggle inner</button>
        <core-toggle hidden>
          <div>Inner content</div>
        </core-toggle>
      </core-toggle>
    `)
    await page.click('button#outer')
    await page.click('button#inner')
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.click('button#inner')
    expect(await page.$eval('button#inner + core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.click('button#outer')
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('closes nested toggle with esc', async () => {
    await page.setContent(`
      <button id="outer">Toggle outer</button>
      <core-toggle hidden>
        <button id="inner">Toggle inner</button>
        <core-toggle hidden>
          <div>Inner content</div>
        </core-toggle>
      </core-toggle>
    `)
    await page.click('button#outer')
    await page.click('button#inner')
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.keyboard.press('Escape')
    expect(await page.$eval('button#inner + core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.keyboard.press('Escape')
    expect(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('closes on outside click with popup', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle popup hidden></core-toggle>
      <div>Something else</div>
    `)
    await page.click('button')
    expect(await page.$eval('core-toggle', el => el.hasAttribute('hidden'))).toEqual(false)
    await page.click('div')
    expect(await page.$eval('core-toggle', el => el.hasAttribute('hidden'))).toEqual(true)
  })

  it('respects existing for attribute', async () => {
    await page.setContent(`
      <div><button id="content">Toggle</button></div>
      <core-toggle for="content" hidden></core-toggle>
    `)
    expect(await page.$eval('core-toggle', el => el.button.getAttribute('aria-controls') === el.getAttribute('for'))).toEqual(true)
  })

  it('triggers toggle event', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden></core-toggle>
    `)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('toggle', resolve)
        document.querySelector('core-toggle').hidden = false
      })
    })
  })

  it('triggers select event', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden>
        <button id="item">Select me</button>
      </core-toggle>
    `)
    const selected = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('toggle.select', ({ detail }) => resolve(detail.id))
        const toggle = document.querySelector('core-toggle')
        toggle.hidden = false
        toggle.children[0].click()
      })
    })
    expect(selected).toEqual('item')
  })
})
