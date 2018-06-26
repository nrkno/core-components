const coreDialog = require('./core-dialog.min')

describe('core-dialog', () => {
  test('should exists', () => {
    expect(coreDialog).toBeInstanceOf(Function)
  })
})

// TODO Figure way to get JSDOM happy about <dialog> and insertAdjacentElement
const standardHTML = `
<button data-core-dialog="dialog-0">Open dialog 1</button>
<dialog id="dialog-0">
  <button data-core-dialog="close"></button>
  <button data-core-dialog="dialog-1">Open nested dialog 2</button>
  <dialog id="dialog-1">
    <button data-core-dialog="close"></button>
    <button data-core-dialog="dialog-2">Open after dialog 3</button>
  </dialog>
</dialog>
<dialog id="dialog-2">
  <button data-core-dialog="dialog-0">Open dialog 1</button>
  <button data-core-dialog="close"></button>
</dialog>`

function getButton (name) {
  return document.querySelector(`[data-core-dialog="${name}"]`)
}

// https://github.com/jsdom/jsdom/issues/1890
function simplePolyfillInsertAdjacentElement () {
  document.querySelectorAll('*').forEach((el) => {
    el.insertAdjacentElement = (position, element) => {
      const next = el.nextElementSibling
      const wrap = el.parentNode
      return next ? wrap.insertBefore(element, next) : wrap.appendChild(element)
    }
  })
}

describe('core-dialog', () => {
  describe('opening the dialog', () => {
    it('should set the open attribute when doing coreDialog(dialog, true)', () => {
      document.body.innerHTML = standardHTML
      const dialog = document.querySelector('#dialog-0')

      simplePolyfillInsertAdjacentElement()
      coreDialog(dialog, true)
      expect(dialog.hasAttribute('open')).toBeTruthy()
    })
    it('should set the open attribute when doing coreDialog(dialog, {open: true})', () => {
      document.body.innerHTML = standardHTML
      const dialog = document.querySelector('#dialog-0')

      simplePolyfillInsertAdjacentElement()
      coreDialog(dialog, {open: true})
      expect(dialog.hasAttribute('open')).toBeTruthy()
    })
  })
  describe('closing the dialog', () => {
    it('should remove the open attribute when doing core-dialog(dialog, false)', () => {
      document.body.innerHTML = standardHTML
      const dialog = document.querySelector('#dialog-0')

      simplePolyfillInsertAdjacentElement()
      coreDialog(dialog, true)
      expect(dialog.hasAttribute('open')).toBeTruthy()
      coreDialog(dialog, false)
      expect(dialog.hasAttribute('open')).toBeFalsy()
    })
    it('should remove the open attribute when doing core-dialog(dialog, {open: false})', () => {
      document.body.innerHTML = standardHTML
      const dialog = document.querySelector('#dialog-0')

      simplePolyfillInsertAdjacentElement()
      coreDialog(dialog, true)
      expect(dialog.hasAttribute('open')).toBeTruthy()
      coreDialog(dialog, {open: false})
      expect(dialog.hasAttribute('open')).toBeFalsy()
    })
  })

  it('should allow nested dialogs', () => {
    document.body.innerHTML = standardHTML
    const dialogs = Array.from(document.querySelectorAll('dialog'))

    simplePolyfillInsertAdjacentElement()
    coreDialog(dialogs)

    getButton('dialog-0').click()
    getButton('dialog-1').click()
    getButton('dialog-2').click()
    getButton('dialog-0').click()

    expect(dialogs[0].hasAttribute('open')).toBeTruthy()
    expect(dialogs[1].hasAttribute('open')).toBeTruthy()
    expect(dialogs[2].hasAttribute('open')).toBeTruthy()
    expect(parseInt(dialogs[0].style.zIndex, 10)).toBeGreaterThan(parseInt(dialogs[2].style.zIndex, 10))
  })
})
