import fs from 'fs'
import path from 'path'
import { prop, attr } from '../test-utils'

const coreToggle = fs.readFileSync(path.resolve(__dirname, 'core-toggle.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-toggle', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreToggle)
  })

  it('sets up all properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await expect(attr('button', 'aria-expanded')).toMatch(/null|false/)
    const toggleId = await attr('core-toggle', 'id')
    await expect(attr('button', 'aria-controls')).toEqual(toggleId)
    await expect(prop('core-toggle', 'hidden')).toMatch(/true/i)
    await expect(prop('core-toggle', 'autoposition')).toMatch(/false/i)
    const buttonId = await attr('button', 'id')
    await expect(attr('core-toggle', 'aria-labelledby')).toEqual(buttonId)
  })

  it('opens and closes toggle', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await $('button').click()
    await expect(attr('button', 'aria-expanded')).toMatch(/true/i)
    await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
    await $('button').click()
    await expect(attr('button', 'aria-expanded')).toEqual('false')
    await expect(prop('core-toggle', 'hidden')).toMatch(/true/i)
  })

  it('opens and closes nested toggle', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button id="outer">Toggle outer</button>
        <core-toggle hidden>
          <button id="inner">Toggle inner</button>
          <core-toggle hidden>
            <div>Inner content</div>
          </core-toggle>
        </core-toggle>
      `
    })
    await $('button#outer').click()
    await $('button#inner').click()
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await $('button#inner').click()
    await expect(prop('button#inner + core-toggle', 'hidden')).toMatch(/true/i)
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await $('button#outer').click()
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/true/i)
  })

  it('closes nested toggle with esc', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button id="outer">Toggle outer</button>
        <core-toggle hidden>
          <button id="inner">Toggle inner</button>
          <core-toggle hidden>
            <div>Inner content</div>
          </core-toggle>
        </core-toggle>
      `
    })
    await $('button#outer').click()
    await $('button#inner').click()
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await $('button#inner').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('button#inner + core-toggle', 'hidden')).toMatch(/true/i)
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/false/i)
    await $('button#inner').sendKeys(protractor.Key.ESCAPE)
    await expect(prop('button#outer + core-toggle', 'hidden')).toMatch(/true/i)
  })

  describe('data-for attribute', () => {
    it('respects deprecated "for" attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <div><button for="content">Toggle</button></div>
          <core-toggle id="content" hidden></core-toggle>
        `
      })
      const toggleId = await attr('core-toggle', 'id')
      await $('button').click()
      await expect(attr('button', 'for')).toEqual(toggleId)
      await expect(attr('button', 'aria-controls')).toEqual(toggleId)
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
    })

    it('respects "data-for" attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <div><button data-for="content">Toggle</button></div>
          <core-toggle id="content" hidden></core-toggle>
        `
      })
      const toggleId = await attr('core-toggle', 'id')
      await $('button').click()
      await expect(attr('button', 'data-for')).toEqual(toggleId)
      await expect(attr('button', 'aria-controls')).toEqual(toggleId)
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
    })
  })
  describe('data-popup attribute', () => {
    it('closes open toggle on click outside, when data-popup attribute is present', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <button>Toggle</button>
          <core-toggle data-popup hidden></core-toggle>
        `
      })
      await $('button').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
      await $('body').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/true/i)
    })
    it('will not close open toggle on click outside, without data-popup attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <button>Toggle</button>
          <core-toggle hidden></core-toggle>
        `
      })
      await $('button').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
      await $('body').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
    })
    it('respects deprecated popup attribute', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <button>Toggle</button>
          <core-toggle popup hidden></core-toggle>
        `
      })
      await $('button').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/false/i)
      await $('body').click()
      await expect(prop('core-toggle', 'hidden')).toMatch(/true/i)
    })

    it('respects exisiting aria-label with data-popup attribute and value', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <button aria-label="Label">Toggle</button>
          <core-toggle data-popup="Another label" hidden></core-toggle>
        `
      })
      await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
      const toggleValue = await prop('core-toggle', 'value')
      await expect(prop('button', 'textContent')).toEqual(toggleValue)
      await expect(attr('button', 'aria-label')).toEqual('Label')
    })

    it('sets aria-label with data-popup attr and value', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <button>Toggle</button>
          <core-toggle data-popup="Some label" hidden></core-toggle>
        `
      })
      await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
      const toggleValue = await prop('core-toggle', 'value')
      await expect(prop('button', 'textContent')).toEqual(toggleValue)
      await expect(attr('button', 'aria-label')).toEqual('Button text,Some label')
    })
  })

  it('sets aria-label with data-popup prop and value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
    })
    await browser.executeScript(() => (document.querySelector('core-toggle').popup = 'Some label'))
    await browser.executeScript(() => (document.querySelector('core-toggle').value = 'Button text'))
    const toggleValue = await prop('core-toggle', 'value')
    await expect(prop('button', 'textContent')).toEqual(toggleValue)
    await expect(attr('button', 'aria-label')).toEqual('Button text,Some label')
  })

  it('triggers toggle event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle hidden></core-toggle>
      `
      document.addEventListener('toggle', () => (window.triggered = true))
      document.querySelector('core-toggle').hidden = false
    })
    const triggered = await browser.executeScript(() => window.triggered)
    await expect(triggered).toEqual(true)
  })

  it('triggers select event', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button id="toggleBtn">Toggle</button>
        <core-toggle hidden>
          <button id="my-item">Select me</button>
        </core-toggle>
      `
    })
    await browser.executeScript(() => {
      document.addEventListener('toggle.select', (event) => (window.itemId = event.detail.id))
    })
    await $('#toggleBtn').click()
    await $('#my-item').click()
    const itemId = await browser.wait(() => browser.executeScript(() => window.itemId))
    await expect(itemId).toEqual('my-item')
  })

  it('supports attribute autoposition', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <button>Toggle</button>
        <core-toggle autoposition hidden></core-toggle>
      `
    })
    await expect(prop('core-toggle', 'autoposition')).toMatch(/true/i)
    await $('button').click()
    await expect($('core-toggle').getCssValue('position')).toEqual('fixed')
  })

  it('updates aria-label on select when event value is set to event detail', async () => {
    const toggleButtonLabel = 'Toggle'
    const popupLabel = 'Choose wisely'
    const itemButtonLabel = 'Select me'
    await browser.executeScript((toggleButtonLabel, popupLabel, itemButtonLabel) => {
      document.body.innerHTML = `
        <button id="toggleBtn">${toggleButtonLabel}</button>
        <core-toggle hidden data-popup="${popupLabel}">
          <button id="my-item">${itemButtonLabel}</button>
        </core-toggle>
      `
      document.addEventListener('toggle.select', (event) => (event.target.value = event.detail))
    }, toggleButtonLabel, popupLabel, itemButtonLabel)
    await browser.wait(ExpectedConditions.presenceOf($(`#toggleBtn[aria-label="${toggleButtonLabel},${popupLabel}"]`)))
    await $('#toggleBtn').click()
    await $('#my-item').click()

    // aria-label always ends with data-popup-attribute
    await expect(attr('#toggleBtn', 'aria-label')).toEqual(`${itemButtonLabel},${popupLabel}`)
  })
})
