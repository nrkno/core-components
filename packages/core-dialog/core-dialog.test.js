import fs from 'fs'
import path from 'path'
import { prop, attr } from '../test-utils'

const coreDialog = fs.readFileSync(path.resolve(__dirname, 'core-dialog.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-dialog', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreDialog)
  })

  it('sets up properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="dialog-1">Open</button>
        <core-dialog id="dialog-1" hidden></core-dialog>
      `
    })
    await expect(attr('core-dialog', 'role')).toEqual('dialog')
    await expect(attr('core-dialog', 'aria-modal')).toMatch(/true/i)
  })

  it('opens and closes', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="dialog">Open</button>
        <core-dialog id="dialog" hidden>
          <div>Some content</div>
          <button for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await $('button[for="close"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/true/i)
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/true/i)
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = false))
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = true))
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/true/i)
  })

  it('respects "data-for" attribute', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" hidden>
          <div>Some content</div>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await $('button[data-for="close"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/true/i)
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/true/i)
  })

  it('opens and closes nested', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
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
      `
    })
    await $('button[for="dialog-outer"]').click()
    await $('button[for="dialog-inner"]').click()
    await expect(prop('#dialog-outer + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#dialog-outer #dialog-inner + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await $('#dialog-inner button[for="close"]').click()
    await expect(prop('#dialog-inner', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-inner + backdrop', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#dialog-outer + backdrop', 'hidden')).toMatch(/(null|false)/i)
  })

  it('closes nested with pressed esc', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
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
      `
    })
    await $('button[for="dialog-outer"]').click()
    await $('button[for="dialog-inner"]').click()
    await $('button[for="dialog-outer"]').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('#dialog-inner', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/(null|false)/i)
    await $('button[for="dialog-outer"]').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/true/i)
  })

  it('respects backdrop false option', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="dialog">Open</button>
        <core-dialog id="dialog" backdrop="false" hidden>
          <button for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('core-dialog', 'nextElementSibling')).toMatch(/(null|false)/i)
  })

  it('respects strict option', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="dialog">Open</button>
        <core-dialog id="dialog" strict hidden>
          <button for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await browser.executeScript(() => document.querySelector('core-dialog + backdrop').click())
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
  })

  it('triggers toggle event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button for="dialog">Open</button>
        <core-dialog id="dialog" hidden>
          <button for="close">Close</button>
        </core-dialog>
      `
      document.addEventListener('dialog.toggle', () => (window.triggered = true))
      document.querySelector('core-dialog').hidden = false
    })
    await expect(browser.executeScript(() => window.triggered)).toEqual(true)
  })
})
