import fs from 'fs'
import path from 'path'
import { delay } from '../test-utils'

const coreScroll = fs.readFileSync(path.resolve(__dirname, 'core-scroll.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')
const addOverflowStyling = () => {
  const css = `
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
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.appendChild(document.createTextNode(css))
}

describe('core-scroll', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreScroll)
    await browser.executeScript(addOverflowStyling)
  })

  describe('Initialization', () => {
    it('sets overflow: scroll', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <core-scroll id="scroller">
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
        </core-scroll>
      `
      })
      await expect($('core-scroll').getCssValue('overflow')).toEqual('scroll')
    })

    it('has getters for scroll-distances', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" friction="0.001">
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item" id="fourth">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
          </core-scroll>
        </div>
      `
      })
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollLeft)).toEqual(0)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollTop)).toEqual(0)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(130)
    })

    it('has getter for items in scroller', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" items="div">
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
          </core-scroll>
        </div>
      `
      })
      // Length is 5 (not 6) as only elements matching items-attribute are counted
      await expect(browser.executeScript(() => document.getElementById('scroller').items.length)).toEqual(5)
    })

    it('accepts list of custom elements to items-attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <core-scroll id="scroller" items="div,span">
          <div>This is overflowing content</div>
          <span>This is overflowing content</span>
          <div>This is overflowing content</div>
        </core-scroll>
      `
      })
      await expect(browser.executeScript(() => document.getElementById('scroller').items.length)).toEqual(3)
    })

    it('accepts float number to friction-attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <core-scroll id="scroller" friction="0.1">
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
        </core-scroll>
      `
      })
      await expect(browser.executeScript(() => document.getElementById('scroller').friction)).toEqual(0.1)
    })
  })

  describe('scroll-function', () => {
    it('works with a cardinal direction', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" friction="0.001">
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item" id="fourth">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
          </core-scroll>
        </div>
      `
      })
      // await browser.wait(ExpectedConditions.presenceOf($('core-datepicker')))
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(130)
      await browser.executeScript(() => {
        document.getElementById('scroller').scroll('right')
      })
      await delay(100) // Wait for animation of .scroll to end
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollLeft)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(0)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(130)
    })

    it('works with x,y coordinates', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" friction="0.001">
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item" id="fourth">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
          </core-scroll>
        </div>
      `
      })
      // await browser.wait(ExpectedConditions.presenceOf($('core-datepicker')))
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(130)
      await browser.executeScript(() => {
        document.getElementById('scroller').scroll({ x: 2, y: 30 })
      })
      await delay(100) // Wait for scroll to end
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollLeft)).toEqual(2)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(170)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollTop)).toEqual(30)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(100)
    })

    it('works with an element', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
        <button data-for="scroller" value="down">Down</button>
        <div class="content-container">
          <core-scroll id="scroller" friction="0.001">
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item" id="fourth">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <br>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
            <div class="content-item">This is overflowing content</div>
          </core-scroll>
        </div>
      `
      })
      // await browser.wait(ExpectedConditions.presenceOf($('core-datepicker')))
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(130)
      await browser.executeScript(() => {
        document.getElementById('scroller').scroll(document.getElementById('fourth'))
      })
      await delay(100) // Wait for scroll to end
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollLeft)).toEqual(172)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollRight)).toEqual(0)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollTop)).toEqual(110)
      await expect(browser.executeScript(() => document.getElementById('scroller').scrollBottom)).toEqual(20)
    })
  })
})
