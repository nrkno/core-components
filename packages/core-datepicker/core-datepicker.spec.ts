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
  let coreDatepicker: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-datepicker/core-datepicker.spec.html')
    coreDatepicker = await page.getByTestId('core-datepicker')
  })
  
  
  test('sets up properties from date-attribute', async ({ page }) => {
    await coreDatepicker.evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(coreDatepicker).toHaveJSProperty('year', YEAR)
    await expect(coreDatepicker).toHaveJSProperty('month', MONTH)
    await expect(coreDatepicker).toHaveJSProperty('day', DAY)
    await expect(coreDatepicker).toHaveJSProperty('hour', HOUR)
    await expect(coreDatepicker).toHaveJSProperty('minute', MINUTES)
    await expect(coreDatepicker).toHaveJSProperty('second', SECONDS)
    await expect(coreDatepicker).toHaveJSProperty('days', NAME_OF_DAYS)
    await expect(coreDatepicker).toHaveJSProperty('months', NAME_OF_MONTHS)
  })
  

  test('does not have a value when set up without date-attribute', async ({ page }) => {
    await expect(coreDatepicker).toHaveJSProperty('year', null)
    await expect(coreDatepicker).toHaveJSProperty('month', null)
    await expect(coreDatepicker).toHaveJSProperty('day', null)
    await expect(coreDatepicker).toHaveJSProperty('hour', null)
    await expect(coreDatepicker).toHaveJSProperty('minute', null)
    await expect(coreDatepicker).toHaveJSProperty('second', null)
    await expect(coreDatepicker).toHaveJSProperty('timestamp', null)
    await expect(coreDatepicker).toHaveJSProperty('date', null)
  })

  test('supports simple-date-parse literals in date-attribute', async ({ page }) => {
    await coreDatepicker.evaluate((node) => node.setAttribute('date', 'now'))
    const now = new Date()
    await expect(coreDatepicker).toHaveJSProperty('year', now.getUTCFullYear().toString())
    await expect(coreDatepicker).toHaveJSProperty('month', pad(now.getUTCMonth() + 1))
    await expect(coreDatepicker).toHaveJSProperty('day', now.getUTCDate().toString())
    await expect(coreDatepicker).toHaveJSProperty('hour', pad(now.getUTCHours().toString()))
    await expect(coreDatepicker).toHaveJSProperty('minute', pad(now.getUTCMinutes()))
    await expect(coreDatepicker).toHaveJSProperty('second', pad(now.getUTCSeconds()))
  })
  
  test('resets value when date-attribute is removed', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node) => node.setAttribute('date', 'now'))
    const now = new Date()
    await expect(coreDatepicker).toHaveJSProperty('year', now.getUTCFullYear().toString())
    await expect(coreDatepicker.getByRole('button')).toHaveCount(42)

    await coreDatepicker.evaluate((node) => node.removeAttribute('date'))
    await expect(coreDatepicker).not.toHaveAttribute('date', 'now')
    await expect(coreDatepicker).toHaveJSProperty('year', null)
    await expect(coreDatepicker).toHaveJSProperty('month', null)
    await expect(coreDatepicker).toHaveJSProperty('day', null)
    await expect(coreDatepicker).toHaveJSProperty('hour', null)
    await expect(coreDatepicker).toHaveJSProperty('minute', null)
    await expect(coreDatepicker).toHaveJSProperty('second', null)
    await expect(coreDatepicker).toHaveJSProperty('timestamp', null)
    await expect(coreDatepicker).toHaveJSProperty('date', null)
  })
  
  test('sets input values from date-attribute', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'input-template' }))
    await coreDatepicker.evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(coreDatepicker.locator('input[data-type="year"]')).toHaveJSProperty('value', YEAR)
    await expect(coreDatepicker.locator('input[data-type="year"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="month"]')).toHaveJSProperty('value', MONTH)
    await expect(coreDatepicker.locator('input[data-type="month"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="day"]')).toHaveJSProperty('value', DAY)
    await expect(coreDatepicker.locator('input[data-type="day"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="hour"]')).toHaveJSProperty('value', HOUR)
    await expect(coreDatepicker.locator('input[data-type="hour"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="minute"]')).toHaveJSProperty('value', MINUTES)
    await expect(coreDatepicker.locator('input[data-type="minute"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="second"]')).toHaveJSProperty('value', SECONDS)
    await expect(coreDatepicker.locator('input[data-type="second"]')).toHaveJSProperty('type', 'number')
    await expect(coreDatepicker.locator('input[data-type="timestamp"]')).toHaveJSProperty('value', new Date(TIMESTAMP).valueOf().toString())
    await expect(coreDatepicker.locator('input[data-type="timestamp"]')).toHaveJSProperty('type', 'number')
  })
  
  test('populates empty select with months', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await coreDatepicker.getByRole('combobox').click()
    await expect(coreDatepicker.getByRole('combobox').getByRole('option')).toHaveCount(12)
    const optionValue = (index: number) => `y-${index}-d`
    await expect(coreDatepicker.getByText('januar')).toHaveJSProperty('value', optionValue(1))
    await expect(coreDatepicker.getByText('februar')).toHaveJSProperty('value', optionValue(2))
    await expect(coreDatepicker.getByText('mars')).toHaveJSProperty('value', optionValue(3))
    await expect(coreDatepicker.getByText('april')).toHaveJSProperty('value', optionValue(4))
    await expect(coreDatepicker.getByText('mai')).toHaveJSProperty('value', optionValue(5))
    await expect(coreDatepicker.getByText('juni')).toHaveJSProperty('value', optionValue(6))
    await expect(coreDatepicker.getByText('juli')).toHaveJSProperty('value', optionValue(7))
    await expect(coreDatepicker.getByText('august')).toHaveJSProperty('value', optionValue(8))
    await expect(coreDatepicker.getByText('september')).toHaveJSProperty('value', optionValue(9))
    await expect(coreDatepicker.getByText('oktober')).toHaveJSProperty('value', optionValue(10))
    await expect(coreDatepicker.getByText('november')).toHaveJSProperty('value', optionValue(11))
    await expect(coreDatepicker.getByText('desember')).toHaveJSProperty('value', optionValue(12))
  })
  
  test('re-uses custom select', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'custom-select-template' }))
    await coreDatepicker.getByRole('combobox').click()
    await expect(coreDatepicker.getByRole('combobox').getByRole('option')).toHaveCount(4)
    await expect(coreDatepicker.getByText('---')).toHaveJSProperty('value', '---')
    await expect(coreDatepicker.getByText('Set year to 2016')).toHaveJSProperty('value', '2016-m-d')
    await expect(coreDatepicker.getByText('Back 100 years and set to January 1st.')).toHaveJSProperty('value', '19yy-1-1')
    await expect(coreDatepicker.getByText('December 19, 1985')).toHaveJSProperty('value', '1985-12-19')
  })

  test('populates empty table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node, time) => node.setAttribute('date', new Date(time).getTime().toString()), TIMESTAMP)
    await expect(coreDatepicker.getByRole('button')).toHaveCount(42)
    for (const name of NAME_OF_DAYS) {
      await expect(coreDatepicker.getByRole('cell', { name })).toBeVisible()
    }
    for (let i = 1; i <= 30; i++) {
      await expect(coreDatepicker.getByLabel(`${i}. april`, { exact: true })).toBeVisible()
    }
    await expect(coreDatepicker.locator('button[autofocus]')).toBeVisible()
  })
  
  test('marks today\'s date in table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node) => node.setAttribute('date', 'now'))
    await expect(coreDatepicker.locator('button[aria-current="date"]')).toBeVisible()
    const now = new Date()
    await expect(coreDatepicker.locator('button[aria-current="date"]')).toHaveText(String(now.getUTCDate()))
  })

  test('changes date on day clicked', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node) => node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime())))
    await expect(coreDatepicker.locator('button[autofocus]')).toHaveText('1')
    await coreDatepicker.getByLabel('11. januar').click()
    await expect(coreDatepicker.locator('button[autofocus]')).toHaveText('11')
  })
  
  test('changes date and focus on keyboard navigation as expected in adjacent table', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node) => node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime())))
    await coreDatepicker.locator('button[autofocus]').click()
    await expect(coreDatepicker.locator('button[autofocus]')).toHaveText('1')
    await page.keyboard.press('ArrowRight')
    await expect(await coreDatepicker.evaluate(() => document.activeElement?.textContent)).toEqual('2')
  })

  test('changes month names', async ({ page }) => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'oktober', 'november', 'december']
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await coreDatepicker.evaluate((node, months) => node.setAttribute('months', months.join()), months)
    await coreDatepicker.getByRole('combobox').click()
    for (const month of months) {
      await expect(coreDatepicker.getByText(month)).toBeAttached() // Native select options does not work with Visible?
    }
  })

  test('changes day names', async ({ page }) => {
    const days = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu']
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate((node, days) => node.setAttribute('days', days.join()), days)
    for (const day of days) {
      await expect(coreDatepicker.getByText(day)).toBeVisible()
    }
  })
  
  test('disables elements from function', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      node.disabled = (date) => {
        return date > new Date('2019-01-01T12:00:00Z')
      }
     })
    await expect(coreDatepicker.getByLabel('1. januar', { exact: true })).toBeEnabled()
    await expect(coreDatepicker.getByLabel('31. desember')).toBeVisible()
    await expect(coreDatepicker.getByLabel('2. januar', { exact: true })).toBeDisabled()
  })
  
  test('triggers change event', async ({ page }) => {
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.change', (event) => (window.time = event.detail.getTime()))
    })
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-02T12:00:00Z').getTime()))
    })
    await expect(await page.evaluate(() => window.time)).toEqual(new Date('2019-01-02T12:00:00Z').getTime())
  })

  test('triggers click day event', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.click.day', () => (window.triggered = true))
    })
    await coreDatepicker.getByLabel('1. januar', { exact: true }).click()
    await expect(await page.evaluate(() => window.triggered)).toBeTruthy()
  })
  
  test('does not trigger change event when clicking selected date', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-01-01T12:00:00Z').getTime()))
      document.addEventListener('datepicker.change', () => (window.triggered = true))
    })
    await coreDatepicker.locator('button[autofocus]').click()
    await expect(await page.evaluate(() => window.triggered)).toBeUndefined()
  })
  
  test('does trigger change event when clicking selected date', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'table-template' }))
    await page.evaluate(() => document.addEventListener('datepicker.change', () => (window.triggered = true)))
    await coreDatepicker.locator('button[tabindex="0"]').click()
    await expect(await page.evaluate(() => window.triggered)).toBeTruthy()
  })
  
  test('has month enabled if one day is disabled', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    const disabledDate = new Date('2019-09-06')
    await coreDatepicker.evaluate((node, disabledDate) => {
      node.setAttribute('date', String(new Date('2019-05-06').getTime()))
      node.disabled = (date) => {
        return date.valueOf() === disabledDate.valueOf()
      }
    }, disabledDate)
    await coreDatepicker.getByRole('combobox').selectOption('september')
    await expect(coreDatepicker.getByRole('combobox')).toHaveValue('y-9-d')
  })
  
  test('has month disabled if all days are disabled', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-template' }))
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-05-06').getTime()))
      node.disabled = (date) => {
        return date.getMonth() === 8
      }
    })
    await expect(coreDatepicker.locator('option[value="y-9-d"]')).toBeDisabled()
  })
  
  test('selects first available date in month', async ({ page }) => {
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-datepicker', templateId: 'select-and-input-template' }))
    await coreDatepicker.evaluate(node => {
      node.setAttribute('date', String(new Date('2019-12-09T00:00:00.00Z').getTime()))
      node.disabled = (date) => {
        return date.getMonth() === 10 && !(date < new Date('2019-11-06') && date > new Date('2019-11-03'))
      }
    })
    await coreDatepicker.getByRole('combobox').selectOption('november')
    await expect(coreDatepicker.getByLabel('3. november', { exact: true })).toBeDisabled()
    await expect(coreDatepicker.getByLabel('4. november', { exact: true })).toBeEnabled()
    await expect(coreDatepicker.getByLabel('5. november', { exact: true })).toBeEnabled()
    await expect(coreDatepicker.getByLabel('6. november', { exact: true })).toBeDisabled()
    await expect(coreDatepicker.locator('button[autofocus]')).toHaveText('4')
    await expect(coreDatepicker).toHaveJSProperty('date', new Date('2019-11-04'))
  })
})


