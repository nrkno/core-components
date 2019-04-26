/* globals jest */
const React = require('react')
const ReactDOM = require('react-dom')
const Tabs = require('./jsx')

const TabsWithTwoPanels = props => {
  return (
    <Tabs open={props.open} onToggle={props.onToggle}>
      <div>
        <button id='tab-1'>Tab 1</button>
        <a href='#' id='tab-2'>
          Tab 2
        </a>
      </div>
      <div>
        <div id='panel-1'>Panel 1</div>
        <div id='panel-2'>Panel 2</div>
      </div>
    </Tabs>
  )
}

describe('core-tabs/jsx', () => {
  beforeEach(() => {
    cleanUpDOM()
  })

  it('should have default props', () => {
    expect(Tabs.defaultProps.open).toBeNull()
    expect(Tabs.defaultProps.onToggle).toBeNull()
  })

  it('should select first tab as default', () => {
    mount(<TabsWithTwoPanels />)

    expectActiveTab('tab-1')
    expectActivePanel('panel-1')
    expectInactiveTab('tab-2')
    expectInactivePanel('panel-2')
  })

  it('should use prop to select on initial render', () => {
    mount(<TabsWithTwoPanels open={1} />)

    expectInactiveTab('tab-1')
    expectInactivePanel('panel-1')
    expectActiveTab('tab-2')
    expectActivePanel('panel-2')
  })

  it('should be able to handle prop updates', () => {
    mount(<TabsWithTwoPanels />)

    // tab1 is selected by default, but we change it after initial render.
    mount(<TabsWithTwoPanels open={1} />)

    expectInactiveTab('tab-1')
    expectInactivePanel('panel-1')
    expectActiveTab('tab-2')
    expectActivePanel('panel-2')
  })

  it('should able to handle onToggle prop updates', () => {
    const onToggleInitial = jest.fn()
    const onToggleExpected = jest.fn()
    mount(<TabsWithTwoPanels onToggle={onToggleInitial} />)
    mount(<TabsWithTwoPanels onToggle={onToggleExpected} />)

    document.getElementById('tab-2').click()

    expect(onToggleInitial).toHaveBeenCalledTimes(0)
    expect(onToggleExpected).toHaveBeenCalledTimes(1)
  })

  it('should support conditional rendering of panels', () => {
    const shouldDisplayTwo = false

    mount(
      <Tabs>
        <div>
          <button id='tab-1'>Tab 1</button>
          {shouldDisplayTwo && <button id='tab-2'>Tab 2</button>}
        </div>
        <div>
          <div id='panel-1'>Panel 1</div>
          {shouldDisplayTwo && <div id='panel-2'>Panel 2</div>}
        </div>
      </Tabs>
    )

    expect(document.getElementById('panel-2')).toBeNull()
    expect(document.getElementById('tab-2')).toBeNull()

    expect(document.getElementById('panel-1')).not.toBeNull()
    expect(document.getElementById('tab-1')).not.toBeNull()
  })

  it('should have open prop that indexes based on what is rendered - not declared', () => {
    const shouldDisplayTwo = false

    mount(
      <Tabs open={1}>
        <div>
          <button id='tab-1'>Tab 1</button>
          {shouldDisplayTwo && <button id='tab-2'>Tab 2</button>}
          <button id='tab-3'>Tab 3</button>
        </div>
        <div>
          <div id='panel-1'>Panel 1</div>
          {shouldDisplayTwo && <div id='panel-2'>Panel 2</div>}
          <div id='panel-3'>Panel 3</div>
        </div>
      </Tabs>
    )

    expectActiveTab('tab-3')
    expectActivePanel('panel-3')

    expectInactiveTab('tab-1')
    expectInactivePanel('panel-1')
  })
})

const rootElementId = 'mount'

function cleanUpDOM () {
  document.body.innerHTML = `<div id="${rootElementId}"></div>`
}

function mount (component) {
  return ReactDOM.render(component, document.getElementById(rootElementId))
}

function expectActiveTab (tabId) {
  const tab = document.getElementById(tabId)
  expect(tab.getAttribute('aria-selected')).toEqual('true')
}

function expectInactiveTab (tabId) {
  const tab = document.getElementById(tabId)
  expect(tab.getAttribute('aria-selected')).toEqual('false')
}

function expectActivePanel (panelId) {
  const panel = document.getElementById(panelId)
  expect(panel.hasAttribute('hidden')).toBeFalsy()
}

function expectInactivePanel (panelId) {
  const panel = document.getElementById(panelId)
  expect(panel.hasAttribute('hidden')).toBeTruthy()
}
