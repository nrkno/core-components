import { test, expect, Locator } from '@playwright/test';
import CoreDialog from './core-dialog';

const defaultStyle = `
  core-dialog:not([hidden]) {
    display: block;
    position: relative;
  }

  body {
    height: 100vh;
    width: 100vw;
  }

  backdrop:not([hidden]), .my-backdrop:not([hidden]) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .1);
  }
`

test.describe('core-dialog', () => {
  let coreDialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-dialog/core-dialog.spec.html')
    coreDialog = page.getByTestId('core-dialog')
  })
  
  test('sets up properties', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await expect(coreDialog).toBeHidden()
    await expect(coreDialog).toHaveAttribute('role', 'dialog')
    await expect(coreDialog).toHaveAttribute('aria-modal', 'true')
  })
  
  test('opens and closes', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await test.step('open on click', async () => {      
      await page.getByRole('button').and(page.getByText('Open')).click()
      await expect(coreDialog).toBeVisible()
      await expect(page.locator('backdrop')).toBeVisible()
    })
    await test.step('close on click', async () => {
      await page.getByRole('button').and(page.getByText('Close')).click()
      await expect(coreDialog).toBeHidden()
      await expect(page.locator('backdrop')).toBeHidden()
    })
    await test.step('set hidden false', async () => {      
      await coreDialog.evaluate((node: CoreDialog) => node.hidden = false)
      await expect(coreDialog).toBeVisible()
      await expect(page.locator('backdrop')).toBeVisible()
    })
    await test.step('set hidden true', async () => {
      await coreDialog.evaluate((node: CoreDialog) => node.hidden = true)
      await expect(coreDialog).toBeHidden()
      await expect(page.locator('backdrop')).toBeHidden()
    })
  })
  
  test('respects deprecated "for" attribute', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await test.step('open', async () => {      
      await page.getByRole('button').and(page.getByText('Open')).click()
      await expect(coreDialog).toBeVisible()
      await expect(page.locator('backdrop')).toBeVisible()
    })
    await test.step('close', async () => {
      await page.getByRole('button').and(page.getByText('Close')).click()
      await expect(coreDialog).toBeHidden()
      await expect(page.locator('backdrop')).toBeHidden()
    })
  })
  
  test('opens and closes nested', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button type="button" autofocus>Autofocus</button>
        <button data-for="nested-core-dialog">Open nested</button>
        <core-dialog id="nested-core-dialog" hidden>
          <div>Nested content</div>
          <button data-for="close">Close nested</button>
        </core-dialog>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await test.step('open host', async () => {
      await page.getByRole('button').and(page.getByText('Open')).click()
      await expect(coreDialog.getByText('Some content')).toBeVisible()
    })
    await test.step('open nested', async () => {
      await coreDialog.getByRole('button').and(coreDialog.getByText('Open nested')).click()
      await expect(coreDialog.getByText('Nested content')).toBeVisible()
    })
    await test.step('verify backdrops', async () => {      
      await expect(page.locator('backdrop')).toHaveCount(2)
      for (const backdrop of await page.locator('backdrop').all())
        await expect(backdrop).toBeVisible()
    })
    await test.step('close nested', async () => {
      await page.getByRole('button').and(page.getByText('Close nested')).click()
      await expect(coreDialog.getByText('Nested content')).toBeHidden()
      await expect(coreDialog.locator('backdrop')).toBeHidden()
      await expect(coreDialog.getByText('Some content')).toBeVisible()
      await expect(page.locator('backdrop:not([hidden])')).toBeVisible()
    })
  })
  
  test('loses nested with pressed esc', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button type="button" autofocus>Autofocus</button>
        <button data-for="nested-core-dialog">Open nested</button>
        <core-dialog id="nested-core-dialog" hidden>
          <div>Nested content</div>
          <button data-for="close">Close nested</button>
        </core-dialog>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await test.step('open host', async () => {
      await page.getByRole('button').and(page.getByText('Open')).click()
      await expect(coreDialog.getByText('Some content')).toBeVisible()
    })
    await test.step('open nested', async () => {
      await coreDialog.getByRole('button').and(coreDialog.getByText('Open nested')).click()
      await expect(coreDialog.getByText('Nested content')).toBeVisible()
    })
    await test.step('close nested', async () => {      
      await page.keyboard.press('Escape')
      await expect(page.getByText('Nested content')).toBeHidden()
      await expect(page.getByText('Some content')).toBeVisible()
    })
    await test.step('close host', async () => {
      await page.keyboard.press('Escape')
      await expect(page.getByText('Nested content')).toBeHidden()
      await expect(page.getByText('Some content')).toBeHidden()
    })
  })
  
  test('defaults to backdrop="on" when not supplied', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await page.getByRole('button').and(page.getByText('Open')).click()
    await expect(coreDialog).toHaveJSProperty('hidden', false)
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects explicit backdrop="on"', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" backdrop="on" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
        <button for="close">Deprecated Close</button>
      </core-dialog>¯
    `)
    await page.addStyleTag({ content: defaultStyle })
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects backdrop with no value, defaulting to "on"', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" backdrop hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
        <button for="close">Deprecated Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects backdrop="off"', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" backdrop="off" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
        <button for="close">Deprecated Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).not.toBeAttached()
  })
  
  test('respects backdrop with custom id', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" backdrop="custom-backdrop" hidden>
        <button data-for="close">Close</button>
      </core-dialog>
      <div data-testid="custom-backdrop" id="custom-backdrop" class="my-backdrop" hidden></div>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await page.getByRole('button').and(page.getByText('Open')).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.locator('backdrop')).not.toBeAttached()
    await expect(page.getByTestId('custom-backdrop')).toBeVisible()
  })
  
  test('displays no backdrop and logs warning when custom backdrop is provided and not found', async ({ page }) => {
    let consoleMsg: string = ""
    page.once('console', msg => consoleMsg = msg.text())
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" backdrop="invalid-reference-id" hidden>
        <button data-for="close">Close</button>
      </core-dialog>
      <div data-testid="custom-backdrop" id="custom-backdrop" class="my-backdrop" hidden></div>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await page.getByRole('button').and(page.getByText('Open')).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.getByTestId('custom-backdrop')).toBeHidden()
    await expect(page.locator('backdrop')).not.toBeAttached()
    expect(consoleMsg).toContain('cannot find backdrop element with id: invalid-reference-id')
  })
  
  test('respects strict option', async ({ page }) => {
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" strict hidden>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addStyleTag({ content: defaultStyle })
    await page.getByRole('button').and(page.getByText('Open')).click()
    await expect(coreDialog).toBeVisible()
    await page.locator('backdrop').click()
    await expect(coreDialog).toBeVisible()
  })
  
  test('triggers toggle event', async ({ page }) => {
    let numToggleEvents = 0
    await page.exposeFunction('captureToggleEvent', () => numToggleEvents += 1)
    await page.setContent(`
      <button data-for="core-dialog">Open</button>
      <core-dialog data-testid="core-dialog" id="core-dialog" hidden>
        <div>Some content</div>
        <button data-for="close">Close</button>
      </core-dialog>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('dialog.toggle', window.captureToggleEvent)
    `})
    await page.addStyleTag({ content: defaultStyle })
    await test.step('init', async () => {
      expect(numToggleEvents).toBe(0)
    })
    await test.step('open', async () => {
      await page.getByRole('button').and(page.getByText('Open')).click()
      await page.waitForFunction('window.captureToggleEvent')
      expect(numToggleEvents).toBe(1)
    })
    await test.step('', async () => {
      await page.getByRole('button').and(page.getByText('Close')).click()
      await page.waitForFunction('window.captureToggleEvent')
      expect(numToggleEvents).toBe(2)
    })
  })
})
