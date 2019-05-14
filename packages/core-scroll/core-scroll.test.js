import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-scroll.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up properties', withPage, async (t, page) => {
  await page.setContent(`
    <button for="scroller" value="down">Down</button>
    <core-scroll id="scroller">
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
      <div>This is overflowing content</div>
    </core-scroll>
  `)
  t.is(await page.$eval('core-scroll', el => el.style.overflow), 'scroll')
  t.is(await page.$eval('core-scroll', el => el.style.webkitOverflowScrolling), 'touch')
  t.is(await page.$eval('core-scroll', el => el.style.maxHeight), 'calc(100% + 0px)')
  t.is(await page.$eval('core-scroll', el => el.style.marginRight), '0px')
  t.is(await page.$eval('core-scroll', el => el.style.marginBottom), '0px')
})
