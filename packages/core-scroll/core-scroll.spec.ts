import { test, expect, Locator, Page } from '@playwright/test'
import { scrollPoint } from './core-scroll'
import CoreScroll from './core-scroll'

declare global {
  interface Window { scrollEvents: Event[], done: scrollPoint }
}

 

// type CoreScrollFixtures = {
//   default: 
// }

const defaultHtml = `
  <button data-for="scroller" value="down">Down</button>
  <div class="content-container">
    <core-scroll id="scroller" data-testid="core-scroll" friction="0.001">
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item" id="fourth">This is overflowing content</div>
      <br>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item" id="eight">This is overflowing content</div>
      <br>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
      <div class="content-item">This is overflowing content</div>
    </core-scroll>
  </div>
`

const defaultStyles = `
  .content-container {
    height: 200px;
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    border: 1px solid;
  }

  .content-item {
    box-sizing: border-box;
    white-space: normal;
    display: inline-block;
    vertical-align: top;
    width: 30%;
    height: 90px;
    padding: 10px;
    border: 1px solid;
    margin: 10px;
  }
`

test.describe('initialization', () => {
  let coreScroll: Locator

  const defaultPage = async (page: Page): Promise<void> => {
    await page.setContent(defaultHtml)
    await page.addStyleTag({ content: defaultStyles })
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('./core-scroll/core-scroll.spec.html')
    coreScroll = page.getByTestId('core-scroll')
  })

  test('sets overflow: scroll', async ({ page }) => {
    await defaultPage(page)
    await expect(coreScroll).toHaveCSS('overflow', 'scroll')
  })

  
  test('has getters for scroll-distances', async ({ page }) => {
    await defaultPage(page)
    await expect(coreScroll).toHaveJSProperty('scrollLeft', 0)
    await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
    await expect(coreScroll).toHaveJSProperty('scrollTop', 0)
    await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  })
  
  test('has getter for items in scroller', async ({ page }) => {
    await defaultPage(page)
    await coreScroll.evaluate(node => node.setAttribute('items', 'div'))
    // Length is 12 (not 14) as only elements matching items-attribute are counted
    await expect(coreScroll).toHaveAttribute('items', 'div')
    expect(await coreScroll.evaluate(node => node.items.length)).toEqual(12)
  })
  
  test('accepts list of custom lements to items-attribute', async ({ page }) => {
    await page.setContent(`
      <button data-for="scroller" value="down">Down</button>
      <div class="content-container">
        <core-scroll id="scroller" data-testid="core-scroll">
          <div>This is overflowing content</div>
          <span>This is overflowing content</span>
          <div>This is overflowing content</div>
        </core-scroll>
      </div>
    `)
    await coreScroll.evaluate(node => node.setAttribute('items', 'div,span'))
    expect(coreScroll).toHaveAttribute('items', 'div,span')
    expect(await coreScroll.evaluate(node => node.items.length)).toEqual(3)
  })
  
  test('accepts float number to friction-attribute', async ({ page }) => {
    await defaultPage(page)
    await coreScroll.evaluate(node => node.friction = 0.1)
    await expect(coreScroll).toHaveJSProperty('friction', 0.1)
  })
  
  test('dispatches "scroll.change" onConnected and when children are added/removed', async ({ page }) => {
    let numChangeEvents = 0
    await page.exposeFunction('captureChangeEvent', () => numChangeEvents += 1)
    await page.setContent(`
      <button data-for="scroller" value="down">Down</button>
      <div class="content-container">
        <core-scroll id="scroller" data-testid="core-scroll">
          <div class="content-item">This is overflowing content</div>
          <br>
          <div class="content-item">This is overflowing content</div>
          <br>
          <div class="content-item" id="targetEl">This is overflowing content</div>
        </core-scroll>
      </div>
    `)
    await page.addScriptTag({ content: `
      document.addEventListener('scroll.change', window.captureChangeEvent)
    `})
    await page.addStyleTag({ content: defaultStyles })
    // TODO: Unable to addEventListener before setContent, thus onConnected can not be recorded
    expect(numChangeEvents).toBe(0) 
    await coreScroll.evaluate(node => node.insertAdjacentHTML('beforeend', `
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
    `))
    await page.waitForFunction('window.captureChangeEvent')
    expect(numChangeEvents).toBe(1)
    await coreScroll.evaluate(node => node.children[0].remove())
    await page.waitForFunction('window.captureChangeEvent')
    expect(numChangeEvents).toBe(2)
  })
  
  test.describe('scroll-function', () => {
    test('works with a cardinal direction', async ({ page }) => {
      await defaultPage(page)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  
      await coreScroll.evaluate(node => node.scroll('right'))
      await expect(coreScroll).toHaveJSProperty('scrollLeft', 172)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 0)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
    })
  
    test('works with x,y coordinates', async ({ page }) => {
      await defaultPage(page)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  
      await coreScroll.evaluate(node => node.scroll({ x: 2, y: 30 }))
      await expect(coreScroll).toHaveJSProperty('scrollLeft', 2)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 170)
      await expect(coreScroll).toHaveJSProperty('scrollTop', 30)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 100)
    })
  
    test('works with an element', async ({ page }) => {
      await defaultPage(page)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 172)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 130)
  
      await coreScroll.evaluate(node => node.scroll(document.getElementById('eight')))
      await expect(coreScroll).toHaveJSProperty('scrollLeft', 172)
      await expect(coreScroll).toHaveJSProperty('scrollRight', 0)
      await expect(coreScroll).toHaveJSProperty('scrollTop', 65)
      await expect(coreScroll).toHaveJSProperty('scrollBottom', 65)
    })
    
    test('returns a promise when scrolling is complete', async ({ page }) => {
      await page.setContent(`
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" data-testid="core-scroll">
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item" id="targetEl">This is overflowing content</div>
          </core-scroll>
        </div>
      `)
      await page.addStyleTag({ content: defaultStyles })
      await coreScroll.evaluate(async node => window.done = await node.scroll(document.getElementById('targetEl')))
      expect(await page.evaluate(() => window.done)).toEqual({ x: 0, y: 175 })
    })
  })
})







