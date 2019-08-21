import fs from 'fs'
import path from 'path'

const coreSuggest = fs.readFileSync(path.resolve(__dirname, 'core-suggest.min.js'), 'utf-8')

describe('core-suggest', () => {

  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(coreSuggest)
  })

  it('sets up properties', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden></core-suggest>`
    )
    await expect($('input').getAttribute('aria-autocomplete')).toEqual('list')
    await expect($('input').getAttribute('autocomplete')).toEqual('off')
    await expect($('input').getAttribute('aria-expanded')).toEqual('false')
  })

  it('opens suggestions on input focus', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden></core-suggest>`
    )
    await $('input').click()
    await expect($('input').getAttribute('aria-expanded')).toEqual('true')
    await expect($('core-suggest').getAttribute('hidden')).toEqual(null)
  })

  it('closes suggestions on click outside', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden></core-suggest>`
    )
    await $('input').click()
    await expect($('core-suggest').getAttribute('hidden')).toEqual(null)
    await $('body').click()
    await expect($('core-suggest').getAttribute('hidden')).toEqual('true')
  })

  it('sets input value to selected suggestion', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden>
        <ul>
          <li><button id="one">Suggest 1</button></li>
          <li><button id="two">Suggest 2</button></li>
        </ul>
      </core-suggest>
    `)
    await $('input').click()
    await $('button#two').click()
    await expect($('input').getAttribute('value')).toEqual('Suggest 2')
  })

  it('filters suggestions from input value', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden>
        <ul>
          <li><button>Suggest 1</button></li>
          <li><button>Suggest 2</button></li>
          <li><button>Suggest 3</button></li>
        </ul>
      </core-suggest>
    `)
    await $('input').sendKeys('2')
    await expect($('li:nth-child(1) button').getAttribute('hidden')).toEqual('true')
    await expect($('li:nth-child(2) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(3) button').getAttribute('hidden')).toEqual('true')
  })

  it('sets type="button" on all suggestion buttons', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden>
        <ul>
          <li><button>Suggest 1</button></li>
          <li><button>Suggest 2</button></li>
          <li><button>Suggest 3</button></li>
        </ul>
      </core-suggest>
    `)
    await expect($$('button').map((el) => el.getAttribute('type'))).toEqual(['button', 'button', 'button'])
  })

  it('sets up and parses limit option', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest hidden></core-suggest>`
    )
    await expect($('core-suggest').getAttribute('limit')).toEqual('Infinity')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = 2 ))
    await expect($('core-suggest').getAttribute('limit')).toEqual('2')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = -2 ))
    await expect($('core-suggest').getAttribute('limit')).toEqual('Infinity')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = null ))
    await expect($('core-suggest').getAttribute('limit')).toEqual('Infinity')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = undefined ))
    await expect($('core-suggest').getAttribute('limit')).toEqual('Infinity')
  })

  it('filters suggestions from limit option', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest limit="2" hidden>
        <ul>
          <li><button>Suggest 1</button></li>
          <li><button>Suggest 2</button></li>
          <li><button>Suggest 3</button></li>
          <li><button>Suggest 4</button></li>
        </ul>
      </core-suggest>
    `)
    await expect($('li:nth-child(1) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(2) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(3) button').getAttribute('hidden')).toEqual('true')
    await expect($('li:nth-child(4) button').getAttribute('hidden')).toEqual('true')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = 3 ))
    await $('input').sendKeys('s')
    await expect($('li:nth-child(1) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(2) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(3) button').getAttribute('hidden')).toEqual(null)
    await expect($('li:nth-child(4) button').getAttribute('hidden')).toEqual('true')
  })

  it('triggers ajax error on bad url', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <input type="text">
      <core-suggest ajax="https://foo" hidden></core-suggest>
    `)
    await browser.executeScript(() => {
      document.addEventListener('suggest.ajax.error', () => {
        document.body.appendChild(document.createElement('i'))
      })
    })
    await $('input').sendKeys('abc')
    await browser.wait(ExpectedConditions.presenceOf($('i')))
  })

  // TODO intercept requests -> jasmine-ajax?

  // it('triggers ajax error on bad status', async () => {
  //   await browser.executeScript((html) => (document.body.innerHTML = html), `
  //     <input type="text">
  //     <core-suggest ajax="http://bad-status" hidden></core-suggest>
  //   `)
  //   await page.setRequestInterception(true)
  //   page.on('request', (request) => request.respond({ status: 404 }))
  //   await page.evaluate(() => {
  //     document.addEventListener('suggest.ajax.error', () => (window.dispatched = true))
  //   })
  //   await $('input').sendKeys('abc')
  //   await page.waitForFunction('window.dispatched === true')
  //   t.pass()
  // })
  //
  // it('triggers ajax error on bad json', async () => {
  //   await browser.executeScript((html) => (document.body.innerHTML = html), `
  //     <input type="text">
  //     <core-suggest ajax="http://bad-json" hidden></core-suggest>
  //   `)
  //   await page.setRequestInterception(true)
  //   page.on('request', (request) => request.respond({ body: 'not json' }))
  //   await page.evaluate(() => {
  //     document.addEventListener('suggest.ajax.error', () => (window.dispatched = true))
  //   })
  //   await $('input').sendKeys('abc')
  //   await page.waitForFunction('window.dispatched === true')
  //   t.pass()
  // })

})
