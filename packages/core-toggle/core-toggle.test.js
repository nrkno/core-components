/* global expect, describe, it */

const coreToggle = require('./core-toggle.min')

const standardHTML = `
<button class="my-toggle">Toggle VanillaJS</button>
<div hidden>Content</div>
`

describe('toggle', () => {
  it('should exists', () => {
    expect(coreToggle).toBeInstanceOf(Function)
  })

  it('should initialize button and container', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')
    coreToggle(button)
    expect(button.hasAttribute('data-haspopup')).toEqual(false)
    expect(button.getAttribute('aria-expanded')).toEqual('false')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)
    expect(container.hasAttribute('hidden')).toEqual(true)
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })

  it('should open with open attribute', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')
    coreToggle(button, { open: true })
    expect(container.hasAttribute('hidden')).toEqual(false)
    expect(button.getAttribute('aria-expanded')).toEqual('true')
  })

  it('should close an opened toggle', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')
    coreToggle(button, { open: true })
    coreToggle(button, { open: false })
    expect(container.hasAttribute('hidden')).toEqual(true)
  })

  it('should initialize as popup', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    coreToggle(button, { popup: 'Test' })
    expect(button.hasAttribute('data-haspopup')).toEqual(true)
  })

  it('should open popup with open', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')
    coreToggle(button, { popup: true, open: true })
    expect(button.hasAttribute('data-haspopup')).toEqual(false)
    expect(container.hasAttribute('hidden')).toEqual(false)
  })

  it('should close popup', () => {
    document.body.innerHTML = standardHTML
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('.my-toggle + *')
    coreToggle(button, { popup: true, open: true })
    coreToggle(button, { popup: true, open: false })
    expect(container.hasAttribute('hidden')).toEqual(true)
  })

  it('should respect existing aria-controls', () => {
    document.body.innerHTML = `
      <div><button class="my-toggle" aria-controls="content">Toggle VanillaJS</button></div>
      <div id="content" hidden>Content</div>`
    const button = document.querySelector('.my-toggle')
    const container = document.querySelector('#content')
    coreToggle(button, { open: false })
    expect(container.hasAttribute('hidden')).toEqual(true)
    coreToggle(button, { open: true })
    expect(container.hasAttribute('hidden')).toEqual(false)
    expect(button.getAttribute('aria-expanded')).toEqual('true')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })
})
