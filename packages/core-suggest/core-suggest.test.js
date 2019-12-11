import fs from 'fs'
import path from 'path'
import http from 'http'
import { prop, attr } from '../test-utils'

const coreSuggest = fs.readFileSync(path.resolve(__dirname, 'core-suggest.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')
const HTTP_HEADERS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Requested-With' }

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

  it('emits expanded event when expanded', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest hidden></core-suggest>
      `
    })
    let expanded = false
    const expandedCallback = (event) => { expanded = event.detail.expanded }

    await browser.executeScript(() => (document.querySelector('core-suggest').addEventListener('suggest.expanded', expandedCallback)))
    await $('input').click()
    await expect(expanded).toMatch(/true/i)
    await $('body').click()
    await expect(expanded).toMatch(/false/i)
  })

  it('triggers ajax event on input ', async () => {
    const server = http.createServer((request, response) => {
      response.writeHead(200, HTTP_HEADERS)
      response.end('{"results": []}')
    })
    const listener = server.listen()
    await browser.executeScript((port) => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="http://bs-local.com:${port}" hidden></core-suggest>
      `
      document.addEventListener('suggest.ajax', (event) => (window.responseText = event.detail.responseText))
    }, listener.address().port)
    await $('input').sendKeys('abc')
    const text = await browser.wait(() => browser.executeScript(() => window.responseText))
    await expect(text).toEqual('{"results": []}')
    server.close()
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
    const server = http.createServer((request, response) => {
      if (request.method === 'OPTIONS') response.writeHead(200, HTTP_HEADERS)
      else response.writeHead(500, HTTP_HEADERS)
      response.end('')
    })
    const listener = server.listen()
    await browser.executeScript((port) => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="http://bs-local.com:${port}" hidden></core-suggest>
      `
      document.addEventListener('suggest.ajax.error', (event) => {
        window.ajaxCode = String(event.detail.status)
      })
    }, listener.address().port)
    await $('input').sendKeys('abc')
    const status = await browser.wait(() => browser.executeScript(() => window.ajaxCode))
    await expect(status).toEqual('500')
    server.close()
  })

  it('triggers ajax error event on bad json', async () => {
    const server = http.createServer((req, response) => {
      response.writeHead(200, HTTP_HEADERS)
      response.end('{"boom"!}')
    })
    const listener = server.listen()
    await browser.executeScript((port) => {
      document.body.innerHTML = `
        <input type="text">
        <core-suggest ajax="http://bs-local.com:${port}" hidden></core-suggest>
      `
      document.addEventListener('suggest.ajax.error', (event) => {
        window.responseError = event.detail.responseError
      })
    }, listener.address().port)
    await $('input').sendKeys('abc')
    const error = await browser.wait(() => browser.executeScript(() => window.responseError))
    await expect(error.match(/^SyntaxError/)).toBeTruthy()
    server.close()
  })
})
