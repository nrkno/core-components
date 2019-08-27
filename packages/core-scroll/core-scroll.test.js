import fs from 'fs'
import path from 'path'

const coreScroll = fs.readFileSync(path.resolve(__dirname, 'core-scroll.min.js'), 'utf-8')

describe('core-scroll', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(coreScroll)
  })

  it('sets up properties', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="scroller" value="down">Down</button>
      <core-scroll id="scroller">
        <div>This is overflowing content</div>
        <div>This is overflowing content</div>
        <div>This is overflowing content</div>
      </core-scroll>
    `)
    const style = await browser.executeScript(() => document.querySelector('core-scroll').style)
    await expect(style.overflow).toEqual('scroll')
    await expect(style.webkitOverflowScrolling).toEqual('touch')
    await expect(style.maxHeight).toEqual('calc(100% + 0px)')
    await expect(style.marginRight).toEqual('0px')
    await expect(style.marginBottom).toEqual('0px')
  })
})
