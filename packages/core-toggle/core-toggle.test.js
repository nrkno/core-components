import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-toggle.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up all properties', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle hidden></core-toggle>
  `)
  t.is(await page.$eval('button', el => el.getAttribute('aria-expanded')), 'false')
  t.true(await page.$eval('button', el => el.getAttribute('aria-controls') === document.querySelector('core-toggle').id))
  t.true(await page.$eval('core-toggle', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('core-toggle', el => el.getAttribute('aria-labelledby') === document.querySelector('button').id))
})

test('opens and closes toggle', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle hidden></core-toggle>
  `)
  await page.click('button')
  t.is(await page.$eval('button', el => el.getAttribute('aria-expanded')), 'true')
  await page.click('button')
  t.is(await page.$eval('button', el => el.getAttribute('aria-expanded')), 'false')
  await page.click('button')
  t.is(await page.$eval('button', el => el.getAttribute('aria-expanded')), 'true')
  await page.click('button')
  t.is(await page.$eval('button', el => el.getAttribute('aria-expanded')), 'false')
})

test('opens and closes nested toggle', withPage, async (t, page) => {
  await page.setContent(`
    <button id="outer">Toggle outer</button>
    <core-toggle hidden>
      <button id="inner">Toggle inner</button>
      <core-toggle hidden>
        <div>Inner content</div>
      </core-toggle>
    </core-toggle>
  `)
  await page.click('button#outer')
  await page.click('button#inner')
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  await page.click('button#inner')
  t.true(await page.$eval('button#inner + core-toggle', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  await page.click('button#outer')
  t.true(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
})

test('closes nested toggle with esc', withPage, async (t, page) => {
  await page.setContent(`
    <button id="outer">Toggle outer</button>
    <core-toggle hidden>
      <button id="inner">Toggle inner</button>
      <core-toggle hidden>
        <div>Inner content</div>
      </core-toggle>
    </core-toggle>
  `)
  await page.click('button#outer')
  await page.click('button#inner')
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  await page.keyboard.press('Escape')
  t.true(await page.$eval('button#inner + core-toggle', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
  await page.keyboard.press('Escape')
  t.true(await page.$eval('button#outer + core-toggle', el => el.hasAttribute('hidden')))
})

test('closes on outside click with popup', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle popup hidden></core-toggle>
  `)
  await page.click('button')
  t.false(await page.$eval('core-toggle', el => el.hasAttribute('hidden')))
  await page.click('body')
  t.true(await page.$eval('core-toggle', el => el.hasAttribute('hidden')))
})

test('respects "for" attribute', withPage, async (t, page) => {
  await page.setContent(`
    <div><button for="content">Toggle</button></div>
    <core-toggle id="content" hidden></core-toggle>
  `)
  t.true(await page.$eval('core-toggle', el => el.button.getAttribute('for') === el.id))
  t.true(await page.$eval('core-toggle', el => el.button.getAttribute('aria-controls') === el.id))
})

test('respects exisiting aria-label with popup and value', withPage, async (t, page) => {
  await page.setContent(`
    <button aria-label="Label">Toggle</button>
    <core-toggle popup="Another label" hidden></core-toggle>
  `)
  await page.$eval('core-toggle', el => (el.value = 'Button text'))
  t.is(await page.$eval('button', el => el.textContent), await page.$eval('core-toggle', el => el.value))
  t.is(await page.$eval('button', el => el.getAttribute('aria-label')), 'Label')
})

test('sets aria-label with popup attr and value', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle popup="Some label" hidden></core-toggle>
  `)
  await page.$eval('core-toggle', el => (el.value = 'Button text'))
  t.is(await page.$eval('button', el => el.textContent), await page.$eval('core-toggle', el => el.value))
  t.is(await page.$eval('button', el => el.getAttribute('aria-label')), 'Button text,Some label')
})

test('sets aria-label with popup prop and value', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle hidden></core-toggle>
  `)
  await page.$eval('core-toggle', el => (el.popup = 'Some label'))
  await page.$eval('core-toggle', el => (el.value = 'Button text'))
  t.is(await page.$eval('button', el => el.textContent), await page.$eval('core-toggle', el => el.value))
  t.is(await page.$eval('button', el => el.getAttribute('aria-label')), 'Button text,Some label')
})

test('triggers toggle event', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle hidden></core-toggle>
  `)
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('toggle', resolve)
      document.querySelector('core-toggle').hidden = false
    })
  })
  t.pass()
})

test('triggers select event', withPage, async (t, page) => {
  await page.setContent(`
    <button>Toggle</button>
    <core-toggle hidden>
      <button id="item">Select me</button>
    </core-toggle>
  `)
  const selected = await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('toggle.select', ({ detail }) => resolve(detail.id))
      const toggle = document.querySelector('core-toggle')
      toggle.hidden = false
      toggle.children[0].click()
    })
  })
  t.is(selected, 'item')
})
