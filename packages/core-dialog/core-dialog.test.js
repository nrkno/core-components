import fs from 'fs'
import path from 'path'

const coreDialog = fs.readFileSync(path.resolve(__dirname, 'core-dialog.min.js'), 'utf-8')

describe('core-dialog', () => {

  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(coreDialog)
  })

  it('sets up properties', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="dialog-1">Open</button>
      <core-dialog id="dialog-1" hidden></core-dialog>
    `)
    await expect($('core-dialog').getAttribute('role')).toEqual('dialog')
    await expect($('core-dialog').getAttribute('aria-modal')).toEqual('true')
  })

  it('opens and closes', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="dialog">Open</button>
      <core-dialog id="dialog" hidden>
        <div>Some content</div>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await $('button[for="dialog"]').click()
    await expect($('core-dialog').getAttribute('hidden')).toEqual(null)
    await expect($('core-dialog + backdrop').getAttribute('hidden')).toEqual(null)
    await $('button[for="close"]').click()
    await expect($('core-dialog').getAttribute('hidden')).toEqual('true')
    await expect($('core-dialog + backdrop').getAttribute('hidden')).toEqual('true')
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = false))
    await expect($('core-dialog + backdrop').getAttribute('hidden')).toEqual(null)
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = true))
    await expect($('core-dialog + backdrop').getAttribute('hidden')).toEqual('true')
  })

  it('opens and closes nested', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
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
    await $('button[for="dialog-outer"]').click()
    await $('button[for="dialog-inner"]').click()
    await expect($('#dialog-outer + backdrop').getAttribute('hidden')).toEqual(null)
    await expect($('#dialog-outer #dialog-inner + backdrop').getAttribute('hidden')).toEqual(null)
    await $('#dialog-inner button[for="close"]').click()
    await expect($('#dialog-inner').getAttribute('hidden')).toEqual('true')
    await expect($('#dialog-inner + backdrop').getAttribute('hidden')).toEqual('true')
    await expect($('#dialog-outer').getAttribute('hidden')).toEqual(null)
    await expect($('#dialog-outer + backdrop').getAttribute('hidden')).toEqual(null)
  })

  it('closes nested with esc', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
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
    await $('button[for="dialog-outer"]').click()
    await $('button[for="dialog-inner"]').click()
    await $('body').sendKeys(protractor.Key.ESCAPE)
    await expect($('#dialog-inner').getAttribute('hidden')).toEqual('true')
    await expect($('#dialog-outer').getAttribute('hidden')).toEqual(null)
    await $('body').sendKeys(protractor.Key.ESCAPE)
    await expect($('#dialog-outer').getAttribute('hidden')).toEqual('true')
  })

  it('respects backdrop false option', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="dialog">Open</button>
      <core-dialog id="dialog" backdrop="false" hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await $('button[for="dialog"]').click()
    await expect($('core-dialog').getAttribute('hidden')).toEqual(null)
    await expect(browser.executeScript(() => Boolean(document.querySelector('core-dialog').nextElementSibling))).toEqual(false)
  })

  it('respects strict option', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="dialog">Open</button>
      <core-dialog id="dialog" strict hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await $('button[for="dialog"]').click()
    await expect($('core-dialog').getAttribute('hidden')).toEqual(null)
    await browser.executeScript(() => document.querySelector('core-dialog + backdrop').click())
    await expect($('core-dialog').getAttribute('hidden')).toEqual(null)
  })

  it('triggers toggle event', async () => {
    await browser.executeScript((html) => (document.body.innerHTML = html), `
      <button for="dialog">Open</button>
      <core-dialog id="dialog" hidden>
        <button for="close">Close</button>
      </core-dialog>
    `)
    await browser.executeScript(() => {
      document.addEventListener('dialog.toggle', () => (document.body.appendChild(document.createElement('i'))))
      document.querySelector('core-dialog').hidden = false
    })
    await expect(browser.isElementPresent($('i'))).toBe(true)
  })
})
