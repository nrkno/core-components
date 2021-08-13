import fs from 'fs'
import path from 'path'
import { prop, attr } from '../test-utils'

const coreTabs = fs.readFileSync(path.resolve(__dirname, 'core-tabs.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-tabs', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreTabs)
  })

  it('sets up all properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect(attr('core-tabs', 'role')).toEqual('tablist')
    await expect(attr('#tab-1', 'aria-controls')).toEqual('panel-1')
    await expect(attr('#tab-1', 'role')).toEqual('tab')
    await expect(attr('#tab-1', 'tabindex')).toEqual('0')
    await expect(attr('#tab-1', 'aria-selected')).toMatch(/true/i)
    await expect(attr('#tab-2', 'aria-controls')).toEqual('panel-2')
    await expect(attr('#tab-2', 'role')).toEqual('tab')
    await expect(attr('#tab-2', 'tabindex')).toEqual('-1')
    await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
    await expect(attr('#panel-1', 'aria-labelledby')).toEqual('tab-1')
    await expect(attr('#panel-1', 'role')).toEqual('tabpanel')
    await expect(attr('#panel-1', 'tabindex')).toEqual('0')
    await expect(prop('#panel-1', 'hidden')).toMatch(/(null|false)/i)
    await expect(attr('#panel-2', 'aria-labelledby')).toEqual('tab-2')
    await expect(attr('#panel-2', 'role')).toEqual('tabpanel')
    await expect(attr('#panel-2', 'tabindex')).toEqual('0')
    await expect(prop('#panel-2', 'hidden')).toMatch(/true/i)
  })

  it('selects tab by index', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
          <button id="tab-3">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 1))
    await expect(attr('#tab-1', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-2', 'aria-selected')).toMatch(/true/i)
    await expect(attr('#tab-3', 'aria-selected')).toEqual('false')
  })

  it('selects first tab by index', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
          <button id="tab-3">Third tab</button>
        </core-tabs>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 0))
    await expect(attr('#tab-1', 'aria-selected')).toMatch(/true/i)
    await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-3', 'aria-selected')).toEqual('false')
  })

  it('selects tab by id', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 'tab-2'))
    await expect(attr('#tab-1', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-2', 'aria-selected')).toMatch(/true/i)
  })

  it('selects tab by element', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = document.querySelector('#tab-2')))
    await expect(attr('#tab-1', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-2', 'aria-selected')).toMatch(/true/i)
  })

  it('respects "data-for" on tabs', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1" data-for="panel-1">First tab</button>
          <button id="tab-2" data-for="panel-2">Second tab</button>
        </core-tabs>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-1">Text of tab 1</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect(attr('#tab-1', 'aria-selected')).toMatch(/true/i)
    await expect(attr('#tab-1', 'tabindex')).toEqual('0')
    await expect(prop('#panel-1', 'hidden')).toMatch(/(null|false)/i)
    await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-2', 'tabindex')).toEqual('-1')
    await expect(prop('#panel-2', 'hidden')).toMatch(/true/i)
  })

  it('respects deprecated "for" on tabs', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1" for="panel-1">First tab</button>
          <button id="tab-2" for="panel-2">Second tab</button>
        </core-tabs>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-1">Text of tab 1</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect(attr('#tab-1', 'aria-selected')).toMatch(/true/i)
    await expect(attr('#tab-1', 'tabindex')).toEqual('0')
    await expect(prop('#panel-1', 'hidden')).toMatch(/(null|false)/i)
    await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
    await expect(attr('#tab-2', 'tabindex')).toEqual('-1')
    await expect(prop('#panel-2', 'hidden')).toMatch(/true/i)
  })

  it('respects for for single panel', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1" data-for="panel-1">First tab</button>
          <button id="tab-2" data-for="panel-1">Second tab</button>
          <button id="tab-3" data-for="panel-2">Third tab</button>
        </core-tabs>
        <p>I'm an element</p>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => (document.querySelector('core-tabs').tab = 1))
    await expect(attr('#tab-2', 'aria-selected')).toMatch(/true/i)
    await expect(prop('#panel-1', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#panel-2', 'hidden')).toMatch(/true/i)
  })

  it('triggers toggle event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await browser.executeScript(() => {
      document.addEventListener('tabs.toggle', (event) => (window.tabId = event.target.tab.id))
      document.querySelector('core-tabs').tab = 1
    })
    const tabId = await browser.wait(() => browser.executeScript(() => window.tabId))
    await expect(tabId).toEqual('tab-2')
    await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-2')
  })
})
