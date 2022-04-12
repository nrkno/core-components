import fs from 'fs'
import path from 'path'
import { prop, attr } from '../test-utils'

const coreSuggest = fs.readFileSync(path.resolve(__dirname, 'core-suggest.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')
const TEST_URL = '/some/cool/url'
const TEST_EMPTY_RESPONSE = '{"results": []}'
const TEST_ERROR_RESPONSE = '{"error": "Go away"}'
const TEST_BAD_JSON_RESPONSE = '{"I am bad JSON"}'

describe('core-suggest', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreSuggest)
  })

  it('sets up properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden></core-suggest>
      `
    })
    await expect(attr('input', 'aria-autocomplete')).toEqual('list')
    await expect(attr('input', 'autocomplete')).toEqual('off')
    await expect(attr('input', 'aria-expanded')).toEqual('false')
  })

  it('opens suggestions on input focus', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden></core-suggest>
      `
    })
    await $('input').click()
    await expect(attr('input', 'aria-expanded')).toMatch(/true/i)
    await expect(prop('core-suggest', 'hidden')).toMatch(/(null|false)/i)
  })

  it('closes suggestions on click outside', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden></core-suggest>
      `
    })
    await $('input').click()
    await expect(prop('core-suggest', 'hidden')).toMatch(/(null|false)/i)
    await $('body').click()
    await expect(prop('core-suggest', 'hidden')).toMatch(/true/i)
  })

  it('sets input value to selected suggestion', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden>
          <ul>
            <li><button id="one">Suggest 1</button></li>
            <li><button id="two">Suggest 2</button></li>
          </ul>
        </core-suggest>
      `
    })
    await $('input').click()
    await $('button#two').click()
    await expect(prop('input', 'value')).toEqual('Suggest 2')
  })

  it('filters suggestions from input value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden>
          <ul>
            <li><button id="one">Suggest 1</button></li>
            <li><button id="two">Suggest 2</button></li>
            <li><button id="three">Suggest 3</button></li>
          </ul>
        </core-suggest>
      `
    })
    await $('input').sendKeys('2')
    await expect(prop('button#one', 'hidden')).toMatch(/true/i)
    await expect(prop('button#two', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#three', 'hidden')).toMatch(/true/i)
  })

  it('sets type="button" on all suggestion buttons', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden>
          <ul>
            <li><button id="one">Suggest 1</button></li>
            <li><button id="two">Suggest 2</button></li>
            <li><button id="three">Suggest 3</button></li>
          </ul>
        </core-suggest>
      `
    })
    await expect(attr('button#one', 'type')).toEqual('button')
    await expect(attr('button#two', 'type')).toEqual('button')
    await expect(attr('button#three', 'type')).toEqual('button')
  })

  it('sets up and parses limit option', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden></core-suggest>
      `
    })
    await expect(prop('core-suggest', 'limit')).toMatch(/inf(inity)?/i)
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = 2))
    await expect(prop('core-suggest', 'limit')).toEqual('2')
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = -2))
    await expect(prop('core-suggest', 'limit')).toMatch(/inf(inity)?/i)
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = null))
    await expect(prop('core-suggest', 'limit')).toMatch(/inf(inity)?/i)
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = undefined))
    await expect(prop('core-suggest', 'limit')).toMatch(/inf(inity)?/i)
  })

  it('filters suggestions from limit option', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest limit="2" hidden>
          <ul>
            <li><button id="one">Suggest 1</button></li>
            <li><button id="two">Suggest 2</button></li>
            <li><button id="three">Suggest 3</button></li>
            <li><button id="four">Suggest 4</button></li>
          </ul>
        </core-suggest>
      `
    })
    await expect(prop('button#one', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#two', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#three', 'hidden')).toMatch(/true/i)
    await expect(prop('button#four', 'hidden')).toMatch(/true/i)
    await browser.executeScript(() => (document.querySelector('core-suggest').limit = 3))
    await $('input').sendKeys('s')
    await expect(prop('button#one', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#two', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#three', 'hidden')).toMatch(/(null|false)/i)
    await expect(prop('button#four', 'hidden')).toMatch(/true/i)
    await expect(prop('button[aria-label="Suggest 4, 4 av 3"]', 'hidden')).toMatch(/true/i)
  })

  it('defaults to highlight -attribute "on", stripping existing and adding new <mark>-tags', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden>
          <ul>
            <li><button id="one">Suggest <mark>1</mark></button></li>
            <li><button id="two">Suggest 2</button></li>
          </ul>
        </core-suggest>
      `
    })
    // <mark>-tags are stripped on render
    await $('input').click()
    await expect(browser.executeScript(() => (document.querySelector('mark')))).toMatch(/null/i)
    // matches are wrapped in <mark>-tags
    await $('input').sendKeys('2')
    await expect(browser.executeScript(() => (document.querySelector('mark').textContent))).toEqual('2')
  })

  it('supports highlight -attribute "keep", keeping existing and not adding new <mark>-tags', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest highlight="keep" hidden>
          <ul>
            <li><button id="one">Suggest <mark>1</mark></button></li>
            <li><button id="two">Suggest 2</button></li>
          </ul>
        </core-suggest>
      `
    })
    // <mark>-tags are stripped on render
    await $('input').click()
    await expect(browser.executeScript(() => (document.querySelector('mark').textContent))).toEqual('1')
    // input-matches are not wrapped in <mark>-tags
    await $('input').sendKeys('2')
    await expect(browser.executeScript(() => (document.querySelector('mark').textContent))).toEqual('1')
  })

  it('supports highlight -attribute "off", stripping existing and not adding new <mark>-tags', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest highlight="off" hidden>
          <ul>
            <li><button id="one">Suggest <mark>1</mark></button></li>
            <li><button id="two">Suggest 2</button></li>
          </ul>
        </core-suggest>
      `
    })
    // <mark>-tags are stripped on render
    await $('input').click()
    await expect(browser.executeScript(() => (document.querySelector('mark')))).toMatch(/null/i)
    // input-matches are not wrapped in <mark>-tags
    await $('input').sendKeys('2')
    await expect(browser.executeScript(() => (document.querySelector('mark')))).toMatch(/null/i)
  })

  it('triggers ajax event on input ', async () => {
    await browser.executeScript((TEST_URL, TEST_EMPTY_RESPONSE) => {
      // Mock XMLHttpRequest to control response and behavior explicitly
      window.XMLHttpRequest = function () { return this }
      window.XMLHttpRequest.prototype = {
        setRequestHeader: Function.prototype,
        abort: Function.prototype,
        open: Function.prototype,
        send: function () {
          this.status = 200
          this.responseText = TEST_EMPTY_RESPONSE
          this.onload()
        }
      }
      document.addEventListener('suggest.ajax', (event) => (window.response = event.detail.responseText))

      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="${TEST_URL}" hidden></core-suggest>
      `
    }, TEST_URL, TEST_EMPTY_RESPONSE)

    await $('input').sendKeys('abc')
    const text = await browser.wait(() => browser.executeScript(() => window.response))
    await expect(text).toEqual(TEST_EMPTY_RESPONSE)
  })

  it('triggers ajax error event on bad url', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="http://foo" hidden></core-suggest>
      `
      document.addEventListener('suggest.ajax.error', (event) => {
        window.responseError = event.detail.responseError
      })
    })
    await $('input').sendKeys('abc')
    const error = await browser.wait(() => browser.executeScript(() => window.responseError))
    await expect(error).toEqual('Error: Network request failed')
  })

  it('triggers ajax error event on bad response status', async () => {
    await browser.executeScript((TEST_URL, TEST_ERROR_RESPONSE) => {
      // Mock XMLHttpRequest to control response and behavior explicitly
      window.XMLHttpRequest = function () { return this }
      window.XMLHttpRequest.prototype = {
        setRequestHeader: Function.prototype,
        abort: Function.prototype,
        open: Function.prototype,
        send: function () {
          this.status = 500
          this.responseText = TEST_ERROR_RESPONSE
          this.onload()
        }
      }
      // listen to suggest.ajax.error for bad response
      document.addEventListener('suggest.ajax.error', (event) => (window.response = event.detail.responseText))

      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="${TEST_URL}" hidden></core-suggest>
      `
    }, TEST_URL, TEST_ERROR_RESPONSE)

    await $('input').sendKeys('abc')
    const text = await browser.wait(() => browser.executeScript(() => window.response))
    await expect(text).toEqual(TEST_ERROR_RESPONSE)
  })

  it('triggers ajax error event on bad json', async () => {
    await browser.executeScript((TEST_URL, TEST_BAD_JSON_RESPONSE) => {
      // Mock XMLHttpRequest to control response and behavior explicitly
      window.XMLHttpRequest = function () { return this }
      window.XMLHttpRequest.prototype = {
        setRequestHeader: Function.prototype,
        abort: Function.prototype,
        open: Function.prototype,
        send: function () {
          this.status = 200
          this.responseText = TEST_BAD_JSON_RESPONSE
          this.onload()
        }
      }
      // Get responseText from suggest.ajax.error
      document.addEventListener('suggest.ajax.error', (event) => (window.response = event.detail.responseText))

      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="${TEST_URL}" hidden></core-suggest>
      `
    }, TEST_URL, TEST_BAD_JSON_RESPONSE)

    await $('input').sendKeys('abc')
    const text = await browser.wait(() => browser.executeScript(() => window.response))
    await expect(text).toEqual(TEST_BAD_JSON_RESPONSE)
  })

  describe('aria-live', () => {
    it('creates an empty span with aria-live="polite"', async () => {
      await browser.executeScript(() => {
        document.body.innerHTML = `
          <input type="text">
          <core-suggest hidden></core-suggest>
        `
      })
      await expect(attr('core-suggest > span', 'aria-live')).toEqual('polite')
    })

    it('exposes internal function _pushToLiveRegion to append, then clear textContent of aria-live region', async () => {
      const testLabel = 'TEST'
      const ARIA_LIVE_DELAY = 150 // Mirror ARIA_LIVE_DELAY of 150 ms
      await browser.executeScript((label) => {
        document.body.innerHTML = `
          <input type="text">
          <core-suggest hidden></core-suggest>
        `
        document.querySelector('core-suggest')._pushToLiveRegion(label)
      }, testLabel)
      await expect(browser.executeScript(() => document.querySelector('core-suggest > span').textContent)).toEqual(testLabel)
      await browser.sleep(ARIA_LIVE_DELAY)
      await expect(browser.executeScript(() => document.querySelector('core-suggest > span').textContent)).toEqual('')
    })

    it('exposes internal function _clearLiveRegion to clear textContent of aria-live region', async () => {
      const testLabel = 'TEST'
      await browser.executeScript((label) => {
        document.body.innerHTML = `
          <input type="text">
          <core-suggest hidden></core-suggest>
        `
        document.querySelector('core-suggest')._pushToLiveRegion(label)
        document.querySelector('core-suggest')._clearLiveRegion()
      }, testLabel)
      await expect(browser.executeScript(() => document.querySelector('core-suggest > span').textContent)).toEqual('')
    })
  })
})
