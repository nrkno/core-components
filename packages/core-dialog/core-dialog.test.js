import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-dialog.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up properties', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog-1">Open</button>
    <core-dialog id="dialog-1" hidden></core-dialog>
  `)
  t.is(await page.$eval('core-dialog', el => el.getAttribute('role')), 'dialog')
  t.is(await page.$eval('core-dialog', el => el.getAttribute('aria-modal')), 'true')
})

test('opens and closes', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog">Open</button>
    <core-dialog id="dialog" hidden>
      <div>Some content</div>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.click('button[for="dialog"]')
  t.false(await page.$eval('core-dialog', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden')))
  await page.click('button[for="close"]')
  t.true(await page.$eval('core-dialog', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden')))
  await page.evaluate(() => (document.querySelector('core-dialog').hidden = false))
  t.false(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden')))
  await page.evaluate(() => (document.querySelector('core-dialog').hidden = true))
  t.true(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden')))
})

test('opens and closes nested', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog-outer">Open</button>
    <core-dialog id="dialog-outer" hidden>
      <div>Some content</div>
      <button type="button" autofocus>Autofocus</button>
      <button for="dialog-inner">Open inner</button>
      <core-dialog id="dialog-inner" hidden>
        <div>Nested content</div>
        <button for="close">Close</button>
      </core-dialog>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.click('button[for="dialog-outer"]')
  await page.click('button[for="dialog-inner"]')
  t.false(await page.$eval('#dialog-outer + backdrop', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('#dialog-outer #dialog-inner + backdrop', el => el.hasAttribute('hidden')))
  await page.click('#dialog-inner button[for="close"]')
  t.true(await page.$eval('#dialog-inner', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('#dialog-inner + backdrop', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('#dialog-outer + backdrop', el => el.hasAttribute('hidden')))
})

test('closes nested with esc', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog-outer">Open</button>
    <core-dialog id="dialog-outer" hidden>
      <div>Some content</div>
      <button type="button" autofocus>Autofocus</button>
      <button for="dialog-inner">Open inner</button>
      <core-dialog id="dialog-inner" hidden>
        <div>Nested content</div>
        <button for="close">Close</button>
      </core-dialog>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.click('button[for="dialog-outer"]')
  await page.click('button[for="dialog-inner"]')
  await page.keyboard.press('Escape')
  t.true(await page.$eval('#dialog-inner', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden')))
  await page.keyboard.press('Escape')
  t.true(await page.$eval('#dialog-outer', el => el.hasAttribute('hidden')))
})

test('respects aria-modal option', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog">Open</button>
    <core-dialog id="dialog" aria-modal="false" hidden>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.click('button[for="dialog"]')
  t.false(await page.$eval('core-dialog', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('core-dialog + backdrop', el => el.hasAttribute('hidden')))
})

test('respects strict option', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog">Open</button>
    <core-dialog id="dialog" strict hidden>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.click('button[for="dialog"]')
  t.false(await page.$eval('core-dialog', el => el.hasAttribute('hidden')))
  await page.evaluate(() => document.querySelector('core-dialog + backdrop').click())
  t.false(await page.$eval('core-dialog', el => el.hasAttribute('hidden')))
})

test('triggers toggle event', withPage, async (t, page) => {
  await page.setContent(`
    <button for="dialog">Open</button>
    <core-dialog id="dialog" hidden>
      <button for="close">Close</button>
    </core-dialog>
  `)
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('dialog.toggle', resolve)
      document.querySelector('core-dialog').hidden = false
    })
  })
  t.pass()
})
