import test from 'ava'
import path from 'path'
import puppeteer from 'puppeteer'

async function withPage (t, run) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  page.on('console', msg => console.log(msg._text))
  await page.addScriptTag({ path: path.join(__dirname, 'core-progress.min.js') })
  try {
    await run(t, page)
  } finally {
    await page.close()
    await browser.close()
  }
}

test('sets up properties', withPage, async (t, page) => {
  await page.setContent('<core-progress></core-progress>')
  t.is(await page.$eval('core-progress', el => el.type), 'linear')
  t.is(await page.$eval('core-progress', el => el.value), 0)
  t.is(await page.$eval('core-progress', el => el.getAttribute('role')), 'img')
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '0%')
})

test('updates label from value', withPage, async (t, page) => {
  await page.setContent('<core-progress value="0.2"></core-progress>')
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '20%')
  await page.evaluate(() => (document.querySelector('core-progress').value = 0))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '0%')
  await page.evaluate(() => (document.querySelector('core-progress').value = 1))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '100%')
})

test('updates label from value as radial', withPage, async (t, page) => {
  await page.setContent('<core-progress value="0.2" type="radial"></core-progress>')
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '20%')
  await page.evaluate(() => (document.querySelector('core-progress').value = 0))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '0%')
  await page.evaluate(() => (document.querySelector('core-progress').value = 1))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '100%')
})

test('updates label from indeterminate value', withPage, async (t, page) => {
  await page.setContent('<core-progress value="Loading..."></core-progress>')
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), 'Loading...')
})

test('calculates percentage from max', withPage, async (t, page) => {
  await page.setContent('<core-progress value="0.5"></core-progress>')
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '50%')
  await page.evaluate(() => (document.querySelector('core-progress').max = 10))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '5%')
  await page.evaluate(() => (document.querySelector('core-progress').max = 100))
  t.is(await page.$eval('core-progress', el => el.getAttribute('aria-label')), '1%')
})

test('does not trigger change event on max', withPage, async (t, page) => {
  await page.setContent('<core-progress></core-progress>')
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('change', reject)
      document.querySelector('core-progress').max = 2
      setTimeout(resolve)
    })
  })
  t.pass()
})

test('triggers change event on value', withPage, async (t, page) => {
  await page.setContent('<core-progress></core-progress>')
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('change', resolve)
      document.querySelector('core-progress').value = 2
    })
  })
  t.pass()
})

test('triggers change event on indeterminate value', withPage, async (t, page) => {
  await page.setContent('<core-progress></core-progress>')
  await page.evaluate(() => {
    return new Promise((resolve, reject) => {
      window.addEventListener('change', resolve)
      document.querySelector('core-progress').value = 'Loading...'
    })
  })
  t.pass()
})
