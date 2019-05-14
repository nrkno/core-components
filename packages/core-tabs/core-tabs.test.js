import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-tabs.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up all properties', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1">First tab</button>
      <button id="tab-2">Second tab</button>
    </core-tabs>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  t.is(await page.$eval('core-tabs', el => el.getAttribute('role')), 'tablist')
  t.truthy(await page.$eval('#tab-1', el => el.getAttribute('aria-controls')))
  t.true(await page.$eval('#tab-1', el => el.getAttribute('aria-controls') === 'panel-1'))
  t.is(await page.$eval('#tab-1', el => el.getAttribute('role')), 'tab')
  t.is(await page.$eval('#tab-1', el => el.getAttribute('tabindex')), '0')
  t.is(await page.$eval('#tab-1', el => el.getAttribute('aria-selected')), 'true')
  t.truthy(await page.$eval('#tab-2', el => el.getAttribute('aria-controls')))
  t.true(await page.$eval('#tab-2', el => el.getAttribute('aria-controls') === 'panel-2'))
  t.is(await page.$eval('#tab-2', el => el.getAttribute('role')), 'tab')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('tabindex')), '-1')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'false')
  t.truthy(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby')))
  t.true(await page.$eval('#panel-1', el => el.getAttribute('aria-labelledby') === 'tab-1'))
  t.is(await page.$eval('#panel-1', el => el.getAttribute('role')), 'tabpanel')
  t.is(await page.$eval('#panel-1', el => el.getAttribute('tabindex')), '0')
  t.false(await page.$eval('#panel-1', el => el.hasAttribute('hidden')))
  t.truthy(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby')))
  t.true(await page.$eval('#panel-2', el => el.getAttribute('aria-labelledby') === 'tab-2'))
  t.is(await page.$eval('#panel-2', el => el.getAttribute('role')), 'tabpanel')
  t.is(await page.$eval('#panel-2', el => el.getAttribute('tabindex')), '0')
  t.true(await page.$eval('#panel-2', el => el.hasAttribute('hidden')))
})

test('selects tab by index', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1">First tab</button>
      <button id="tab-2">Second tab</button>
    </core-tabs>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  await page.evaluate(() => { document.querySelector('core-tabs').tab = 1 })
  t.is(await page.$eval('#tab-1', el => el.getAttribute('aria-selected')), 'false')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'true')
})

test('selects tab by id', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1">First tab</button>
      <button id="tab-2">Second tab</button>
    </core-tabs>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  await page.evaluate(() => (document.querySelector('core-tabs').tab = 'tab-2'))
  t.is(await page.$eval('#tab-1', el => el.getAttribute('aria-selected')), 'false')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'true')
})

test('selects tab by element', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1">First tab</button>
      <button id="tab-2">Second tab</button>
    </core-tabs>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  await page.evaluate(() => (document.querySelector('core-tabs').tab = document.querySelector('#tab-2')))
  t.is(await page.$eval('#tab-1', el => el.getAttribute('aria-selected')), 'false')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'true')
})

test('respects for on tabs', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1" for="panel-1">First tab</button>
      <button id="tab-2" for="panel-2">Second tab</button>
    </core-tabs>
    <div id="panel-2">Text of tab 2</div>
    <div id="panel-1">Text of tab 1</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  t.is(await page.$eval('#tab-1', el => el.getAttribute('aria-selected')), 'true')
  t.is(await page.$eval('#tab-1', el => el.getAttribute('tabindex')), '0')
  t.false(await page.$eval('#panel-1', el => el.hasAttribute('hidden')))
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'false')
  t.is(await page.$eval('#tab-2', el => el.getAttribute('tabindex')), '-1')
  t.true(await page.$eval('#panel-2', el => el.hasAttribute('hidden')))
})

test('respects for for single panel', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1" for="panel-1">First tab</button>
      <button id="tab-2" for="panel-1">Second tab</button>
      <button id="tab-3" for="panel-2">Third tab</button>
    </core-tabs>
    <p>I'm an element</p>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  await page.evaluate(() => (document.querySelector('core-tabs').tab = 1))
  t.is(await page.$eval('#tab-2', el => el.getAttribute('aria-selected')), 'true')
  t.false(await page.$eval('#panel-1', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('#panel-2', el => el.hasAttribute('hidden')))
})

test('triggers toggle event', withPage, async (t, page) => {
  await page.setContent(`
    <core-tabs>
      <button id="tab-1">First tab</button>
      <button id="tab-2">Second tab</button>
    </core-tabs>
    <div id="panel-1">Text of tab 1</div>
    <div id="panel-2">Text of tab 2</div>
  `)
  await page.waitFor('core-tabs [role="tab"]')
  const toggledTab = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('tabs.toggle', ({ target }) => resolve(target.tab.id))
      document.querySelector('core-tabs').tab = 1
    })
  })
  t.is(toggledTab, 'tab-2')
  t.is(await page.$eval('core-tabs', el => el.tab.id), toggledTab)
})
