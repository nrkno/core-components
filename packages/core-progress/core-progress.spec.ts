import { test, expect, Locator } from '@playwright/test';
import CoreProgress from './core-progress';

const defaultStyle = `
  .my-track {
    display: block;
    background: #ccc;
    border-radius: 3px;
    overflow: hidden;
    font: 700 12px/1 sans-serif;
  }

  .my-track [value] {
    background: #16f;
    color: #fff;
    padding: 3px 6px;
    transition: 1s;
  }

  .my-radial {
    color: #16f;
    stroke: #ccc;
    transition: stroke-dashoffset 1s;
  }
`

test.describe('core-progress', () => {
  let coreProgress: Locator

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-progress/core-progress.spec.html')
    await page.addStyleTag({ content: defaultStyle })
    coreProgress = page.getByTestId('core-progress')
  })
  
  test('sets up correctly', async ({ page }) => {
    await page.setContent(`
      <label>
        Linear Progress
        <span class="my-track">
          <core-progress data-testid="core-progress"></core-progress>
        </span>
      </label>
    `)
    await expect(coreProgress).toBeAttached()
    await expect(coreProgress).toHaveAttribute('role', 'img')
    await expect(coreProgress).toHaveAttribute('type', 'linear')
    await expect(coreProgress).toHaveAttribute('aria-label', '0%')
  })
  
  test('updates linear progress label correctly', async ({ page }) => {
    await page.setContent(`
      <label>
        Linear Progress
        <span class="my-track">
          <core-progress data-testid="core-progress"></core-progress>
        </span>
      </label>
    `)
    await expect(coreProgress).toBeAttached()
    await expect(coreProgress).toHaveAttribute('aria-label', '0%')
  
    // Update to 50% and assert
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '.5'))
    await expect(coreProgress).toHaveAttribute('aria-label', '50%')
  
    // Update to 100% and assert
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '1'))
    await expect(coreProgress).toHaveAttribute('aria-label', '100%')
  })
  
  test('updates radial progress label correctly', async ({ page }) => {
    await page.setContent(`
      <label>
        Radial Progress
        <span style="display: block; width: 40px">
          <core-progress class="my-radial" data-testid="core-progress" type="radial"></core-progress>
        </span>
      </label>
    `)
    await expect(coreProgress).toBeAttached()
    await expect(coreProgress).toHaveAttribute('aria-label', '0%')
  
    // Update to 50% and assert
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '.5'))
    await expect(coreProgress).toHaveAttribute('aria-label', '50%')
  
    // Update to 100% and assert
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '1'))
    await expect(coreProgress).toHaveAttribute('aria-label', '100%')
  })
  
  test('updates label from indeterminate value', async ({ page }) => {
  
    await page.setContent(`
      <label>
        Linear Progress
        <span class="my-track">
          <core-progress data-testid="core-progress"></core-progress>
        </span>
      </label>
    `)
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute("value", "Loading..."))
    await expect(coreProgress).toHaveAttribute('aria-label', 'Loading...')
  
    await page.setContent(`
      <label>
        Radial Progress
        <span style="display: block; width: 40px">
          <core-progress class="my-radial" data-testid="core-progress" type="radial"></core-progress>
        </span>
      </label>
    `)
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute("value", "Loading..."))
    await expect(coreProgress).toHaveAttribute('aria-label', 'Loading...')
  })
  
  test('calculates percentage relative to max', async ({ page }) => {
  
    await page.setContent(`
      <label>
        Linear Progress
        <span class="my-track">
          <core-progress data-testid="core-progress"></core-progress>
        </span>
      </label>
    `)
    
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '0.5'))
    await expect(coreProgress).toHaveAttribute('aria-label', '50%')
  
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('max', '10'))
    await expect(coreProgress).toHaveAttribute('aria-label', '5%')
  
    await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('max', '100'))
    await expect(coreProgress).toHaveAttribute('aria-label', '1%')
  })

  test.describe('change event', () => {
    let numChangeEvents
    test.beforeEach(async ({ page }) => {
      numChangeEvents = 0
      page.exposeFunction('captureChangeEvent', () => numChangeEvents += 1)
    })
    
    test('does not trigger change event on max', async ({ page }) => {
      await page.setContent(`
        <label>
          Linear Progress
          <span class="my-track">
            <core-progress id="core-progress" data-testid="core-progress"></core-progress>
          </span>
        </label>
      `)
      await page.addScriptTag({ content: `
        document.getElementById("core-progress").addEventListener('change', window.captureChangeEvent)
      `})
      await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('max', '10'))
      expect(numChangeEvents).toBe(0)
    })
    
    test('triggers change event on value', async ({ page }) => {
      await page.setContent(`
        <label>
          Linear Progress
          <span class="my-track">
            <core-progress id="core-progress" data-testid="core-progress"></core-progress>
          </span>
        </label>
      `)
      await page.addScriptTag({ content: `
        document.getElementById("core-progress").addEventListener('change', window.captureChangeEvent)
      `})
      await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', '.5'))
      expect(numChangeEvents).toBe(1)
    })
    
    test('triggers change event on indeterminate value', async ({ page }) => {
      await page.setContent(`
        <label>
          Linear Progress
          <span class="my-track">
            <core-progress id="core-progress" data-testid="core-progress"></core-progress>
          </span>
        </label>
      `)
      await page.addScriptTag({ content: `
        document.getElementById("core-progress").addEventListener('change', window.captureChangeEvent)
      `})
      await coreProgress.evaluate((node: CoreProgress) => node.setAttribute('value', 'Loading...'))
      expect(numChangeEvents).toBe(1)
    })
  })
})


