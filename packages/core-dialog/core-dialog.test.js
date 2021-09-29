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
        <button data-for="dialog-1">Open</button>
        <core-dialog id="dialog-1" hidden></core-dialog>
      `
    })
    await expect(attr('core-dialog', 'role')).toEqual('dialog')
    await expect(attr('core-dialog', 'aria-modal')).toMatch(/true/i)
  })

  it('opens and closes', async () => {
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
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = false))
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await browser.executeScript(() => (document.querySelector('core-dialog').hidden = true))
    await expect(prop('core-dialog + backdrop', 'hidden')).toMatch(/true/i)
  })

  it('respects deprecated "for" attribute', async () => {
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
  })

  it('opens and closes nested', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog-outer">Open</button>
        <core-dialog id="dialog-outer" hidden>
          <div>Some content</div>
          <button type="button" autofocus>Autofocus</button>
          <button data-for="dialog-inner">Open inner</button>
          <core-dialog id="dialog-inner" hidden>
            <div>Nested content</div>
            <button data-for="close">Close</button>
          </core-dialog>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog-outer"]').click()
    await $('button[data-for="dialog-inner"]').click()
    await expect(prop('#dialog-outer + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#dialog-outer #dialog-inner + backdrop', 'hidden')).toMatch(/(null|false)/i)
    await $('#dialog-inner button[data-for="close"]').click()
    await expect(prop('#dialog-inner', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-inner + backdrop', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#dialog-outer + backdrop', 'hidden')).toMatch(/(null|false)/i)
  })

  it('closes nested with pressed esc', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog-outer">Open</button>
        <core-dialog id="dialog-outer" hidden>
          <div>Some content</div>
          <button type="button" autofocus>Autofocus</button>
          <button data-for="dialog-inner">Open inner</button>
          <core-dialog id="dialog-inner" hidden>
            <div>Nested content</div>
            <button data-for="close">Close</button>
          </core-dialog>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog-outer"]').click()
    await $('button[data-for="dialog-inner"]').click()
    await $('button[data-for="dialog-outer"]').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('#dialog-inner', 'hidden')).toMatch(/true/i)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/(null|false)/i)
    await $('button[data-for="dialog-outer"]').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('#dialog-outer', 'hidden')).toMatch(/true/i)
  })

  it('defaults to backdrop="on" when not supplied', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(await $('backdrop').isPresent()).toEqual(true)
  })

  it('respects explicit backdrop="on"', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" backdrop="on" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(await $('backdrop').isPresent()).toEqual(true)
  })

  it('respects backdrop with no value, defaulting to "on"', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" backdrop hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(await $('backdrop').isPresent()).toEqual(true)
  })

  it('respects backdrop="off"', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" backdrop="off" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('core-dialog', 'nextElementSibling')).toMatch(/(null|false)/i)
    await expect(await $('backdrop').isPresent()).toEqual(false)
  })

  it('respects backdrop with custom id', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" backdrop="back-custom" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
        <div id="back-custom" class="my-backdrop" style="background:rgba(0,0,50,.8)" hidden></div>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('#back-custom', 'hidden')).toMatch(/(null|false)/i)
    await expect(await $('backdrop').isPresent()).toEqual(false)
  })

  it('displays no backdrop and logs warning when custom backdrop is provided and not found', async () => {
    // Use custom console.warn to save what is logged
    await browser.executeScript(() => {
      window.console.warn = function (_, log) {
        window.warning = String(log)
      }
    })
    const missingID = 'wrong-back-custom'
    await browser.executeScript((missingID) => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" backdrop="${missingID}" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
        <div id="back-custom" class="my-backdrop" style="background:rgba(0,0,50,.8)" hidden></div>
      `
    }, missingID)
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    // Neither basic backdrop nor possibly intended sibling are triggered
    await expect(prop('#back-custom', 'hidden')).toEqual('true')
    await expect(await $('backdrop').isPresent()).toEqual(false)
    // Get stored console.warn from protractor browser
    const consoleWarn = await browser.wait(() => browser.executeScript(() => window.warning))
    await expect(consoleWarn).toEqual(`cannot find backdrop element with id: ${missingID}`)
  })

  it('respects strict option', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" strict hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
    })
    await $('button[data-for="dialog"]').click()
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
    await browser.executeScript(() => document.querySelector('core-dialog + backdrop').click())
    await expect(prop('core-dialog', 'hidden')).toMatch(/(null|false)/i)
  })

  it('triggers toggle event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button data-for="dialog">Open</button>
        <core-dialog id="dialog" hidden>
          <button data-for="close">Close</button>
        </core-dialog>
      `
      document.addEventListener('dialog.toggle', () => (window.triggered = true))
      document.querySelector('core-dialog').hidden = false
    })
    await expect(browser.executeScript(() => window.triggered)).toEqual(true)
  })
})
