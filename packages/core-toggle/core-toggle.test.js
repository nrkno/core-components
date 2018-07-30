const coreToggle = require('./core-toggle.min')

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

    const button = document.getElementsByClassName('my-toggle')[0]
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button)

    expect(button.getAttribute('aria-haspopup')).toEqual('false')
    expect(button.getAttribute('aria-expanded')).toEqual('false')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)

    expect(container.hasAttribute('hidden')).toBeTruthy()
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })

  it('should open when calling coreToggle with open attribute set to true', () => {
    document.body.innerHTML = standardHTML

    const button = document.getElementsByClassName('my-toggle')[0]
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { open: true })

    expect(button.getAttribute('aria-haspopup')).toEqual('false')
    expect(button.getAttribute('aria-expanded')).toEqual('true')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)

    expect(container.hasAttribute('hidden')).toBeFalsy()
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })

  it('should close an open container when calling coreToggle with open attribute set to false', () => {
    document.body.innerHTML = standardHTML

    const button = document.getElementsByClassName('my-toggle')[0]
    const container = document.querySelector('.my-toggle + *')

    coreToggle(button, { open: true })
    coreToggle(button, { open: false })

    expect(button.getAttribute('aria-haspopup')).toEqual('false')
    expect(button.getAttribute('aria-expanded')).toEqual('false')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)

    expect(container.hasAttribute('hidden')).toBeTruthy()
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })
})
