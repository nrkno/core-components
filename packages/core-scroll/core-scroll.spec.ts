import { test, expect } from '@playwright/test'
import { scrollPoint } from './core-scroll'

declare global {
  interface Window { scrollEvents: Event[], done: scrollPoint }
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

test.describe('initialization', () => {
  test('sets overflow: scroll', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = page.getByTestId('core-scroll')
    await expect(coreScroll).toHaveCSS('overflow', 'scroll')
  })
  
  test('has getters for scroll-distances', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = page.locator('core-scroll')
    await coreScroll.evaluate(node => node.setAttribute('friction', '0.001'))
    await expect(coreScroll).toHaveJSProperty('scrollLeft', 0)
    await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
    await expect(coreScroll).toHaveJSProperty('scrollTop', 0)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  })
  
  test('has getter for items in scroller', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = page.getByTestId('core-scroll')
    await coreScroll.evaluate(node => node.setAttribute('items', 'div'))
    // Length is 12 (not 14) as only elements matching items-attribute are counted
    await expect(coreScroll).toHaveAttribute('items', 'div')
    expect(await coreScroll.evaluate(node => node.items.length)).toEqual(12)
  })
  
  test('accepts list of custom lements to items-attribute', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'mixed-elements-template' }))
    const coreScroll = page.getByTestId('core-scroll')
    await coreScroll.evaluate(node => node.setAttribute('items', 'div,span'))
    expect(coreScroll).toHaveAttribute('items', 'div,span')
    expect(await coreScroll.evaluate(node => node.items.length)).toEqual(3)
  })
  
  test('accepts float number to friction-attribute', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    const coreScroll = page.getByTestId('core-scroll')
    await coreScroll.evaluate(node => node.setAttribute('friction', '0.1'))
    await expect(coreScroll).toHaveJSProperty('friction', 0.1)
  })
  
  test.fixme('dispatches "scroll.change" onConnected and when children are added/removed', async ({ page }) => {
    // TODO: First condition is flaky test, first event is dispatched twice and once.
    await page.goto('./core-scroll/core-scroll.spec.html')
    expect(await page.getByTestId('change-event-result').textContent()).toContain("1")
    await page.getByTestId('core-scroll').evaluate(node => node.insertAdjacentHTML('beforeend', `
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
    `))
    expect(await page.getByTestId('change-event-result').textContent()).toContain("2")
    await page.getByTestId('core-scroll').evaluate(node => node.children[0].remove())
    expect(await page.getByTestId('change-event-result').textContent()).toContain("3")
  })
})

test.describe('scroll-function', () => {
  test('works with a cardinal direction', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = await page.getByTestId('core-scroll')
    await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)

    await coreScroll.evaluate(node => node.scroll('right'))
    await expect(coreScroll).toHaveJSProperty('scrollLeft', 172)
    await expect(coreScroll).toHaveJSProperty('scrollRight', 0)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  })

  test('works with x,y coordinates', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = await page.getByTestId('core-scroll')
    await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)

    await coreScroll.evaluate(node => node.scroll({ x: 2, y: 30 }))
    
    await expect(coreScroll).toHaveJSProperty('scrollLeft', 2)
    await expect(coreScroll).toHaveJSProperty('scrollRight', 170)
    await expect(coreScroll).toHaveJSProperty('scrollTop', 30)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 100)
  })

  test('works with an element', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'default-template' }))
    const coreScroll = await page.getByTestId('core-scroll')
    await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)

    await coreScroll.evaluate(node => node.scroll(document.getElementById('eight')))

    await expect(coreScroll).toHaveJSProperty('scrollLeft', 172)
    await expect(coreScroll).toHaveJSProperty('scrollRight', 0)
    await expect(coreScroll).toHaveJSProperty('scrollTop', 65)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 65)
  })
  
  test('returns a promise when scrolling is complete', async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    await page.evaluate(setComponentTemplate, ({ componentId: 'core-scroll',  templateId: 'scroll-promise-template' }))
    const coreScroll = await page.getByTestId('core-scroll')

    await coreScroll.evaluate(async node => window.done = await node.scroll(document.getElementById('targetEl')))
    await expect(await page.evaluate(() => window.done)).toEqual({ x: 0, y: 175 })
  })
  
})






