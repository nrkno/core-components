const React = require('react')
const ReactDOM = require('react-dom')
const CoreInput = require('./jsx')
const {expectOpenedState, expectClosedState} = require('./core-input.test.js')

const mount = (props = {}, keepInstance) => {
  if (!keepInstance) {
    document.body.innerHTML = '<div id="mount"></div>'
  }
  const mount = document.getElementById('mount')
  return ReactDOM.render(
    <CoreInput
      onFilter={props.onFilter}
      onSelect={props.onSelect}
      onAjax={props.onAjax}
      ajax={props.ajax}
      open={props.open}
    >
      <input className='my-input' type='text' placeholder='Type "C"... (JSX)' />
      <ul className='my-dropdown'>
        <li><button>Chrome</button></li>
        <li><button>Firefox</button></li>
        <li><button>Opera</button></li>
        <li><button>Safari</button></li>
        <li><button>Microsoft Edge</button></li>
      </ul>
    </CoreInput>, mount)
}

describe('core-input/jsx', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())
  })

  afterEach(() => {
    window.requestAnimationFrame.mockRestore()
  })

  it('should have default props', () => {
    const wrapper = mount()

    expect(wrapper.props.open).toBeNull()
    expect(wrapper.props.ajax).toBeNull()
    expect(wrapper.props.onFilter).toBeNull()
    expect(wrapper.props.onSelect).toBeNull()
    expect(wrapper.props.onAjax).toBeNull()
  })

  it('should expand suggestions when input field is clicked', () => {
    mount()

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')

    input.click()
    expectOpenedState(input, suggestions)
  })

  it('should set input value to that of clicked suggestion', () => {
    const callback = jest.fn()
    mount({onSelect: callback})

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')
    const firefoxBtn = suggestions.querySelector('li:nth-child(2) button')

    input.click()
    firefoxBtn.click()

    expect(callback).toHaveBeenCalled()
    expect(input.value).toEqual('Firefox')
    expectClosedState(input, suggestions)
  })

  it('should close suggestions if focus is placed outside on elements outside list/input', () => {
    mount()

    const input = document.querySelector('.my-input')
    const suggestions = document.querySelector('.my-input + ul')

    input.click()
    document.body.click()

    expectClosedState(input, suggestions)
  })

  it('should filter suggestion list according to value in input', () => {
    mount()

    const input = document.querySelector('.my-input')
    const event = new window.CustomEvent('input', { bubbles: true })

    input.value = 'Chrome'
    input.dispatchEvent(event)

    expect(document.querySelectorAll('button[hidden]').length).toEqual(4)
  })

  it('should set type="button" on all buttons in list', () => {
    mount()

    document.querySelectorAll('ul button').forEach((button) => {
      expect(button.type).toEqual('button')
    })
  })
})
