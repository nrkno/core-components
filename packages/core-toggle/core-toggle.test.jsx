/* global expect, describe, it */

const React = require('react')
const ReactDOM = require('react-dom')
const CoreToggle = require('./jsx')
const { name, version } = require('./package.json')

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
    expect(container.hasAttribute('hidden')).toEqual(true)
    expect(button.hasAttribute('data-haspopup')).toEqual(false)
    expect(button.getAttribute('aria-expanded')).toEqual('false')
    expect(button.getAttribute('aria-controls')).toEqual(container.id)
    expect(container.getAttribute('aria-labelledby')).toEqual(button.id)
  })

  it('should open with open attribute', () => {
    mount({ open: true })
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expect(container.hasAttribute('hidden')).toEqual(false)
    expect(button.getAttribute('aria-expanded')).toEqual('true')
  })

  it('should initialize as popup', () => {
    mount({ popup: 'Tekst' })
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expect(container.hasAttribute('hidden')).toEqual(true)
    expect(button.getAttribute(UUID)).toEqual('Tekst')
    expect(button.getAttribute('aria-expanded')).toEqual('false')
  })

  it('should open popup with open', () => {
    mount({ open: true, popup: 'Tekst' })
    const button = document.querySelector(`[${UUID}]`)
    const container = document.querySelector(`[${UUID}] + *`)
    expect(container.hasAttribute('hidden')).toEqual(false)
    expect(button.getAttribute(UUID)).toEqual('Tekst')
    expect(button.getAttribute('aria-expanded')).toEqual('true')
  })
})
