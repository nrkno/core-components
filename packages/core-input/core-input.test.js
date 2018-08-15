const coreInput = require('./core-input.min')

function expectOpenedState (input, suggestions) {
  expect(input.getAttribute('role')).toEqual('combobox')
  expect(input.getAttribute('aria-autocomplete')).toEqual('list')
  expect(input.getAttribute('autocomplete')).toEqual('off')
  expect(input.getAttribute('aria-expanded')).toEqual('true')
  expect(suggestions.hasAttribute('hidden')).toBeFalsy()
}

function expectClosedState (input, suggestions) {
  expect(input.getAttribute('role')).toEqual('combobox')
  expect(input.getAttribute('aria-autocomplete')).toEqual('list')
  expect(input.getAttribute('autocomplete')).toEqual('off')
  expect(input.getAttribute('aria-expanded')).toEqual('false')
  expect(suggestions.hasAttribute('hidden')).toBeTruthy()
}

const standardHTML = `
<input type="text" class="my-input" placeholder="Type something...">
<ul hidden>
  <li><button>Chrome</button></li>
  <li><button>Firefox</button></li>
  <li><button>Opera</button></li>
  <li><button>Safari</button></li>
  <li><button>Microsoft Edge</button></li>
</ul>
<button id="something-else" type="button"></button>
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

  it('should initialize input with props when core-input is called', () => {
    document.body.innerHTML = standardHTML

    const input = document.querySelector('.my-input')

    coreInput(input)
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('false')
  })

  it('should expand suggestions when input field is clicked', () => {
    document.body.innerHTML = standardHTML

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')

    coreInput(input)

    input.click()
    expectOpenedState(input, suggestions)
  })

  it('should set input value to that of clicked suggestion', () => {
    document.body.innerHTML = standardHTML

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')
    const firefoxBtn = suggestions.querySelector('li:nth-child(2) button')
    const callback = jest.fn()

    coreInput(input)

    input.addEventListener('input.select', callback)
    input.click()
    firefoxBtn.click()

    expect(callback).toHaveBeenCalled()
    expect(input.value).toEqual('Firefox')
    expectClosedState(input, suggestions)
  })

  it('should close suggestions if focus is placed outside on elements outside list/input', () => {
    document.body.innerHTML = standardHTML

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')
    const someOtherBtn = document.querySelector('#something-else')

    coreInput(input)

    input.click()
    someOtherBtn.click()

    expectClosedState(input, suggestions)
  })

  it('should filter suggestion list according to value in input', () => {
    document.body.innerHTML = standardHTML

    const input = document.querySelector('.my-input')
    const event = new window.CustomEvent('input', { bubbles: true })

    coreInput(input)

    input.value = 'Chrome'
    input.dispatchEvent(event)

    expect(document.querySelectorAll('button[hidden]').length).toEqual(4)
  })

  it('should set type="button" on all buttons in list', () => {
    document.body.innerHTML = standardHTML

    coreInput(document.querySelector('.my-input'))
    document.querySelectorAll('ul button').forEach((button) => {
      expect(button.type).toEqual('button')
    })
  })
})

module.exports = {
  expectOpenedState,
  expectClosedState
}
