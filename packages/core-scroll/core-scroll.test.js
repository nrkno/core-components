import fs from 'fs'
import path from 'path'

const coreScroll = fs.readFileSync(path.resolve(__dirname, 'core-scroll.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-scroll', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreScroll)
  })

  it('sets up properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="scroller" value="down">Down</button>
        <core-scroll id="scroller">
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
          <div>This is overflowing content</div>
        </core-scroll>
      `
    })
    await expect($('core-scroll').getCssValue('overflow')).toEqual('scroll')
  })
})
