const { name, version } = require('./package.json')
const coreInput = require('./core-input.min')

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-')
const HTML = `
  <input type="text" placeholder="Type something...">
  <ul hidden>
    <li><button>Chrome</button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
  <button></button>
`

describe('core-input', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())
  })

  afterEach(() => {
    window.requestAnimationFrame.mockRestore()
  })

  it('should exists', () => {
    expect(coreInput).toBeInstanceOf(Function)
  })

  it('should initialize input with props', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    coreInput(input)
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('false')
  })

  it('should expand suggestions when input is clicked', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    const suggestions = document.querySelector('input + ul')
    coreInput(input)
    input.click()
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('true')
    expect(suggestions.hasAttribute('hidden')).toBeFalsy()
  })

  it('should set input value to clicked suggestion', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    const suggestions = document.querySelector('input + ul')
    const firefoxBtn = suggestions.querySelector('li:nth-child(2) button')
    const callback = jest.fn()
    coreInput(input)
    input.addEventListener('input.select', callback)
    input.click()
    firefoxBtn.click()
    expect(callback).toHaveBeenCalled()
    expect(input.value).toEqual('Firefox')
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('false')
    expect(suggestions.hasAttribute('hidden')).toBeTruthy()
  })

  it('should close suggestions on focusing outside', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    const suggestions = document.querySelector('input + ul')
    const button = document.querySelector('button')
    coreInput(input)
    input.click()
    button.click()
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('false')
    expect(suggestions.hasAttribute('hidden')).toBeTruthy()
  })

  it('should filter suggestion from input value', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    const event = new window.CustomEvent('input', { bubbles: true })
    coreInput(input)
    input.value = 'Chrome'
    input.dispatchEvent(event)
    expect(document.querySelectorAll('button[hidden]').length).toEqual(4)
  })

  it('should set type="button" on all buttons in list', () => {
    document.body.innerHTML = HTML
    coreInput(document.querySelector('input'))
    document.querySelectorAll('ul button').forEach((button) => {
      expect(button.type).toEqual('button')
    })
  })

  it('should remember and ovewrite options', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    coreInput(input, { limit: 11, ajax: 'https://example.com/{{value}}' })
    expect(input.getAttribute(`${UUID}-limit`)).toEqual('11')
    coreInput(input, { limit: 12 })
    coreInput(input)
    expect(input.getAttribute(`${UUID}-limit`)).toEqual('12')
    expect(input.getAttribute(UUID)).toEqual('https://example.com/{{value}}')
  })

  it('should correctly parse limit option', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    coreInput(input)
    expect(input.getAttribute(`${UUID}-limit`)).toBe('0')
    coreInput(input, { limit: 2 })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('2')
    coreInput(input, { limit: 0 })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('0')
    coreInput(input, { limit: -2 })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('0')
    coreInput(input, { limit: null })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('0')
    coreInput(input, { limit: undefined })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('0')
    coreInput(input, { limit: 2 })
    coreInput(input, { limit: undefined })
    expect(input.getAttribute(`${UUID}-limit`)).toBe('2')
  })

  it('should limit length of suggestions from limit option', () => {
    document.body.innerHTML = HTML
    const input = document.querySelector('input')
    const suggestions = document.querySelector('input + ul')
    coreInput(input)
    expect(suggestions.children[0].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[1].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[2].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[3].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[4].hasAttribute('hidden')).toBe(false)
    coreInput(input, { limit: 3 })
    expect(suggestions.children[0].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[1].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[2].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[3].hasAttribute('hidden')).toBe(true)
    expect(suggestions.children[4].hasAttribute('hidden')).toBe(true)
    coreInput(input, { limit: undefined })
    expect(suggestions.children[0].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[1].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[2].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[3].hasAttribute('hidden')).toBe(true)
    expect(suggestions.children[4].hasAttribute('hidden')).toBe(true)
    coreInput(input, { limit: 1 })
    expect(suggestions.children[0].hasAttribute('hidden')).toBe(false)
    expect(suggestions.children[1].hasAttribute('hidden')).toBe(true)
    expect(suggestions.children[2].hasAttribute('hidden')).toBe(true)
    expect(suggestions.children[3].hasAttribute('hidden')).toBe(true)
    expect(suggestions.children[4].hasAttribute('hidden')).toBe(true)
  })
})
