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
    await expect(attr('#panel-2', 'aria-labelledby')).toMatch(/null/i)
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

  it('accepts 0 as valid value to select first tab by index', async () => {
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

  it('respects "data-for" for single panel', async () => {
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

  it('respects hidden panels as indication of active tab', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-tabs id="dynamicInstance">
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1" hidden>Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `
    })
    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await expect(prop('#panel-1', 'hidden')).toEqual('true')
    await expect(prop('#panel-2', 'hidden')).toEqual('false')
    await expect(attr('#tab-2', 'aria-selected')).toEqual('true')
  })

  it('handles setup and interaction with dynamically added tabs', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
      <core-tabs id="dynamicInstance">
      </core-tabs>
      <div id="panel-1" hidden>Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
      `
    })

    await browser.executeScript(() => {
      const firstButton = Object.assign(document.createElement('button'), { id: 'tab-1', textContent: 'Dynamic tab 1' })
      const secondButton = Object.assign(document.createElement('button'), { id: 'tab-2', textContent: 'Dynamic tab 2' })
      const tabInstance = document.getElementById('dynamicInstance')
      tabInstance.appendChild(firstButton)
      tabInstance.appendChild(secondButton)
    })

    await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
    await $('#tab-1').click()
    await expect(prop('#panel-1', 'hidden')).toEqual('false')
    await expect(prop('#panel-2', 'hidden')).toEqual('true')
    await expect(attr('#tab-1', 'aria-selected')).toEqual('true')
  })

  describe('supports optional attribute "tab"', () => {
    it('takes an integer-value as index of selected tab', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs tab="2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })

      await expect(attr('#tab-1', 'aria-selected')).toEqual('false')
      await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
      await expect(attr('#tab-3', 'aria-selected')).toEqual('true')
    })

    it('takes an id of a tab as selected tab', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs tab="tab-2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })

      await expect(attr('#tab-1', 'aria-selected')).toEqual('false')
      await expect(attr('#tab-2', 'aria-selected')).toEqual('true')
      await expect(attr('#tab-3', 'aria-selected')).toEqual('false')
    })

    it('accepts id in tab-attribute and updates the value to corresponding index', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs tab="tab-2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('1')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-2')
      await $('#tab-3').click()
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('2')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-3')
    })

    it('updates the attribute value on change, respecting index', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs tab="0">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('0')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-1')
      await $('#tab-2').click()
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('1')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-2')
    })

    it('sets/updates attribute value even when not set initially', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs>
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('0')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-1')
      await $('#tab-3').click()
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('2')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-3')
    })

    it('updates tab attribute to reflect index-change and keeps the correct active panel when preceding tabs are removed from the DOM', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs id="my-tabs" tab="2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel</div>
          <div id="panel-2">Text of panel</div>
          <div id="panel-3">Text of panel</div>
        `
      })
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('2')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-3')
      await browser.executeScript(() => {
        document.getElementById('my-tabs').removeChild(document.getElementById('tab-2'))
      })
      await expect(browser.executeScript(() => document.querySelector('core-tabs').getAttribute('tab'))).toEqual('1')
      await expect(browser.executeScript(() => document.querySelector('core-tabs').tab.id)).toEqual('tab-3')
      await expect(browser.executeScript(() => document.getElementById('panel-3').getAttribute('hidden'))).toMatch(/null/i)
    })
  })

  describe('supports fewer panels than tabs, e.g used with dynamic content', () => {
    it('gracefully works without panels', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs id="tabsnopanels">
            <button data-for="panel-1" id="tab-1">First tab</button>
            <button data-for="panel-1" id="tab-2">Second tab</button>
          </core-tabs>
        `
      })
      await browser.wait(ExpectedConditions.presenceOf($('core-tabs [role="tab"]')))
      await expect(attr('#tabsnopanels', 'tab')).toMatch(/null/i)
      await expect(attr('#tab-1', 'aria-selected')).toMatch(/null/i)
      await expect(attr('#tab-2', 'aria-selected')).toMatch(/null/i)
    })

    it('defaults to aria-labelledBy to the first tab', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs id="dynamicInstance">
            <button data-for="panel-1" id="tab-1">First tab</button>
            <button data-for="panel-1" id="tab-2">Second tab</button>
          </core-tabs>
          <div id="panel-1">Text of panel 1</div>
        `
      })

      await expect(attr('#panel-1', 'aria-labelledBy')).toEqual('tab-1')
    })

    it('assigns aria-labelledBy to match the selected tab', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs id="dynamicInstance" tab="tab-2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="onlyPanel">Text of panel</div>
        `
      })

      await expect(attr('#tab-2', 'aria-selected')).toEqual('true')
      await expect(attr('#onlyPanel', 'aria-labelledBy')).toEqual('tab-2')
    })

    it('updates aria-labelledBy on tab change', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <core-tabs id="dynamicInstance" tab="tab-2">
            <button id="tab-1" data-for="onlyPanel">First tab</button>
            <button id="tab-2" data-for="onlyPanel">Second tab</button>
            <button id="tab-3" data-for="onlyPanel">Third tab</button>
          </core-tabs>
          <div id="onlyPanel">Text of panel</div>
        `
      })

      await expect(attr('#tab-2', 'aria-selected')).toEqual('true')
      await $('#tab-3').click()
      await expect(attr('#tab-2', 'aria-selected')).toEqual('false')
      await expect(attr('#tab-3', 'aria-selected')).toEqual('true')
    })
  })
})
