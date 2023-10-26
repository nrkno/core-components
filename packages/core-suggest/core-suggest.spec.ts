import { expect, Locator, Page } from '@playwright/test';
import CoreSuggest from './core-suggest';
import { test } from '../test-fixtures'

test.describe('core-suggest', () => {
  let coreSuggest: Locator
  let coreSuggestInput: Locator
  let ajaxSuccessEvents: Array<unknown>
  let ajaxErrorEvents: Array<unknown>
  
  const CAPTURE_SUCCESS_EVENT_FUNCTION = 'captureSuccessEvent'
  const CAPTURE_ERROR_EVENT_FUNCTION = 'captureErrorEvent'
  const TEST_URL = '/random/search'
  const TEST_BAD_URL = 'https://foo/'
  const TEST_ERROR_RESPONSE = '{"error": "Go away"}'
  const TEST_JSON_RESPONSE = { results: [] }
  const TEST_BAD_JSON_RESPONSE = '{"I am bad JSON"}'

  test.beforeEach(async ({ page }) => {
    ajaxSuccessEvents = []
    ajaxErrorEvents = []
    await page.exposeFunction(CAPTURE_SUCCESS_EVENT_FUNCTION, (event: CustomEvent) => ajaxSuccessEvents.push(event))
    await page.exposeFunction(CAPTURE_ERROR_EVENT_FUNCTION, (event: CustomEvent) => ajaxErrorEvents.push(event))
    coreSuggest = page.getByTestId('core-suggest')
    coreSuggestInput = page.getByTestId('core-suggest-input')
  })
  
  test.afterEach(async ({ page }) => {
    page.close()
  })
  

  const defaultTemplate = (page: Page): Promise<void> => page.setContent(`
    <input data-testid="core-suggest-input" type="text">
    <core-suggest data-testid="core-suggest" hidden>
      <ul>
        <li><button id="one">Suggest 1</button></li>
        <li><button id="two">Suggest 2</button></li>
        <li><button id="three">Suggest 3</button></li>
        <li><button id="four">Suggest 4</button></li>
      </ul>
    </core-suggest>
    <span>outside</span>
  `)
  
  
  test('sets up properties', async ({ page }) => {
    await defaultTemplate(page)
    await expect(coreSuggestInput).toHaveAttribute('aria-autocomplete', 'list')
    await expect(coreSuggestInput).toHaveAttribute('autocomplete', 'off')
    await expect(coreSuggestInput).toHaveAttribute('aria-expanded', 'false')
  })
  
  test('opens suggestions on input click', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.click()
    await expect(coreSuggestInput).toHaveAttribute('aria-expanded', 'true')
    await expect(coreSuggest).toHaveJSProperty('hidden', false)
  })
  
  test('does not open suggestions on clicking a disabled input', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text" disabled>
      <core-suggest data-testid="core-suggest" hidden>
        <ul>
          <li><button id="one">Suggest 1</button></li>
          <li><button id="two">Suggest 2</button></li>
          <li><button id="three">Suggest 3</button></li>
        </ul>
      </core-suggest>
    `)
    await coreSuggestInput.click({ force: true })
    await expect(coreSuggestInput).toHaveAttribute('aria-expanded', 'false')
    await expect(coreSuggest).toHaveJSProperty('hidden', true)
  })
  
  test('closes suggestions on click outside', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.click()
    await expect(coreSuggest).toBeVisible()
    await page.getByText('outside').click()
    await expect(coreSuggest).toBeHidden()
  })
  
  test('sets input value to selected suggestion', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.click()
    await coreSuggest.getByText('Suggest 2').click()
    await expect(coreSuggestInput).toHaveValue('Suggest 2')
  })
  
  test('filters suggestions from input value', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.fill('2')
    await expect(coreSuggest.getByText('Suggest 1')).toBeHidden()
    await expect(coreSuggest.getByText('Suggest 2')).toBeVisible()
    await expect(coreSuggest.getByText('Suggest 3')).toBeHidden()
    await expect(coreSuggest.getByText('Suggest 4')).toBeHidden()
  })

  test('filter is reset on clearing input value', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.fill('2')
    await expect(coreSuggest.getByText('Suggest 1')).toBeHidden()
    await coreSuggestInput.clear()
    await expect(coreSuggest.getByText('Suggest 1')).toBeVisible()
    await expect(coreSuggest.getByText('Suggest 2')).toBeVisible()
    await expect(coreSuggest.getByText('Suggest 3')).toBeVisible()
    await expect(coreSuggest.getByText('Suggest 4')).toBeVisible()
  })
  
  // TODO: Review assertions
  // <ul> element is set to hidden on listitem click (correct behaviour?)
  // thus delclartive assertions toBeHidden/toBeVisible does not work here
  test.fixme('filters suggestions from input value when selecting suggestion', async ({ page }) => {
    await defaultTemplate(page)
    await coreSuggestInput.click()
    await coreSuggest.getByText('Suggest 2').click()
    await expect(coreSuggest.getByText('Suggest 1')).toHaveAttribute('hidden', '')
    await expect(coreSuggest.getByText('Suggest 2')).not.toHaveAttribute('hidden', '')
    await expect(coreSuggest.getByText('Suggest 3')).toHaveAttribute('hidden', '')
    // await expect(coreSuggest.getByText('Suggest 1')).toBeHidden()
    // await expect(coreSuggest.getByText('Suggest 2')).toBeVisible()
    // await expect(coreSuggest.getByText('Suggest 3')).toBeHidden()
  })
  
  test('sets type="button" on all suggestion buttons', async ({ page }) => {
    await defaultTemplate(page)
    await expect(coreSuggest.getByText('Suggest 1')).toHaveAttribute('type', 'button')
    await expect(coreSuggest.getByText('Suggest 2')).toHaveAttribute('type', 'button')
    await expect(coreSuggest.getByText('Suggest 3')).toHaveAttribute('type', 'button')
  })
  
  test('sets up and parses limit option', async ({ page }) => {
    const reloadLimit = async () => {
      await page.keyboard.press('Escape')
      await coreSuggestInput.fill('')
      await coreSuggestInput.fill('s')
    }
    
    await defaultTemplate(page)
    
    await test.step('limit not set', async () => {
      await coreSuggestInput.click()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(4)
    })
    await test.step('limit = 2', async () => {
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = 2)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(2)
    })
    await test.step('limit = -2', async () => {
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = -2)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(4)
    })
    await test.step('limit = 1', async () => {      
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = 1)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(1)
    })
    await test.step('limit = null', async () => {      
      // @ts-expect-error: might not be valid test case
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = null)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(4)
    })
    await test.step('limit = 3', async () => {
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = 3)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(3)
    })
    await test.step('limit = undefined', async () => {
      // @ts-expect-error: might not be valid test case
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = undefined)
      await reloadLimit()
      await expect(coreSuggest.locator('li:visible')).toHaveCount(4)
    })
  })
  
  test('filters suggestions from limit option', async ({ page }) => {
    await defaultTemplate(page)
    await test.step('limit = 2', async () => {
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = 2)
      await coreSuggestInput.click()
      await expect(coreSuggest.getByText('Suggest 1')).toBeVisible()
      await expect(coreSuggest.getByText('Suggest 2')).toBeVisible()
      await expect(coreSuggest.getByText('Suggest 3')).toBeHidden()
      await expect(coreSuggest.getByText('Suggest 4')).toBeHidden()
    })
    await test.step('limit = 3', async () => {
      await coreSuggest.evaluate((node: CoreSuggest) => node.limit = 3)
      await coreSuggestInput.fill('s')
      await expect(coreSuggest.getByText('Suggest 1')).toBeVisible()
      await expect(coreSuggest.getByText('Suggest 2')).toBeVisible()
      await expect(coreSuggest.getByText('Suggest 3')).toBeVisible()
      await expect(coreSuggest.getByText('Suggest 4')).toBeHidden()
      await expect(coreSuggest.getByLabel('Suggest 4, 4 av 3')).toBeHidden()
    })
  })
  
  test('defaults to highlight -attribute "on", stripping existing and adding new <mark>-tags', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" hidden>
        <ul>
          <li><button id="one">Suggest <mark>1</mark></button></li>
          <li><button id="two">Suggest 2</button></li>
        </ul>
      </core-suggest>
    `)
    await coreSuggestInput.click()
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveCount(0)
    await coreSuggestInput.fill('2')
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveText('2')
  })
  
  test('supports highlight -attribute "keep", keeping existing and not adding new <mark>-tags', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" highlight="keep" hidden>
        <ul>
          <li><button id="one">Suggest <mark>1</mark></button></li>
          <li><button id="two">Suggest 2</button></li>
        </ul>
      </core-suggest>
    `)
    await coreSuggestInput.click()
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveText('1')
    await coreSuggestInput.fill('2')
    // TODO: Peer review validity / deviates from previous test file
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveCount(0)
  })
  
  test('supports highlight -attribute "off", stripping existing and not adding new <mark>-tags', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" highlight="off" hidden>
        <ul>
          <li><button id="one">Suggest <mark>1</mark></button></li>
          <li><button id="two">Suggest 2</button></li>
        </ul>
      </core-suggest>
    `)
    await coreSuggestInput.click()
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveCount(0)
    await coreSuggestInput.fill('2')
    // TODO: Peer review validity / deviates from previous test file
    // @ts-ignore
    await expect(coreSuggest.getByRole('mark')).toHaveCount(0)
  })
  
  test('triggers ajax event on input', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest ajax="${TEST_URL}" data-testid="core-suggest" hidden></core-suggest>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('suggest.ajax', event => window.captureSuccessEvent(event))
    `})
    await page.route(`*/**${TEST_URL}`, async route => {
      await route.fulfill({ json: TEST_JSON_RESPONSE })
    })
    await coreSuggestInput.fill('abc')
    let responsePromise = await page.waitForResponse(`*/**${TEST_URL}`)
    let responseJson = await responsePromise.json()
    expect(responseJson).toEqual(TEST_JSON_RESPONSE)
    await page.waitForFunction(CAPTURE_SUCCESS_EVENT_FUNCTION)
    expect(ajaxSuccessEvents).toHaveLength(1)
    // TODO: Assert payload
    // Cross Origin Issue; Event is always {isTrusted: false}
    // await expect(error).toEqual('Error: Network request failed')
    // await expect(text).toEqual(TEST_JSON_RESPONSE)
  })
  
  test('triggers ajax error event on bad url', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" ajax="${TEST_BAD_URL}" hidden></core-suggest>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('suggest.ajax.error', window.captureErrorEvent)
    `})
    await page.route(TEST_BAD_URL, async route => {
      await route.abort('blockedbyresponse')
    })
    await coreSuggestInput.fill('abc')
    await page.waitForRequest(TEST_BAD_URL)
    await page.waitForFunction('window.captureErrorEvent')
    await expect(ajaxErrorEvents).toHaveLength(1)
    // TODO: Assert errorResponse message
    // Cross Origin Issue; Event is always {isTrusted: false}
    // await expect(error).toEqual('Error: Network request failed')
  })
  
  test('triggers ajax error event on bad response status', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" ajax="${TEST_URL}" hidden></core-suggest>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('suggest.ajax.error', event => window.captureErrorEvent(event))
    `})
    await page.route(`*/**${TEST_URL}`, async route => {
      await route.fulfill({ status: 500, json: TEST_ERROR_RESPONSE })
    })
    await coreSuggestInput.fill('abc')
    await page.waitForRequest(TEST_URL)
    await page.waitForFunction('window.captureErrorEvent')
    expect(ajaxErrorEvents).toHaveLength(1)
    // TODO: Assert errorResponse message
    // Cross Origin Issue; Event is always {isTrusted: false}
    // await expect(text).toEqual(TEST_ERROR_RESPONSE)
  })
  
  // Unable to fulfill request correctly
  // Does not seem to trigger JSON parse in core-suggest
  test.fixme('triggers ajax error event on bad json', async ({ page }) => {
    await page.setContent(`
      <input data-testid="core-suggest-input" type="text">
      <core-suggest data-testid="core-suggest" ajax="${TEST_URL}" hidden></core-suggest>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('suggest.ajax.error', async event => await window.captureErrorEvent(event))
    `})
    await page.route(`*/**${TEST_URL}`, async route => {
      await route.fulfill({ json: TEST_BAD_JSON_RESPONSE, headers: { 'Access-Control-Allow-Origin': '*'} })
    })
    await coreSuggestInput.fill('abc')
    await page.waitForRequest(TEST_URL)
    await page.waitForFunction('window.captureErrorEvent')
    expect(ajaxErrorEvents).toHaveLength(1)
    // TODO: Assert errorResponse message
    // Cross Origin Issue; Event is always {isTrusted: false}
    // await expect(text).toEqual(TEST_BAD_JSON_RESPONSE)
  })
  
  test.describe('aria-live', () => {

    test('creates an empty span on body with aria-live="polite"', async ({ page }) => {
      await defaultTemplate(page)
      await expect(page.locator('body > span', { hasNotText: 'outside' })).toHaveAttribute('aria-live', 'polite')
    })
    
    test('exposes internal function pushToLiveRegion to append, then clear textContent of aria-live region', async ({ page }) => {
      const LIVE_REGION_TEXT = 'TEST'
      await defaultTemplate(page)
      await coreSuggest.evaluate((node: CoreSuggest, text) => node.pushToLiveRegion(text), LIVE_REGION_TEXT)
      await page.waitForFunction(`document.querySelector('core-suggest')._setLiveRegion`)
      await expect(page.locator('body > span', { hasNotText: 'outside' })).toHaveText(LIVE_REGION_TEXT)
      await page.waitForFunction(`document.querySelector('core-suggest')._clearLiveRegion`)
      await expect(page.locator('body > span', { hasNotText: 'outside' })).toHaveText('')
    })
  })
})
