import { expect, Locator } from "@playwright/test"
import CoreToggle from "./core-toggle"
import { test } from '../test-fixtures'

test.describe('core-toggle', () => {
  let coreToggleButton: Locator
  let coreToggle: Locator
  

  test.beforeEach(async ({ page }) => {
    coreToggleButton = page.getByRole('button', { name: 'Toggle', exact: true }).or(page.getByTestId('core-toggle-button'))
    coreToggle = page.getByTestId('core-toggle')
  })
  
  
  test('sets up all properties', async ({ page }) => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden></core-toggle>
    `)
    await expect(coreToggleButton).toHaveAttribute('aria-expanded', 'false')
    expect(await coreToggleButton.getAttribute('aria-controls')).toEqual(await coreToggle.evaluate((node: CoreToggle) => node.id))
    await expect(coreToggle).toHaveJSProperty('hidden', true)
    await expect(coreToggle).toHaveJSProperty('autoposition', false)
    expect(await coreToggle.getAttribute('aria-labelledby')).toEqual(await coreToggleButton.evaluate(node => node.id))

  })

  test('opens and closes toggle', async ({ page }) => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden></core-toggle>
    `)
    await test.step('open', async () => {
      await coreToggleButton.click()
      await expect(coreToggleButton).toHaveAttribute('aria-expanded', 'true')
      await expect(coreToggle).toHaveJSProperty('hidden', false)
    })
    await test.step('close', async () => {
      await coreToggleButton.click()
      await expect(coreToggleButton).toHaveAttribute('aria-expanded', 'false')
      await expect(coreToggle).toHaveJSProperty('hidden', true)
    })
  })
  
  test('opens and closes nested toggle', async ({ page }) => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden>
        <button>Nested Toggle</button>
        <core-toggle hidden>
          <div>Inner content</div>
        </core-toggle>
      </core-toggle>
    `)
    await test.step('open host toggle', async () => {
      await coreToggleButton.click()
      await expect(coreToggle).toHaveJSProperty('hidden', false)
    })
    await test.step('open nested toggle', async () => {
      await coreToggle.getByRole('button', { name: 'Nested Toggle' }).click()
      await expect(coreToggle.locator('core-toggle')).toHaveJSProperty('hidden', false)
    })
    await test.step('close nested toggle, but not host', async () => {
      await coreToggle.getByRole('button', { name: 'Nested Toggle' }).click()
      await expect(coreToggle.locator('core-toggle')).toHaveJSProperty('hidden', true)
      await expect(coreToggle).toHaveJSProperty('hidden', false)
    })
    await test.step('close host toggle', async () => {
      await coreToggleButton.click()
      await expect(coreToggle).toHaveJSProperty('hidden', true)
    })
  })
  
  test('closes nested toggle with esc', async ({ page, browserName }) => {

    // TODO: https://github.com/nrkno/core-components/issues/719
    if (browserName === 'webkit') test.skip()
    
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden>
        <button>Nested Toggle</button>
        <core-toggle hidden>
          <div>Inner content</div>
        </core-toggle>
      </core-toggle>
    `)
    await test.step('open all toggles', async () => {
      await coreToggleButton.click()
      await coreToggle.getByRole('button', { name: 'Nested Toggle' }).click()
      await expect(coreToggle).toHaveJSProperty('hidden', false)
      await expect(coreToggle.locator('core-toggle')).toHaveJSProperty('hidden', false)
    })
    await test.step('close nested toggle, but not host', async () => {
      await page.keyboard.press('Escape')
      await expect(coreToggle.locator('core-toggle')).toHaveJSProperty('hidden', true)
      await expect(coreToggle).toHaveJSProperty('hidden', false)
    })
    await test.step('close host toggle', async () => {
      await page.keyboard.press('Escape')
      await expect(coreToggle).toHaveJSProperty('hidden', true)
    })
  })
  
  test.describe('data-for attribute', () => {
    
    test('respects deprecated "for" attribute', async ({ page }) => {
      await page.setContent(`
        <button for='content'>Toggle</button>
        <core-toggle id='content' data-testid='core-toggle' hidden></core-toggle>
      `)
      await coreToggleButton.click()
      const coreToggleId = await coreToggle.evaluate(node => node.id)
      await expect(coreToggleButton).toHaveAttribute('for', coreToggleId)
      await expect(coreToggleButton).toHaveAttribute('aria-controls', coreToggleId)
      await expect(coreToggleButton).toHaveJSProperty('hidden', false)
    })
    
    test('respects "data-for" attribute', async ({ page }) => {
      await page.setContent(`
        <button data-for='content'>Toggle</button>
        <core-toggle id='content' data-testid='core-toggle' hidden></core-toggle>
      `)
      await coreToggleButton.click()
      const coreToggleId = await coreToggle.evaluate(node => node.id)
      await expect(coreToggleButton).toHaveAttribute('data-for', coreToggleId)
      await expect(coreToggleButton).toHaveAttribute('aria-controls', coreToggleId)
      await expect(coreToggleButton).toHaveJSProperty('hidden', false)
    })
  })

  test.describe('data-popup attribute', () => {
    
    test('closes open toggle on click outside, when data-popup attribute is present', async ({ page }) => {
      await page.setContent(`
        <button>Toggle</button>
        <core-toggle data-testid='core-toggle' data-popup hidden></core-toggle>
        <span>outside</span>
      `)
      await test.step('open', async () => {
        await coreToggleButton.click()
        await expect(coreToggle).toHaveJSProperty('hidden', false)
      })
      await test.step('close', async () => {
        await page.getByText('outside').click()
        await expect(coreToggle).toHaveJSProperty('hidden', true)
      })
    })
    
    test('will not close open toggle on click outside, without data-popup attribute', async ({ page }) => {
      await page.setContent(`
        <button>Toggle</button>
        <core-toggle data-testid='core-toggle' hidden></core-toggle>
        <span>outside</span>
      `)
      await test.step('open', async () => {
        await coreToggleButton.click()
        await expect(coreToggle).toHaveJSProperty('hidden', false)
      })
      await test.step('try to close', async () => {
        await page.getByText('outside').click()
        await expect(coreToggle).toHaveJSProperty('hidden', false)
      })
    })
    
    test('respects exisiting aria-label with data-popup attribute and value', async ({ page }) => {
      const initialAriaLabel = 'label'
      await page.setContent(`
        <button data-testid='core-toggle-button' aria-label='${initialAriaLabel}'>Toggle</button>
        <core-toggle data-testid='core-toggle' data-popup="Popup-label" hidden></core-toggle>
      `)
      await test.step('set core toggle value', async () => {
        await coreToggle.evaluate((node: CoreToggle) => node.value = 'button text')
        const toggleValue = await coreToggle.evaluate((node: CoreToggle) => node.value)
        await test.step('button text changed', async () => await expect(coreToggleButton).toHaveText(toggleValue))
        await test.step('aria-label not changed', async () => await expect(coreToggleButton).toHaveAttribute('aria-label', initialAriaLabel))
      })
    })
    
    test('sets aria-label with data-popup attr and value', async ({ page }) => {
      const popupLabel = 'Popup label'
      const btnLabel = 'Button text'
      await page.setContent(`
        <button data-testid='core-toggle-button'>Toggle</button>
        <core-toggle data-testid='core-toggle' data-popup='${popupLabel}' hidden></core-toggle>
      `)
      expect(coreToggleButton).toBeDefined()
      await coreToggle.evaluate((node: CoreToggle, newValue) => node.value = newValue, btnLabel)
      await expect(coreToggleButton).toHaveAttribute('aria-label', `${btnLabel},${popupLabel}`)
    })
  })

  test('sets data-popup attribute when assigned value to popup prop', async ({ page }) => {
    const labelText = 'Popup label'
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden></core-toggle>
    `)
    await coreToggle.evaluate((node: CoreToggle, labelText) => node.popup = labelText, labelText)
    await expect(coreToggle).toHaveAttribute('data-popup', labelText)
    expect(await coreToggle.getAttribute('popup')).toBeNull()
  })

  test('sets aria-label with data-popup prop and value', async ({ page }) => {
    const labelText = 'Popup label'
    const buttonText = 'Button text'
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden></core-toggle>
    `)
    await coreToggle.evaluate((node: CoreToggle, labelText) => node.popup = labelText, labelText)
    await coreToggle.evaluate((node: CoreToggle, buttonText) => node.value = buttonText, buttonText)
    await expect(page.getByRole('button', { name: buttonText })).toBeVisible()
    await expect(page.getByRole('button', { name: buttonText })).toHaveAttribute('aria-label', `${buttonText},${labelText}`)
  })
  
  test('triggers toggle event', async ({ page }) => {
    let numToggleEvents = 0
    await page.exposeFunction('captureToggleEvent', () => numToggleEvents += 1)
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden></core-toggle>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('toggle', window.captureToggleEvent)
    `})
    await coreToggleButton.click()
    await page.waitForFunction('window.captureToggleEvent')
    expect(numToggleEvents).toBe(1)
  })
  
  test('triggers select event', async ({ page }) => {
    let numSelectEvents = 0
    await page.exposeFunction('captureSelectEvent', () => numSelectEvents += 1)
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden>
        <button id="my-item">Select me</button>
      </core-toggle>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('toggle.select', window.captureSelectEvent)
    `})
    await coreToggleButton.click()
    await coreToggle.getByRole('button', { name: 'Select me' }).click()
    await page.waitForFunction('window.captureSelectEvent')
    expect(numSelectEvents).toBe(1)
    // TODO: Assert event id
    // Cross Origin Issue; Event is always {isTrusted: false}
    // expect(event.detail.id).toBe('my-item')
  })
  
  test('supports attribute autoposition', async ({ page }) => {
    await page.setContent(`
      <button>Toggle</button>
      <core-toggle data-testid='core-toggle' autoposition hidden></core-toggle>
    `)
    await expect(coreToggle).toHaveJSProperty('autoposition', true)
    await coreToggleButton.click()
    await expect(coreToggle).toHaveCSS('position', 'fixed')
  })
  
  test('updates aria-label on select when event value is set to event detail', async ({ page }) => {
    const popupLabel = 'Choose wisely'
    const itemButtonLabel = 'Select me'
    await page.setContent(`
      <button data-testid='core-toggle-button'>Toggle</button>
      <core-toggle data-testid='core-toggle' hidden data-popup='${popupLabel}'>
        <button id='my-item'>${itemButtonLabel}</button>
      </core-toggle>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('toggle.select', (event) => (event.target.value = event.detail))
    `})
    await coreToggleButton.click()
    await coreToggle.getByRole('button', { name: itemButtonLabel }).click()
    await expect(coreToggleButton).toHaveAttribute('aria-label', `${itemButtonLabel},${popupLabel}`)
  })
})
