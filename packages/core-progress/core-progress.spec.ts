import { test, expect } from '@playwright/test';

test('sets up correctly', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  await expect(lienarProgress).toBeAttached()
  await expect(lienarProgress).toHaveAttribute('role', 'img')
  await expect(lienarProgress).toHaveAttribute('type', 'linear')
  await expect(lienarProgress).toHaveAttribute('aria-label', '0%')
})

test('updates linear progress label correctly', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const linearProgress = page.getByText('Linear Progress').locator('core-progress')
  await expect(linearProgress).toBeAttached()
  await expect(linearProgress).toHaveAttribute('aria-label', '0%')

  // Update to 50% and assert
  await linearProgress.evaluate(node => node.setAttribute('value', '.5'))
  await expect(linearProgress).toHaveAttribute('aria-label', '50%')

  // Update to 100% and assert
  await linearProgress.evaluate(node => node.setAttribute('value', '1'))
  await expect(linearProgress).toHaveAttribute('aria-label', '100%')
})

test('updates radial progress label correctly', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const radialProgress = await page.getByText('Radial Progress').locator('core-progress')
  await expect(radialProgress).toBeAttached()
  await expect(radialProgress).toHaveAttribute('aria-label', '0%')

  // Update to 50% and assert
  await radialProgress.evaluate(node => node.setAttribute('value', '.5'))
  await expect(radialProgress).toHaveAttribute('aria-label', '50%')

  // Update to 100% and assert
  await radialProgress.evaluate(node => node.setAttribute('value', '1'))
  await expect(radialProgress).toHaveAttribute('aria-label', '100%')
})

test('updates label from indeterminate value', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')

  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  await lienarProgress.evaluate(node => node.setAttribute("value", "Loading..."))
  await expect(lienarProgress).toHaveAttribute('aria-label', 'Loading...')

  const radialProgress = page.getByText('Radial Progress').locator('core-progress')
  await radialProgress.evaluate(node => node.setAttribute("value", "Loading..."))
  await expect(radialProgress).toHaveAttribute('aria-label', 'Loading...')
})

test('calculates percentage relative to max', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')

  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  
  await lienarProgress.evaluate(node => node.setAttribute('value', '0.5'))
  await expect(lienarProgress).toHaveAttribute('aria-label', '50%')

  await lienarProgress.evaluate(node => node.setAttribute('max', '10'))
  await expect(lienarProgress).toHaveAttribute('aria-label', '5%')

  await lienarProgress.evaluate(node => node.setAttribute('max', '100'))
  await expect(lienarProgress).toHaveAttribute('aria-label', '1%')
})

test('does not trigger change event on max', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  const changedElement = page.getByTestId('change-event-result')
  await lienarProgress.evaluate(node => node.setAttribute('max', '10'))
  await expect(changedElement).toBeEmpty()
})

test('triggers change event on value', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  const changedElement = page.getByTestId('change-event-result')
  await lienarProgress.evaluate(node => node.setAttribute('value', '.5'))
  await expect(changedElement).not.toBeEmpty()
})

test('triggers change event on indeterminate value', async ({ page }) => {
  await page.goto('./core-progress/core-progress.spec.html')
  const lienarProgress = page.getByText('Linear Progress').locator('core-progress')
  const changedElement = page.getByTestId('change-event-result')
  await lienarProgress.evaluate(node => node.setAttribute('value', 'Loading...'))
  await expect(changedElement).not.toBeEmpty()
})
