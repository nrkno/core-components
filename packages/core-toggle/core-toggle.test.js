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
    expect(await page.$eval('button', button => button.getAttribute('aria-expanded'))).toEqual('false')
    expect(await page.$eval('button', button => button.getAttribute('aria-controls') === document.querySelector('core-toggle').id)).toEqual(true)
    expect(await page.$eval('core-toggle', toggle => toggle.hasAttribute('hidden'))).toEqual(true)
    expect(await page.$eval('core-toggle', toggle => toggle.getAttribute('aria-labelledby') === document.querySelector('button').id)).toEqual(true)
  })

  it('opens and closes toggle', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden></core-toggle>
    `)
    await page.evaluate(() => document.querySelector('button').click())
    expect(await page.$eval('button', button => button.getAttribute('aria-expanded'))).toEqual('true')
    await page.evaluate(() => document.querySelector('button').click())
    expect(await page.$eval('button', button => button.getAttribute('aria-expanded'))).toEqual('false')
    await page.evaluate(() => document.querySelector('core-toggle').hidden = false)
    expect(await page.$eval('button', button => button.getAttribute('aria-expanded'))).toEqual('true')
    await page.evaluate(() => document.querySelector('core-toggle').hidden = true)
    expect(await page.$eval('button', button => button.getAttribute('aria-expanded'))).toEqual('false')
  })

  it('closes on outside click with popup', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle popup hidden></core-toggle>
      <div>Something else</div>
    `)
    await page.evaluate(() => document.querySelector('button').click())
    expect(await page.$eval('core-toggle', toggle => toggle.hasAttribute('hidden'))).toEqual(false)
    await page.evaluate(() => document.querySelector('div').click())
    expect(await page.$eval('core-toggle', toggle => toggle.hasAttribute('hidden'))).toEqual(true)
  })

  it.skip('respects existing aria-controls', async () => {
    await page.setContent(`
      <div><button aria-controls="content">Toggle</button></div>
      <core-toggle id="content" hidden></core-toggle>
    `)
    expect(await page.$eval('core-toggle', toggle => toggle.getAttribute('aria-labelledby') === document.querySelector('button').id)).toEqual(true)
  })

  it('triggers toggle event', async () => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle hidden></core-toggle>
    `)
    await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        window.addEventListener('core-toggle.toggle', resolve)
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
        window.addEventListener('core-toggle.select', ({ detail }) => resolve(detail.id))
        const toggle = document.querySelector('core-toggle')
        toggle.hidden = false
        toggle.children[0].click()
      })
    })
    expect(selected).toEqual('item')
  })
})
