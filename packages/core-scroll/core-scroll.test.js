const path = require('path')

describe('core-scroll', () => {
  beforeAll(async () => {
    page.on('console', msg => console.log(msg._text))
    await page.addScriptTag({ path: path.join(__dirname, 'core-scroll.min.js') })
  })

  it('sets up properties', async () => {
    await page.setContent(`
      <button for="scroller" value="down">Down</button>
      <core-scroll id="scroller">
        <div>This is overflowing content</div>
        <div>This is overflowing content</div>
        <div>This is overflowing content</div>
      </core-scroll>
    `)
    expect(await page.$eval('core-scroll', el => el.style.overflow)).toEqual('scroll')
    expect(await page.$eval('core-scroll', el => el.style.webkitOverflowScrolling)).toEqual('touch')
    expect(await page.$eval('core-scroll', el => el.style.maxHeight)).toEqual('calc(100% + 0px)')
    expect(await page.$eval('core-scroll', el => el.style.marginRight)).toEqual('0px')
    expect(await page.$eval('core-scroll', el => el.style.marginBottom)).toEqual('0px')
  })
})
