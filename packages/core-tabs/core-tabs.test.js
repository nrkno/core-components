import fs from 'fs'
import path from 'path'

const coreTabs = fs.readFileSync(path.resolve(__dirname, 'core-tabs.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-tabs', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreTabs)
  })

  it('sets up all properties', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect($('core-tabs').getAttribute('role')).toEqual('tablist')
    await expect($('#tab-1').getAttribute('aria-controls')).toEqual('panel-1')
    await expect($('#tab-1').getAttribute('role')).toEqual('tab')
    await expect($('#tab-1').getAttribute('tabindex')).toEqual('0')
    await expect($('#tab-1').getAttribute('aria-selected')).toEqual('true')
    await expect($('#tab-2').getAttribute('aria-controls')).toEqual('panel-2')
    await expect($('#tab-2').getAttribute('role')).toEqual('tab')
    await expect($('#tab-2').getAttribute('tabindex')).toEqual('-1')
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('false')
    await expect($('#panel-1').getAttribute('aria-labelledby')).toEqual('tab-1')
    await expect($('#panel-1').getAttribute('role')).toEqual('tabpanel')
    await expect($('#panel-1').getAttribute('tabindex')).toEqual('0')
    await expect($('#panel-1').getAttribute('hidden')).toEqual(null)
    await expect($('#panel-2').getAttribute('aria-labelledby')).toEqual('tab-2')
    await expect($('#panel-2').getAttribute('role')).toEqual('tabpanel')
    await expect($('#panel-2').getAttribute('tabindex')).toEqual('0')
    await expect($('#panel-2').getAttribute('hidden')).toEqual('true')
  })

  it('selects tab by index', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 1))
    await expect($('#tab-1').getAttribute('aria-selected')).toEqual('false')
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('true')
  })

  it('selects tab by id', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 'tab-2'))
    await expect($('#tab-1').getAttribute('aria-selected')).toEqual('false')
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('true')
  })

  it('selects tab by element', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = document.querySelector('#tab-2')))
    await expect($('#tab-1').getAttribute('aria-selected')).toEqual('false')
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('true')
  })

  it('respects for on tabs', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1" for="panel-1">First tab</button>
        <button id="tab-2" for="panel-2">Second tab</button>
      </core-tabs>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect($('#tab-1').getAttribute('aria-selected')).toEqual('true')
    await expect($('#tab-1').getAttribute('tabindex')).toEqual('0')
    await expect($('#panel-1').getAttribute('hidden')).toEqual(null)
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('false')
    await expect($('#tab-2').getAttribute('tabindex')).toEqual('-1')
    await expect($('#panel-2').getAttribute('hidden')).toEqual('true')
  })

  it('respects for for single panel', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1" for="panel-1">First tab</button>
        <button id="tab-2" for="panel-1">Second tab</button>
        <button id="tab-3" for="panel-2">Third tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 1))
    await expect($('#tab-2').getAttribute('aria-selected')).toEqual('true')
    await expect($('#panel-1').getAttribute('hidden')).toEqual(null)
    await expect($('#panel-2').getAttribute('hidden')).toEqual('true')
  })

  it('triggers toggle event', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => {
      document.addEventListener('tabs.toggle', ({ target }) => {
        document.body.appendChild(Object.assign(document.createElement('i'), { textContent: target.tab.id }))
      })
      document.querySelector('core-tabs').tab = 1
    })
    await expect(browser.isElementPresent($('i'))).toEqual(true)
    await expect($('i').getText()).toEqual('tab-2')
    await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-2')
  })
})
