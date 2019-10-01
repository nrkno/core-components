import fs from 'fs'
import path from 'path'

const coreToggle = fs.readFileSync(path.resolve(__dirname, 'core-toggle.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-toggle', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreToggle)
  })

  it('sets up all properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await expect($('button').getAttribute('aria-expanded')).toEqual('false')
    const toggleId = await $('core-toggle').getAttribute('id')
    await expect($('button').getAttribute('aria-controls')).toEqual(toggleId)
    await expect($('core-toggle').getAttribute('hidden')).toEqual('true')
    const buttonId = await $('button').getAttribute('id')
    await expect($('core-toggle').getAttribute('aria-labelledby')).toEqual(buttonId)
  })

  it('opens and closes toggle', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await $('button').click()
    await expect($('button').getAttribute('aria-expanded')).toEqual('true')
    await expect($('core-toggle').getAttribute('hidden')).toEqual(null)
    await $('button').click()
    await expect($('button').getAttribute('aria-expanded')).toEqual('false')
    await expect($('core-toggle').getAttribute('hidden')).toEqual('true')
  })

  it('opens and closes nested toggle', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button id="outer">Toggle outer</button>
        <core-toggle hidden>
          <button id="inner">Toggle inner</button>
          <core-toggle hidden>
            <div>Inner content</div>
          </core-toggle>
        </core-toggle>
      `
    })
    await $('button#outer').click()
    await $('button#inner').click()
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await $('button#inner').click()
    await expect($('button#inner + core-toggle').getAttribute('hidden')).toEqual('true')
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await $('button#outer').click()
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual('true')
  })

  it('closes nested toggle with esc', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button id="outer">Toggle outer</button>
        <core-toggle hidden>
          <button id="inner">Toggle inner</button>
          <core-toggle hidden>
            <div>Inner content</div>
          </core-toggle>
        </core-toggle>
      `
    })
    await $('button#outer').click()
    await $('button#inner').click()
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await $('button#inner').sendKeys(protractor.Key.ESCAPE)
    await expect($('button#inner + core-toggle').getAttribute('hidden')).toEqual('true')
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual(null)
    await $('button#inner').sendKeys(protractor.Key.ESCAPE)
    await expect($('button#outer + core-toggle').getAttribute('hidden')).toEqual('true')
  })

  it('closes popup on click outside', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle popup hidden></core-toggle>
      `
    })
    await $('button').click()
    await expect($('core-toggle').getAttribute('hidden')).toEqual(null)
    await $('body').click()
    await expect($('core-toggle').getAttribute('hidden')).toEqual('true')
  })

  it('respects "for" attribute', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <div><button for="content">Toggle</button></div>
        <core-toggle id="content" hidden></core-toggle>
      `
    })
    const toggleId = await $('core-toggle').getAttribute('id')
    await expect($('button').getAttribute('for')).toEqual(toggleId)
    await expect($('button').getAttribute('aria-controls')).toEqual(toggleId)
  })

  it('respects exisiting aria-label with popup and value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button aria-label="Label">Toggle</button>
        <core-toggle popup="Another label" hidden></core-toggle>
      `
    })
    await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
    const toggleValue = await $('core-toggle').getAttribute('value')
    await expect($('button').getText()).toEqual(toggleValue)
    await expect($('button').getAttribute('aria-label')).toEqual('Label')
  })

  it('sets aria-label with popup attr and value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle popup="Some label" hidden></core-toggle>
      `
    })
    await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
    const toggleValue = await $('core-toggle').getAttribute('value')
    await expect($('button').getText()).toEqual(toggleValue)
    await expect($('button').getAttribute('aria-label')).toEqual('Button text,Some label')
  })

  it('sets aria-label with popup prop and value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await browser.executeScript(() => (document.querySelector('core-toggle').popup = 'Some label'))
    await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
    const toggleValue = await $('core-toggle').getAttribute('value')
    await expect($('button').getText()).toEqual(toggleValue)
    await expect($('button').getAttribute('aria-label')).toEqual('Button text,Some label')
  })

  it('triggers toggle event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
      document.addEventListener('toggle', () => (window.triggered = true))
      document.querySelector('core-toggle').hidden = false
    })
    const triggered = await browser.executeScript(() => window.triggered)
    await expect(triggered).toEqual(true)
  })

  it('triggers select event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden>
          <button id="my-item">Select me</button>
        </core-toggle>
      `
    })
    await browser.executeScript(() => {
      document.addEventListener('toggle.select', (event) => (window.itemId = event.detail.id))
      const toggle = document.querySelector('core-toggle')
      toggle.hidden = false
      toggle.children[0].click()
    })
    const itemId = await browser.wait(() => browser.executeScript(() => window.itemId))
    await expect(itemId).toEqual('my-item')
  })
})
