import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-suggest.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up properties', withPage, async (t, page) => {
  await page.setContent(`<input type="text"><core-suggest hidden></core-suggest>`)
  t.is(await page.$eval('input', el => el.getAttribute('aria-autocomplete')), 'list')
  t.is(await page.$eval('input', el => el.getAttribute('autocomplete')), 'off')
  t.is(await page.$eval('input', el => el.getAttribute('aria-expanded')), 'false')
})

test('opens suggestions on input focus', withPage, async (t, page) => {
  await page.setContent(`<input type="text"><core-suggest hidden></core-suggest>`)
  await page.click('input')
  t.is(await page.$eval('input', el => el.getAttribute('aria-expanded')), 'true')
  t.false(await page.$eval('core-suggest', el => el.hasAttribute('hidden')))
})

test('closes suggestions on click outside', withPage, async (t, page) => {
  await page.setContent(`<input type="text"><core-suggest hidden></core-suggest>`)
  await page.click('input')
  t.false(await page.$eval('core-suggest', el => el.hasAttribute('hidden')))
  await page.click('body')
  t.true(await page.$eval('core-suggest', el => el.hasAttribute('hidden')))
})

test('sets input value to selected suggestion', withPage, async (t, page) => {
  await page.setContent(`
    <input type="text">
    <core-suggest hidden>
      <ul>
        <li><button>Suggest 1</button>
        <li><button>Suggest 2</button>
      </ul>
    </core-suggest>
  `)
  await page.click('input')
  await page.click('button')
  t.is(await page.$eval('input', el => el.value), 'Suggest 1')
})

test('filters suggestions from input value', withPage, async (t, page) => {
  await page.setContent(`
    <input type="text">
    <core-suggest hidden>
      <ul>
        <li><button>Suggest 1</button>
        <li><button>Suggest 2</button>
        <li><button>Suggest 3</button>
      </ul>
    </core-suggest>
  `)
  await page.type('input', '2')
  t.true(await page.$eval('li:nth-child(1) button', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('li:nth-child(2) button', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('li:nth-child(3) button', el => el.hasAttribute('hidden')))
})

test('sets type="button" on all suggestion buttons', withPage, async (t, page) => {
  await page.setContent(`
    <input type="text">
    <core-suggest hidden>
      <ul>
        <li><button>Suggest 1</button>
        <li><button>Suggest 2</button>
        <li><button>Suggest 3</button>
      </ul>
    </core-suggest>
  `)
  t.true(await page.$$eval('button', els => els.every(el => el.getAttribute('type') === 'button')))
})

test('sets up and parses limit option', withPage, async (t, page) => {
  await page.setContent(`<input type="text"><core-suggest hidden></core-suggest>`)
  t.is(await page.$eval('core-suggest', el => el.limit), Infinity)
  await page.$eval('core-suggest', el => el.limit = 2)
  t.is(await page.$eval('core-suggest', el => el.limit), 2)
  await page.$eval('core-suggest', el => el.limit = -2)
  t.is(await page.$eval('core-suggest', el => el.limit), 0)
  await page.$eval('core-suggest', el => el.limit = null)
  t.is(await page.$eval('core-suggest', el => el.limit), 0)
  await page.$eval('core-suggest', el => el.limit = undefined)
  t.is(await page.$eval('core-suggest', el => el.limit), 0)
})

test('limits suggestions from limit option', withPage, async (t, page) => {
  await page.setContent(`
    <input type="text">
    <core-suggest limit="2" hidden>
      <ul>
        <li><button>Suggest 1</button>
        <li><button>Suggest 2</button>
        <li><button>Suggest 3</button>
        <li><button>Suggest 4</button>
      </ul>
    </core-suggest>
  `)
  t.false(await page.$eval('li:nth-child(1) button', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('li:nth-child(2) button', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('li:nth-child(3) button', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('li:nth-child(4) button', el => el.hasAttribute('hidden')))
  await page.$eval('core-suggest', el => el.limit = 3)
  t.false(await page.$eval('li:nth-child(1) button', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('li:nth-child(2) button', el => el.hasAttribute('hidden')))
  t.false(await page.$eval('li:nth-child(3) button', el => el.hasAttribute('hidden')))
  t.true(await page.$eval('li:nth-child(4) button', el => el.hasAttribute('hidden')))
})
