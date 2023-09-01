import { test, expect, Locator } from '@playwright/test';
import CoreTabs, { TabElement } from './core-tabs';

test.describe('core-tabs', () => {
  let coreTabs: Locator
  let toggleEvents: number
  let INCREMENT_TOGGLE_EVENTS_FUNC = `incrementToggleEvents`
  const incrementToggleEvents = () => toggleEvents += 1
  
  test.beforeEach(async ({ page }) => {
    toggleEvents = 0
    await page.exposeFunction(INCREMENT_TOGGLE_EVENTS_FUNC, incrementToggleEvents)
    await page.goto(`./core-tabs/core-tabs.spec.html`)
    await page.addStyleTag({ content: `
      div[hidden] {
        display: none;
      }
    `})
    coreTabs = page.locator('core-tabs')
  })

  test.afterEach(async ({ page }) => {
    await page.close()
  })

  test('sets up all properties', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await expect(coreTabs).toHaveAttribute('role', 'tablist')
    await expect(page.getByText('First tab')).toHaveAttribute('aria-controls', 'panel-1')
    await expect(page.getByText('First tab')).toHaveAttribute('role', 'tab')
    await expect(page.getByText('First tab')).toHaveAttribute('tabindex', '0')
    await expect(page.getByText('First tab')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('Second tab')).toHaveAttribute('aria-controls', 'panel-2')
    await expect(page.getByText('Second tab')).toHaveAttribute('role', 'tab')
    await expect(page.getByText('Second tab')).toHaveAttribute('tabindex', '-1')
    await expect(page.getByText('Second tab')).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByText('Text of tab 1')).toHaveAttribute('aria-labelledby', 'tab-1')
    await expect(page.getByText('Text of tab 1')).toHaveAttribute('role', 'tabpanel')
    await expect(page.getByText('Text of tab 1')).toHaveAttribute('tabindex', '0')
    expect(await page.getByText('Text of tab 1').getAttribute('hidden')).toBeNull()
    expect(await page.getByText('Text of tab 2').getAttribute('aria-labelledby')).toBeNull()
    await expect(page.getByText('Text of tab 2')).toHaveAttribute('role', 'tabpanel')
    await expect(page.getByText('Text of tab 2')).toHaveAttribute('tabindex', '0')
    await expect(page.getByText('Text of tab 2')).toHaveAttribute('hidden', '')
  })

  test('selects tab', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
        <button id="tab-3">Third tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-3">Text of tab 3</div>
    `)
    await page.getByRole('tab', { name: 'Second tab' }).click()
    await expect(page.getByText('Text of tab 1')).toBeHidden()
    await expect(page.getByText('Text of tab 2')).toBeVisible()
    await expect(page.getByText('Text of tab 3')).toBeHidden()
  })

  test('accepts 0 as valid value to select first tab by index', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
        <button id="tab-3">Third tab</button>
      </core-tabs>
    `)
    await coreTabs.evaluate((node: CoreTabs) => node.tab = 0)
    await expect(page.getByText('First tab')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('Second tab')).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByText('Third tab')).toHaveAttribute('aria-selected', 'false')
  })
  
  test('selects tab by id', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await coreTabs.evaluate((node: CoreTabs) => node.tab = 'tab-2')
    await expect(page.getByText('First tab')).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByText('Second tab')).toHaveAttribute('aria-selected', 'true')
  })

  test('selects tab by element', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement) = node.querySelector('#tab-2') as TabElement)
    await expect(page.getByText('First tab')).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByText('Second tab')).toHaveAttribute('aria-selected', 'true')
  })

  test('respects "data-for" on tabs', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" data-for="panel-1">First tab</button>
        <button id="tab-2" data-for="panel-2">Second tab</button>
      </core-tabs>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    `)
    await expect(page.getByRole('tab', { name: 'First tab' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: 'First tab' })).toHaveAttribute('tabindex', '0')
    await expect(page.getByText('Text of tab 1')).toHaveJSProperty('hidden', false)
    await expect(page.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('tabindex', '-1')
    await expect(page.getByText('Text of tab 2')).toHaveJSProperty('hidden', true)
  })

  test('respects deprecated "for" on tabs', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" for="panel-1">First tab</button>
        <button id="tab-2" for="panel-2">Second tab</button>
      </core-tabs>
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    `)
    await expect(page.getByRole('tab', { name: 'First tab' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: 'First tab' })).toHaveAttribute('tabindex', '0')
    await expect(page.getByText('Text of tab 1')).toHaveJSProperty('hidden', false)
    await expect(page.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('tabindex', '-1')
    await expect(page.getByText('Text of tab 2')).toHaveJSProperty('hidden', true)
  })

  test('respects "data-for" for single panel', async ({ page }) => {
    await page.setContent(`
      <core-tabs>
        <button id="tab-1" data-for="panel-1">First tab</button>
        <button id="tab-2" data-for="panel-1">Second tab</button>
        <button id="tab-3" data-for="panel-2">Third tab</button>
      </core-tabs>
      <p>I'm an element</p>
      <div id="panel-1">Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    // TODO: Review if this test is misleading, there is mismatch between button label and tab index
    await coreTabs.getByRole('tab', { name: 'Third tab' }).click()
    await expect(coreTabs.getByRole('tab', { name: 'Third tab' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByText('Text of tab 1')).toBeHidden()
    await expect(page.getByText('Text of tab 2')).toBeVisible()
  })

  test('respects hidden panels as indication of active tab', async ({ page }) => {
    await page.setContent(`
      <core-tabs id="dynamicInstance">
        <button id="tab-1">First tab</button>
        <button id="tab-2">Second tab</button>
      </core-tabs>
      <div id="panel-1" hidden>Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await expect(page.getByText('Text of tab 1')).toBeHidden()
    await expect(page.getByText('Text of tab 2')).toBeVisible()
    await expect(coreTabs.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'true')
  })

  test('handles setup and interaction with dynamically added tabs', async ({ page }) => {
    await page.setContent(`
      <core-tabs></core-tabs>
      <div id="panel-1" hidden>Text of tab 1</div>
      <div id="panel-2">Text of tab 2</div>
    `)
    await coreTabs.evaluate((node: CoreTabs) => node.appendChild(Object.assign(document.createElement('button'), { id: 'tab-1', textContent: 'First tab' })))
    await coreTabs.evaluate((node: CoreTabs) => node.appendChild(Object.assign(document.createElement('button'), { id: 'tab-2', textContent: 'Second tab' })))
    await coreTabs.getByRole('tab', { name: 'First tab' }).click()
    await expect(page.getByText('Text of tab 1')).toBeVisible()
    await expect(page.getByText('Text of tab 2')).toBeHidden()
    await expect(coreTabs.getByRole('tab', { name: 'First tab' })).toHaveAttribute('aria-selected', 'true')
  })

  test.describe('dispatches toggle-event', () => {
    
    test('does not trigger toggle-event during setup', async ({ page }) => {
      await page.setContent(`
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `)
      await page.addScriptTag({ content: `
        document.addEventListener('tabs.toggle', window.incrementToggleEvents)
      `})
      await page.waitForLoadState()
      expect(toggleEvents).toBe(0)
    })

    test('does not trigger toggle-event during setup with tab-attribute set using id', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="tab-2">
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `)
      await page.addScriptTag({ content: `
        document.addEventListener('tabs.toggle', window.incrementToggleEvents)
      `})
      await page.waitForLoadState()
      expect(toggleEvents).toBe(0)
    })

    test('does not trigger toggle-event during setup with tab-attribute set using index', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="0">
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `)
      await page.addScriptTag({ content: `
        document.addEventListener('tabs.toggle', window.incrementToggleEvents)
      `})
      expect(toggleEvents).toBe(0)
    })

    test('triggers toggle event on tab change', async ({ page }) => {
      await page.setContent(`
        <core-tabs>
          <button id="tab-1">First tab</button>
          <button id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
      `)
      await page.addScriptTag({ content: `
        document.addEventListener('tabs.toggle', window.incrementToggleEvents)
      `})
      await coreTabs.getByRole('tab', { name: 'Second tab' }).click()
      expect(toggleEvents).toBe(1)
    })
  })

  test.describe('supports optional attribute "tab"', () => {
    
    test('takes an integer-value as index of selected tab', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="2">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)
      await expect(coreTabs.getByRole('tab', { name: 'First tab'})).toHaveAttribute('aria-selected', 'false')
      await expect(coreTabs.getByRole('tab', { name: 'Second tab'})).toHaveAttribute('aria-selected', 'false')
      await expect(coreTabs.getByRole('tab', { name: 'Third tab'})).toHaveAttribute('aria-selected', 'true')
    })

    test('takes an id of a tab as selected tab', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="tab-3">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)
      await expect(coreTabs.getByRole('tab', { name: 'First tab'})).toHaveAttribute('aria-selected', 'false')
      await expect(coreTabs.getByRole('tab', { name: 'Second tab'})).toHaveAttribute('aria-selected', 'false')
      await expect(coreTabs.getByRole('tab', { name: 'Third tab'})).toHaveAttribute('aria-selected', 'true')
    })

    test('accepts id in tab-attribute and updates the value to corresponding index', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="tab-3">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)

      await test.step('initilizes tab attr', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '2')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-3')
      })
      await test.step('updates tab attr', async () => {
        await coreTabs.getByRole('tab', { name: 'Second Tab' }).click()
        await expect(coreTabs).toHaveAttribute('tab', '1')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-2')
      })
    })

    test('updates the attribute value on change, respecting index', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="0">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)
      await test.step('intializes tab attr', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '0')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-1')
      })
      await test.step('updates tab attr', async () => {        
        await coreTabs.getByRole('tab', { name: 'Second Tab' }).click()
        await expect(coreTabs).toHaveAttribute('tab', '1')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-2')
      })
    })

    test('sets/updates attribute value even when not set initially', async ({ page }) => {
      await page.setContent(`
        <core-tabs>
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)
      await test.step('initilizes tab attr', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '0')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-1')
      })
      await test.step('updates tab attr', async () => {        
        await coreTabs.getByRole('tab', { name: 'Second Tab' }).click()
        await expect(coreTabs).toHaveAttribute('tab', '1')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-2')
      })
    })
    
    test('updates tab attribute to reflect index-change and keeps the correct active panel when preceding tabs are removed from the DOM', async ({ page }) => {
      await page.setContent(`
        <core-tabs tab="2">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="panel-1">Text of tab 1</div>
        <div id="panel-2">Text of tab 2</div>
        <div id="panel-3">Text of tab 3</div>
      `)
      await test.step('initilizes tab attr', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '2')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-3')
      })
      await test.step('remove tab element node', async () => {
        await coreTabs.evaluate((node: CoreTabs) => node.removeChild(document.getElementById('tab-2') as TabElement))
      })
      await test.step('updates tab attr', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '1')
        expect(await coreTabs.evaluate((node: CoreTabs) => (node.tab as TabElement).id)).toEqual('tab-3')
        await expect(page.getByText('Text of tab 3')).toBeVisible()
      })
    })
  })

  test.describe('supports fewer panels than tabs, e.g used with dynamic content', () => {
    
    test('gracefully works without panels', async ({ page }) => {
      await page.setContent(`
        <core-tabs>
          <button data-for="panel-1" id="tab-1">First tab</button>
          <button data-for="panel-1" id="tab-2">Second tab</button>
        </core-tabs>
      `)
      await page.addScriptTag({ content: `
        document.addEventListener('tabs.toggle', window.incrementToggleEvents)
      `})
      await page.waitForLoadState()
      await test.step('no event event on initilization', async () => {
        expect(toggleEvents).toBe(0)
      })
      await test.step('sets up attributes correctly', async () => {
        await expect(coreTabs).toHaveAttribute('tab', '0')
        await expect(coreTabs.getByRole('tab', { name: 'First tab'})).toHaveAttribute('aria-selected', 'true')
        await expect(coreTabs.getByRole('tab', { name: 'Second tab'})).toHaveAttribute('aria-selected', 'false')
        expect(await coreTabs.getByRole('tab', { name: 'First tab'}).getAttribute('aria-controls')).toBeNull()
        expect(await coreTabs.getByRole('tab', { name: 'Second tab'}).getAttribute('aria-controls')).toBeNull()
      })
      const { panels, tabs, panel, tab } = await coreTabs.evaluate(({ panels, tabs, panel, tab }: CoreTabs) => ({ panels, tabs, panel, tab: (tab as TabElement).id }))
      await test.step('panels and tabs are 1:1', async () => {
        expect(tabs.length).toBe(2)
        expect(tabs.length).toBe(panels.length)
        expect(tab).toBe('tab-1')
      })
      await test.step('panels contain null entries', async () => {
        expect(panels[0]).toBeNull()
        expect(panels[1]).toBeNull()
        expect(panel).toBeNull()
      })
      await test.step('updates selected tab', async () => {
        await coreTabs.getByRole('tab', { name: 'Second tab' }).click()
        await expect(coreTabs.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'true')
      })
      await test.step('fires toggle event', async () => {
        await page.waitForFunction('window.incrementToggleEvents')
        expect(toggleEvents).toBe(1)
      })
    })

    test('defaults to aria-labelledBy to the first tab', async ({ page }) => {
      await page.setContent(`
        <core-tabs id="dynamicInstance">
          <button data-for="panel-1" id="tab-1">First tab</button>
          <button data-for="panel-1" id="tab-2">Second tab</button>
        </core-tabs>
        <div id="panel-1">Text of panel 1</div>
      `)

      await expect(page.getByText('Text of panel')).toHaveAttribute('aria-labelledby', 'tab-1')
    })
  
    test('assigns aria-labelledBy to match the selected tab', async ({ page }) => {
      await page.setContent(`
        <core-tabs id="dynamicInstance" tab="tab-2">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="onlyPanel">Text of panel</div>
      `)

      await expect(coreTabs.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'true')
      await expect(page.getByText('Text of panel')).toHaveAttribute('aria-labelledby', 'tab-2')
    })
  
    test('updates aria-labelledBy on tab change', async ({ page }) => {
      await page.setContent(`
        <core-tabs id="dynamicInstance" tab="tab-2">
          <button id="tab-1" data-for="onlyPanel">First tab</button>
          <button id="tab-2" data-for="onlyPanel">Second tab</button>
          <button id="tab-3" data-for="onlyPanel">Third tab</button>
        </core-tabs>
        <div id="onlyPanel">Text of panel</div>
      `)
      await expect(coreTabs.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'true')
      await coreTabs.getByRole('tab', { name: 'Third tab' }).click()
      await expect(coreTabs.getByRole('tab', { name: 'Second tab' })).toHaveAttribute('aria-selected', 'false')
      await expect(coreTabs.getByRole('tab', { name: 'Third tab' })).toHaveAttribute('aria-selected', 'true')
    })
  })
})
