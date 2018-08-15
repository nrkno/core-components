const React = require('react')
const ReactDOM = require('react-dom')
const CoreToggle = require('./jsx')
const {name, version} = require('./package.json')
const {expectOpened, expectClosed, expectPopupOpened, expectPopupClosed} = require('./core-toggle.test.js')

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-')
const mount = (props = {}, keepInstance) => {
  if (!keepInstance) {
    document.body.innerHTML = '<div id="mount"></div>'
  }
  const mount = document.getElementById('mount')
  return ReactDOM.render(
    <CoreToggle open={props.open} popup={props.popup}>
      <button>Use with JSX</button>
      <div>Some content</div>
    </CoreToggle>, mount)
}

describe('core-toggle/jsx', () => {
  it('should have default props', () => {
    const wrapper = mount()
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)

    expect(wrapper.props.open).toBeNull()
    expect(wrapper.props.popup).toBeNull()
    expectClosed(button, container)
  })

  it('should show content when open prop is set to true', () => {
    mount({open: true})
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expectOpened(button, container)
  })

  it('should initialize as popup when popup prop is set to true', () => {
    mount({popup: true})
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expectPopupClosed(button, container)
  })

  it('should open as a popup when popup and open prop is set to true', () => {
    mount({open: true, popup: true})
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expectPopupOpened(button, container)
  })
})
