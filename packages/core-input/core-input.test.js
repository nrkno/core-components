const coreInput = require('./core-input.min')

const standardHTML = `
<input type="text" class="my-input" placeholder="Type something...">
<ul hidden>
  <li><button>Chrome</button></li>
  <li><button>Firefox</button></li>
  <li><button>Opera</button></li>
  <li><button>Safari</button></li>
  <li><button>Microsoft Edge</button></li>
</ul>
`

describe('core-input', () => {
  it('should exists', () => {
    expect(coreInput).toBeInstanceOf(Function)
  })

  it('should initialize input with props when core-input is called', () => {
    document.body.innerHTML = standardHTML

    const input = document.getElementsByClassName('my-input')[0]

    coreInput(input)
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('false')
  })

  it('should expand suggestions when input field is clicked', () => {
    document.body.innerHTML = standardHTML

    const input = document.getElementsByClassName('my-input')[0]
    const suggestions = document.querySelector('.my-input + ul')

    coreInput(input)

    input.click()
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('true')
    expect(suggestions.hasAttribute('hidden')).toBeFalsy()
  })

  it.skip('should set input value to that of clicked suggestion', () => {
    document.body.innerHTML = standardHTML

    const input = document.getElementsByClassName('my-input')[0]
    const suggestions = document.querySelector('.my-input + ul')
    const firefoxBtn = suggestions.querySelector('li:nth-child(2) button')
    const callback = jest.fn()

    coreInput(input)

    input.addEventListener('input.select', callback)
    input.click()
    firefoxBtn.click()

    expect(callback).toHaveBeenCalled()
    // expect(input.value).toEqual('Firefox')
    expect(input.getAttribute('role')).toEqual('combobox')
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('autocomplete')).toEqual('off')
    expect(input.getAttribute('aria-expanded')).toEqual('true')
    expect(suggestions.hasAttribute('hidden')).toBeFalsy()
  })
})
