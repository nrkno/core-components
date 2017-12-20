/* globals describe, it, beforeEach, afterEach */
// import {dialog} from '../src/dialog'
import expect from 'expect.js'
import {JSDOM} from 'jsdom'

/* eslint-disable no-unused-expressions */
const DIALOG_ID = 'docs-dialog'

const setupDom = () => {
  const dom = new JSDOM(`<!doctype html><head></head><body>
  <div id="${DIALOG_ID}" class="nrk-dialog" role="dialog" tabindex="-1" aria-modal="true" aria-label="dialog test">
      <h1>Her er en tittel</h1>
      <p>Her er det kanskje litt mer innhold som beskriver et eller annet valg du må ta.</p>
      
      <button>Lukk</button>
      <input type="text" />
      <button>Godta</button>
    </div>
  </body></html>`)
  global.window = dom.window
  global.document = dom.window.document
}

// const teardownDom = () => {
//   delete global.window
//   delete global.document
// }
setupDom()
// @todo: this is stupid. Need to find a better way to ensure that document is defined
// when initializing dialog and adding backdrop
let dialog = require('../src/dialog').dialog

describe('dialog', () => {
  it('should exist', () => {
    expect(dialog).to.be.a('function')
  })

  it('should initialize with accessibility properties when called', () => {
    const element = document.querySelector(`#${DIALOG_ID}`)
    expect(element.getAttribute('role')).to.be.equal('dialog')
    expect(element.getAttribute('tabindex')).to.be.equal('-1')
    expect(element.getAttribute('aria-modal')).to.be.equal('true')
  })

  it('should append a backdrop to the end of the body', () => {
    expect(document.querySelectorAll('.nrk-dialog-backdrop').length).to.equal(1)
  })

  describe('- open', () => {
    let element
    beforeEach(() => {
      element = document.querySelector(`#${DIALOG_ID}`)
    })

    afterEach(() => {
      // @todo: I know, not pretty - but I need to close to reset state
      dialog(`#${DIALOG_ID}`).close()
    })

    it('should set the open attribute on the element', () => {
      dialog(`#${DIALOG_ID}`).open()
      expect(element.hasAttribute('open')).to.be.equal(true)
    })

    it('should remove attribute hidden from backdrop', () => {
      expect(document.querySelectorAll('.nrk-dialog-backdrop')[0].hasAttribute('hidden')).to.equal(true)
      dialog(`#${DIALOG_ID}`).open()
      expect(document.querySelectorAll('.nrk-dialog-backdrop')[0].hasAttribute('hidden')).to.equal(false)
    })
  })

  describe('- close', () => {
    let element
    beforeEach(() => {
      element = document.querySelector(`#${DIALOG_ID}`)
      dialog(`#${DIALOG_ID}`).open()
    })

    it('should remove the open attribute on an element that is opened', () => {
      dialog(`#${DIALOG_ID}`).close()
      expect(element.hasAttribute('open')).to.be.equal(false)
    })

    it('should set the backdrop as hidden', () => {
      dialog(`#${DIALOG_ID}`).close()
      expect(document.querySelectorAll('.nrk-dialog-backdrop')[0].hasAttribute('hidden')).to.equal(true)
    })
  })

  // afterEach(teardownDom)
})

/* eslint-enable no-unused-expressions */
