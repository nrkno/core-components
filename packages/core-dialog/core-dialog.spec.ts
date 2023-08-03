import { test, expect, Locator } from '@playwright/test';

const setTemplate = ({ templateId, containerId }) => {
  const template: HTMLTemplateElement | null = document.querySelector(`[data-testid="${templateId}"]`)
  if (template) {
    const container: HTMLElement | null = document.querySelector(`[data-testid="${containerId}"]`)
    if (container) {
      container.appendChild(template.content.cloneNode(true))
    } else {
      throw Error(`html custom element with data-testid: ${containerId} not found`)
    }
  } else {
    throw Error(`html template element with data-testid: ${templateId} not found`)
  }
}

test.describe('core-dialog', () => {
  let coreDialog: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-dialog/core-dialog.spec.html')
    coreDialog = await page.getByTestId('core-dialog')
  })
  
  test('sets up properties', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'default-template' }))
    await expect(coreDialog).toBeHidden()
    await expect(coreDialog).toHaveAttribute('role', 'dialog')
    await expect(coreDialog).toHaveAttribute('aria-modal', 'true')
  })
  
  test('opens and closes', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'default-template' }))
    
    // click event
    
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.locator('backdrop')).toBeVisible()

    await page.getByRole('button').and(page.getByText('Close', { exact: true })).click()
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeHidden()

    // component property change

    await coreDialog.evaluate(node => node.hidden = false)
    await expect(coreDialog).toBeVisible()
    await expect(page.locator('backdrop')).toBeVisible()
    
    await coreDialog.evaluate(node => node.hidden = true)
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeHidden()
  })
  
  test('respects deprecated "for" attribute', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'default-template' }))
    
    await page.getByRole('button').and(page.getByText('Deprecated Open')).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.locator('backdrop')).toBeVisible()

    await page.getByRole('button').and(page.getByText('Deprecated Close')).click()
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeHidden()
  })
  
  test('opens and closes nested', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'nested-dialog-template' }))

    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog.getByText('Some content')).toBeVisible()
    await coreDialog.getByRole('button').and(coreDialog.getByText('Open nested')).click()

    await expect(page.locator('backdrop')).toHaveCount(2)
    for (const backdrop of await page.locator('backdrop').all())
      await expect(backdrop).toBeVisible()
    
    await page.getByRole('button').and(page.getByText('Close nested')).click()
    await expect(coreDialog.getByText('Nested content')).toBeHidden()
    await expect(coreDialog.locator('backdrop')).toBeHidden()
    await expect(coreDialog.getByText('Some content')).toBeVisible()
    await expect(page.locator('backdrop:not([hidden])')).toBeVisible()
  })
  
  test('loses nested with pressed esc', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'nested-dialog-template' }))
    
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog.getByText('Some content')).toBeVisible()
    await coreDialog.getByRole('button').and(coreDialog.getByText('Open nested')).click()
    await expect(coreDialog.getByText('Nested content')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByText('Nested content')).toBeHidden()
    await expect(page.getByText('Some content')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByText('Nested content')).toBeHidden()
    await expect(page.getByText('Some content')).toBeHidden()
  })
  
  test('defaults to backdrop="on" when not supplied', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'default-template' }))
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog).toHaveJSProperty('hidden', false)
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects explicit backdrop="on"', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'backdrop-on-template' }))
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects backdrop with no value, defaulting to "on"', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'backdrop-template' }))
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).toBeAttached()
  })
  
  test('respects backdrop="off"', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'backdrop-off-template' }))
    await expect(coreDialog).toBeHidden()
    await expect(page.locator('backdrop')).not.toBeAttached()
  })
  
  test('respects backdrop with custom id', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'backdrop-custom-template' }))
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.locator('backdrop')).not.toBeAttached()
    await expect(page.getByTestId('custom-backdrop')).toBeVisible()
  })
  
  test('displays no backdrop and logs warning when custom backdrop is provided and not found', async ({ page }) => {
    let consoleMsg
    page.once('console', msg => consoleMsg = msg.text())
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'backdrop-custom-invalid-template' }))
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog).toBeVisible()
    await expect(page.getByTestId('custom-backdrop')).toBeHidden()
    await expect(page.locator('backdrop')).not.toBeAttached()
    await expect(consoleMsg).toContain('cannot find backdrop element with id: invalid-reference-id')
  })
  
  test('respects strict option', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'strict-template' }))
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(coreDialog).toBeVisible()
    await page.locator('backdrop').click()
    await expect(coreDialog).toBeVisible()
  })
  
  test('triggers toggle event', async ({ page }) => {
    await page.evaluate(setTemplate, ({ containerId: 'core-dialog-container', templateId: 'default-template' }))
    await page.getByRole('button').and(page.getByText('Open', { exact: true })).click()
    await expect(page.getByTestId('num-toggle-events')).toHaveText('1')
    await page.getByRole('button').and(page.getByText('Close', { exact: true })).click()
    await expect(page.getByTestId('num-toggle-events')).toHaveText('2')
  })
})
