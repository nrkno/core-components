const coreToggle = require('./core-toggle.min')

function expectClosedAttributes (button, container) {
  expect(button.getAttribute('aria-expanded')).toEqual('false')
  expect(button.getAttribute('aria-controls')).toEqual(container.id)

  expect(container.hasAttribute('hidden')).toBeTruthy()
  expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
}

function expectOpenAttributes (button, container) {
  expect(button.getAttribute('aria-expanded')).toEqual('true')
  expect(button.getAttribute('aria-controls')).toEqual(container.id)

  expect(container.hasAttribute('hidden')).toBeFalsy()
  expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
}

function expectOpened (button, container) {
  expect(button.getAttribute('data-haspopup')).toEqual('false')
  expectOpenAttributes(button, container)
}

function expectClosed (button, container) {
  expect(button.getAttribute('data-haspopup')).toEqual('false')
  expectClosedAttributes(button, container)
}

function expectPopupOpened (button, container) {
  expect(button.getAttribute('data-haspopup')).toEqual('true')
  expectOpenAttributes(button, container)
}

function expectPopupClosed (button, container) {
  expect(button.getAttribute('data-haspopup')).toEqual('true')
  expectClosedAttributes(button, container)
}

const standardHTML = `
<button class="my-toggle">Toggle VanillaJS</button>
<div hidden>Content</div>
`

describe('toggle', () => {
  it('should exists', () => {
    expect(coreToggle).toBeInstanceOf(Function)
  })

  it('should initialize button and container with props when core-toggle is called', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button)

    expectClosed(button, container)
  })

  it('should open when calling coreToggle with open attribute set to true', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { open: true })

    expectOpened(button, container)
  })

  it('should close an open container when calling coreToggle with open attribute set to false', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { open: true })
    coreToggle(button, { open: false })

    expectClosed(button, container)
  })

  it('should set popup attributes when initialized as a popup', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { popup: true })

    expectPopupClosed(button, container)
  })

  it('should open popup when calling coreToggle with open attribute set to true', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { popup: true, open: true })

    expectPopupOpened(button, container)
  })

  it('should close popup when calling coreToggle with open attribute set to false', () => {
    document.body.innerHTML = standardHTML

    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { popup: true, open: true })
    coreToggle(button, { popup: true, open: false })

    expectPopupClosed(button, container)
  })
})

module.exports = {
  expectOpened,
  expectClosed,
  expectPopupOpened,
  expectPopupClosed
}
