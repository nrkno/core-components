import React from 'react'
import {mount} from 'enzyme'

import Tabs from './core-tabs.jsx'

const expectActiveTab = tab => {
  expect(tab.getAttribute('aria-selected')).toEqual('true')
}
const expectInactiveTab = tab => {
  expect(tab.getAttribute('aria-selected')).toEqual('false')
}
const expectActivePanel = panel => {
  expect(panel.hasAttribute('hidden')).toBeFalsy()
}
const expectInactivePanel = panel => {
  expect(panel.hasAttribute('hidden')).toBeTruthy()
}

describe('core-tabs/jsx', () => {
  it('should have default props', () => {
    const wrapper = mount(
      <Tabs>
        <div>
          <button>Tab 1</button>
          <a href='#'>Tab 2</a>
        </div>
        <div>
          <div>Panel 1</div>
          <div>Panel 2</div>
        </div>
      </Tabs>
    )
    expect(wrapper.props().open).toBeNull()
    expect(wrapper.props().onToggle).toBeNull()
  })
  it('should select first tab as default', () => {
    let tab1 = null
    let panel1 = null
    let tab2 = null
    let panel2 = null

    mount(
      <Tabs>
        <div>
          <button ref={ref => (tab1 = ref)}>Tab 1</button>
          <a href='#' ref={ref => (tab2 = ref)}>
            Tab 2
          </a>
        </div>
        <div>
          <div ref={ref => (panel1 = ref)}>Panel 1</div>
          <div ref={ref => (panel2 = ref)}>Panel 1</div>
        </div>
      </Tabs>
    )

    expectActiveTab(tab1)
    expectActivePanel(panel1)

    expectInactiveTab(tab2)
    expectInactivePanel(panel2)
  })
  it('should use prop to select on initial render', () => {
    let tab1 = null
    let panel1 = null
    let tab2 = null
    let panel2 = null

    mount(
      <Tabs open={1}>
        <div>
          <button ref={ref => (tab1 = ref)}>Tab 1</button>
          <a href='#' ref={ref => (tab2 = ref)}>
            Tab 2
          </a>
        </div>
        <div>
          <div ref={ref => (panel1 = ref)}>Panel 1</div>
          <div ref={ref => (panel2 = ref)}>Panel 1</div>
        </div>
      </Tabs>
    )
    expectInactiveTab(tab1)
    expectInactivePanel(panel1)
    expectActiveTab(tab2)
    expectActivePanel(panel2)
  })
  it('should be able to handle prop updates', () => {
    let tab1 = null
    let panel1 = null

    let tab2 = null
    let panel2 = null

    const wrapper = mount(
      <Tabs>
        <div>
          <button ref={ref => (tab1 = ref)}>Tab 1</button>
          <a href='#' ref={ref => (tab2 = ref)}>
            Tab 2
          </a>
        </div>
        <div>
          <div ref={ref => (panel1 = ref)}>Panel 1</div>
          <div ref={ref => (panel2 = ref)}>Panel 1</div>
        </div>
      </Tabs>
    )

    // tab1 is selected by default, but we change it after initial render.
    wrapper.setProps({ open: 1 })

    expectInactiveTab(tab1)
    expectInactivePanel(panel1)
    expectActiveTab(tab2)
    expectActivePanel(panel2)
  })
})
