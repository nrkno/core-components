const React = require('react')
const ReactDOM = require('react-dom')
const Tabs = require('./jsx')

const expectActiveTab = (tab) => {
  expect(tab.getAttribute('aria-selected')).toEqual('true')
}
const expectInactiveTab = (tab) => {
  expect(tab.getAttribute('aria-selected')).toEqual('false')
}
const expectActivePanel = (panel) => {
  expect(panel.hasAttribute('hidden')).toBeFalsy()
}
const expectInactivePanel = (panel) => {
  expect(panel.hasAttribute('hidden')).toBeTruthy()
}

const mount = (props = {}, keepInstance) => {
  if (!keepInstance) {
    document.body.innerHTML = '<div id="mount"></div>'
  }
  const mount = document.getElementById('mount')
  return ReactDOM.render(
    <Tabs open={props.open} onToggle={props.onToggle}>
      <div>
        <button id='tab-1'>Tab 1</button>
        <a href='#' id='tab-2'>Tab 2</a>
      </div>
      <div>
        <div id='panel-1'>Panel 1</div>
        <div id='panel-2'>Panel 2</div>
      </div>
    </Tabs>, mount)
}

describe('core-tabs/jsx', () => {
  it('should have default props', () => {
    const wrapper = mount()

    expect(wrapper.props.open).toBeNull()
    expect(wrapper.props.onToggle).toBeNull()
  })

  it('should select first tab as default', () => {
    mount()

    expectActiveTab(document.getElementById('tab-1'))
    expectActivePanel(document.getElementById('panel-1'))
    expectInactiveTab(document.getElementById('tab-2'))
    expectInactivePanel(document.getElementById('panel-2'))
  })

  it('should use prop to select on initial render', () => {
    mount({open: 1})

    expectInactiveTab(document.getElementById('tab-1'))
    expectInactivePanel(document.getElementById('panel-1'))
    expectActiveTab(document.getElementById('tab-2'))
    expectActivePanel(document.getElementById('panel-2'))
  })

  it('should be able to handle prop updates', () => {
    mount()

    // tab1 is selected by default, but we change it after initial render.
    mount({open: 1}, true)

    expectInactiveTab(document.getElementById('tab-1'))
    expectInactivePanel(document.getElementById('panel-1'))
    expectActiveTab(document.getElementById('tab-2'))
    expectActivePanel(document.getElementById('panel-2'))
  })
})
