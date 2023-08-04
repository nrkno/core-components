import { test, expect, Locator } from '@playwright/test';

declare global {
  interface Window { time: Date, triggered: Boolean }
}

const setComponentTemplate = ({ templateId, componentId }) => {
  const template: HTMLTemplateElement | null = document.querySelector(`[data-testid="${templateId}"]`)
  if (template) {
    const component: HTMLElement | null = document.querySelector(`[data-testid="${componentId}"]`)
    if (component) {
      component.appendChild(template.content.cloneNode(true))
    } else {
      throw Error(`html custom element with data-testid: ${componentId} not found`)
    }
  } else {
    throw Error(`html template element with data-testid: ${templateId} not found`)
  }
}

const YEAR = '2019'
const MONTH = '04'
const DAY = '30'
const HOUR = '12'
const MINUTES = '44'
const SECONDS = '56'
const TIMESTAMP = `${YEAR}-${MONTH}-${DAY}T${HOUR}:${MINUTES}:${SECONDS}Z`

const NAME_OF_DAYS = ['man','tirs','ons','tors','fre','lør','søn']
const NAME_OF_MONTHS = ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember']

const pad = (val) => `0${val}`.slice(-2)

test.describe('core-datepicker', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-datepicker/core-datepicker.spec.html')
  })

  test.afterEach(async ({ page }) => {
    page.close()
  })  
  
  test('sets up properties from date-attribute', async ({ page }) => {
    await page.getByTestId('core-datepicker').evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('year', YEAR)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('month', MONTH)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('day', DAY)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('hour', HOUR)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('minute', MINUTES)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('second', SECONDS)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('days', NAME_OF_DAYS)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('months', NAME_OF_MONTHS)
  })
  

  test('does not have a value when set up without date-attribute', async ({ page }) => {
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('year', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('month', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('day', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('hour', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('minute', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('second', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('timestamp', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('date', null)
  })

  test('supports simple-date-parse literals in date-attribute', async ({ page }) => {
    await page.getByTestId('core-datepicker').evaluate((node) => node.setAttribute('date', 'now'))
    const now = new Date()
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('year', now.getUTCFullYear().toString())
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('month', pad(now.getUTCMonth() + 1))
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('day', pad(now.getUTCDate().toString()))
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('hour', pad(now.getUTCHours().toString()))
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('minute', pad(now.getUTCMinutes()))
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('second', pad(now.getUTCSeconds()))
  })
  
  test('resets value when date-attribute is removed', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node) => node.setAttribute('date', 'now'))
    const now = new Date()
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('year', now.getUTCFullYear().toString())
    await expect(page.getByTestId('core-datepicker').getByRole('button')).toHaveCount(42)

    await page.getByTestId('core-datepicker').evaluate((node) => node.removeAttribute('date'))
    await expect(page.getByTestId('core-datepicker')).not.toHaveAttribute('date', 'now')
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('year', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('month', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('day', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('hour', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('minute', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('second', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('timestamp', null)
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('date', null)
  })
  
  test('sets input values from date-attribute', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'input-template' }))
    await page.getByTestId('core-datepicker').evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="year"]')).toHaveJSProperty('value', YEAR)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="year"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="month"]')).toHaveJSProperty('value', MONTH)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="month"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="day"]')).toHaveJSProperty('value', DAY)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="day"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="hour"]')).toHaveJSProperty('value', HOUR)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="hour"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="minute"]')).toHaveJSProperty('value', MINUTES)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="minute"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="second"]')).toHaveJSProperty('value', SECONDS)
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="second"]')).toHaveJSProperty('type', 'number')
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="timestamp"]')).toHaveJSProperty('value', new Date(TIMESTAMP).valueOf().toString())
    await expect(page.getByTestId('core-datepicker').locator('input[data-type="timestamp"]')).toHaveJSProperty('type', 'number')
  })
  
  test('populates empty select with months', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await page.getByTestId('core-datepicker').getByRole('combobox').click()
    await expect(page.getByTestId('core-datepicker').getByRole('combobox').getByRole('option')).toHaveCount(12)
    const optionValue = (index: number) => `y-${index}-d`
    await expect(page.getByTestId('core-datepicker').getByText('januar')).toHaveJSProperty('value', optionValue(1))
    await expect(page.getByTestId('core-datepicker').getByText('februar')).toHaveJSProperty('value', optionValue(2))
    await expect(page.getByTestId('core-datepicker').getByText('mars')).toHaveJSProperty('value', optionValue(3))
    await expect(page.getByTestId('core-datepicker').getByText('april')).toHaveJSProperty('value', optionValue(4))
    await expect(page.getByTestId('core-datepicker').getByText('mai')).toHaveJSProperty('value', optionValue(5))
    await expect(page.getByTestId('core-datepicker').getByText('juni')).toHaveJSProperty('value', optionValue(6))
    await expect(page.getByTestId('core-datepicker').getByText('juli')).toHaveJSProperty('value', optionValue(7))
    await expect(page.getByTestId('core-datepicker').getByText('august')).toHaveJSProperty('value', optionValue(8))
    await expect(page.getByTestId('core-datepicker').getByText('september')).toHaveJSProperty('value', optionValue(9))
    await expect(page.getByTestId('core-datepicker').getByText('oktober')).toHaveJSProperty('value', optionValue(10))
    await expect(page.getByTestId('core-datepicker').getByText('november')).toHaveJSProperty('value', optionValue(11))
    await expect(page.getByTestId('core-datepicker').getByText('desember')).toHaveJSProperty('value', optionValue(12))
  })
  
  test('re-uses custom select', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'custom-select-template' }))
    await page.getByTestId('core-datepicker').getByRole('combobox').click()
    await expect(page.getByTestId('core-datepicker').getByRole('combobox').getByRole('option')).toHaveCount(4)
    await expect(page.getByTestId('core-datepicker').getByText('---')).toHaveJSProperty('value', '---')
    await expect(page.getByTestId('core-datepicker').getByText('Set year to 2016')).toHaveJSProperty('value', '2016-m-d')
    await expect(page.getByTestId('core-datepicker').getByText('Back 100 years and set to January 1st.')).toHaveJSProperty('value', '19yy-1-1')
    await expect(page.getByTestId('core-datepicker').getByText('December 19, 1985')).toHaveJSProperty('value', '1985-12-19')
  })

  test('populates empty table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(page.getByTestId('core-datepicker').getByRole('button')).toHaveCount(42)
    for (const name of NAME_OF_DAYS) {
      await expect(page.getByTestId('core-datepicker').getByRole('cell', { name })).toBeVisible()
    }
    for (let i = 1; i <= 30; i++) {
      await expect(page.getByTestId('core-datepicker').getByLabel(`${i}. april`, { exact: true })).toBeVisible()
    }
    await expect(page.getByTestId('core-datepicker').locator('button[autofocus]')).toBeVisible()
  })
  
  test('marks today\'s date in table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node) => node.setAttribute('date', 'now'))
    await expect(page.getByTestId('core-datepicker').locator('button[aria-current="date"]')).toBeVisible()
    const now = new Date()
    await expect(page.getByTestId('core-datepicker').locator('button[aria-current="date"]')).toHaveText(String(now.getUTCDate()))
  })

  test('changes date on day clicked', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node) => node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime())))
    await expect(page.getByTestId('core-datepicker').locator('button[autofocus]')).toHaveText('1')
    await page.getByTestId('core-datepicker').getByLabel('11. januar').click()
    await expect(page.getByTestId('core-datepicker').locator('button[autofocus]')).toHaveText('11')
  })
  
  test('changes date and focus on keyboard navigation as expected in adjacent table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node) => node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime())))
    await page.getByTestId('core-datepicker').locator('button[autofocus]').click()
    await expect(page.getByTestId('core-datepicker').locator('button[autofocus]')).toHaveText('1')
    await page.keyboard.press('ArrowRight')
    await expect(await page.getByTestId('core-datepicker').evaluate(() => document.activeElement?.textContent)).toEqual('2')
  })

  test('changes month names', async ({ page }) => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await page.getByTestId('core-datepicker').evaluate((node, months) => node.setAttribute('months', months.join()), months)
    await page.getByTestId('core-datepicker').getByRole('combobox').click()
    for (const month of months) {
      await expect(page.getByTestId('core-datepicker').getByText(month)).toBeAttached() // Native select options does not work with Visible?
    }
  })

  test('changes day names', async ({ page }) => {
    const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate((node, days) => node.setAttribute('days', days.join()), days)
    for (const day of days) {
      await expect(page.getByTestId('core-datepicker').getByText(day)).toBeVisible()
    }
  })
  
  test('disables elements from function', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      node.disabled = (date) => {
        return date > new Date('2019-01-01T12:00:00Z')
      }
     })
    await expect(page.getByTestId('core-datepicker').getByLabel('1. januar', { exact: true })).toBeEnabled()
    await expect(page.getByTestId('core-datepicker').getByLabel('31. desember')).toBeVisible()
    await expect(page.getByTestId('core-datepicker').getByLabel('2. januar', { exact: true })).toBeDisabled()
  })
  
  test('triggers change event', async ({ page }) => {
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.change', (event) => (window.time = event.detail.getTime()))
    })
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-02T12:00:00Z').getTime()))
    })
    await expect(await page.evaluate(() => window.time)).toEqual(new Date('2019-01-02T12:00:00Z').getTime())
  })

  test('triggers click day event', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.click.day', () => (window.triggered = true))
    })
    await page.getByTestId('core-datepicker').getByLabel('1. januar', { exact: true }).click()
    await expect(await page.evaluate(() => window.triggered)).toBeTruthy()
  })
  
  test('does not trigger change event when clicking selected date', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.change', () => (window.triggered = true))
    })
    await page.getByTestId('core-datepicker').locator('button[autofocus]').click()
    await expect(await page.evaluate(() => window.triggered)).toBeUndefined()
  })
  
  test('does trigger change event when clicking selected date', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.evaluate(() => document.addEventListener('datepicker.change', () => (window.triggered = true)))
    await page.getByTestId('core-datepicker').locator('button[tabindex="0"]').click()
    await expect(await page.evaluate(() => window.triggered)).toBeTruthy()
  })
  
  test('has month enabled if one day is disabled', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    const disabledDate = new Date('2019-09-06')
    await page.getByTestId('core-datepicker').evaluate((node, disabledDate) => {
      node.setAttribute('date', String(new Date('2019-05-06').getTime()))
      node.disabled = (date) => {
        return date.valueOf() === disabledDate.valueOf()
      }
    }, disabledDate)
    await page.getByTestId('core-datepicker').getByRole('combobox').selectOption('september')
    await expect(page.getByTestId('core-datepicker').getByRole('combobox')).toHaveValue('y-9-d')
  })
  
  test('has month disabled if all days are disabled', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-05-06').getTime()))
      node.disabled = (date) => {
        return date.getMonth() === 8
      }
    })
    await expect(page.getByTestId('core-datepicker').locator('option[value="y-9-d"]')).toBeDisabled()
  })
  
  test('selects first available date in month', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-and-input-template' }))
    await page.getByTestId('core-datepicker').evaluate(node => {
      node.setAttribute('date', String(new Date('2019-12-09T00:00:00.00Z').getTime()))
      node.disabled = (date) => {
        return date.getMonth() === 10 && !(date < new Date('2019-11-06') && date > new Date('2019-11-03'))
      }
    })
    await page.getByTestId('core-datepicker').getByRole('combobox').selectOption('november')
    await expect(page.getByTestId('core-datepicker').getByLabel('3. november', { exact: true })).toBeDisabled()
    await expect(page.getByTestId('core-datepicker').getByLabel('4. november', { exact: true })).toBeEnabled()
    await expect(page.getByTestId('core-datepicker').getByLabel('5. november', { exact: true })).toBeEnabled()
    await expect(page.getByTestId('core-datepicker').getByLabel('6. november', { exact: true })).toBeDisabled()
    await expect(page.getByTestId('core-datepicker').locator('button[autofocus]')).toHaveText('4')
    await expect(page.getByTestId('core-datepicker')).toHaveJSProperty('date', new Date('2019-11-04'))
  })
})


