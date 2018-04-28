import coreTabs, { setPanelAttributes, setTabAttributes } from './core-tabs'

function expectActiveTab (tab, { controls }) {
  expect(tab.getAttribute('aria-controls')).toEqual(controls)
  expect(tab.getAttribute('aria-controls')).toBeTruthy()
  expect(tab.getAttribute('role')).toEqual('tab')
  expect(tab.getAttribute('tabindex')).toEqual('0')
  expect(tab.getAttribute('aria-selected')).toEqual('true')
}

function expectInactiveTab (tab, { controls }) {
  expect(tab.getAttribute('aria-controls')).toEqual(controls)
  expect(tab.getAttribute('aria-controls')).toBeTruthy()
  expect(tab.getAttribute('role')).toEqual('tab')
  expect(tab.getAttribute('tabindex')).toEqual('-1')
  expect(tab.getAttribute('aria-selected')).toEqual('false')
}

function expectActivePanel (panel, { labelledby }) {
  expect(panel.getAttribute('aria-labelledby')).toEqual(labelledby)
  expect(panel.getAttribute('aria-labelledby')).toBeTruthy()
  expect(panel.getAttribute('role')).toEqual('tabpanel')
  expect(panel.getAttribute('tabindex')).toEqual('0')
  expect(panel.hasAttribute('hidden')).toBeFalsy()
}

function expectInactivePanel (panel, { labelledby }) {
  expect(panel.getAttribute('aria-labelledby')).toEqual(labelledby)
  expect(panel.getAttribute('aria-labelledby')).toBeTruthy()
  expect(panel.getAttribute('role')).toEqual('tabpanel')
  expect(panel.getAttribute('tabindex')).toEqual('0')
  expect(panel.hasAttribute('hidden')).toBeTruthy()
}
const standardHTML = `
<div class="my-tabs">
  <button>Button tab 1</button>
  <a>Button tab 2</a>
</div>
<!-- Next element children will become panels of correlating tab -->
<div>
  <article>Text of tab 1</article>
  <section>Text of tab 2</section>
</div>`

const standardHTMLWithIDs = `
<div id="tabs">
  <button id="tab-1" aria-controls="panel-1">Button tab 1</button>
  <button id="tab-2" aria-controls="panel-2">Button tab 2</button>
</div>
<!-- Next element children will become panels of correlating tab -->
<div id="panels">
  <div id="panel-1">Text of tab 1</div>
  <div id="panel-2">Text of tab 2</div>
</div>`

describe('core-tabs', () => {
  it('can init on standard HTML', () => {
    document.body.innerHTML = standardHTML

    coreTabs('.my-tabs')

    const tablist = document.querySelector('.my-tabs')
    const tab1 = document.querySelector('button')
    const tab2 = document.querySelector('a')
    const panel1 = document.querySelector('article')
    const panel2 = document.querySelector('section')

    expect(tablist.getAttribute('role')).toEqual('tablist')

    expectActiveTab(tab1, { controls: panel1.id })
    expectActivePanel(panel1, { labelledby: tab1.id })

    expectInactiveTab(tab2, { controls: panel2.id })
    expectInactivePanel(panel2, { labelledby: tab2.id })
  })
  it('can init on standard HTML with ids, reverse ordered panels', () => {
    document.body.innerHTML = `
    <div id="tabs">
      <button id="tab-1" aria-controls="panel-1">Button tab 1</button>
      <button id="tab-2" aria-controls="panel-2">Button tab 2</button>
    </div>
    <!-- Next element children will become panels of correlating tab -->
    <div id="panels">
      <div id="panel-2">Text of tab 2</div>
      <div id="panel-1">Text of tab 1</div>
    </div>`

    coreTabs('#tabs')

    const tablist = document.querySelector('#tabs')
    const tab1 = document.querySelector('#tab-1')
    const tab2 = document.querySelector('#tab-2')
    const panel1 = document.querySelector('#panel-1')
    const panel2 = document.querySelector('#panel-2')

    expect(tablist.getAttribute('role')).toEqual('tablist')

    expectActiveTab(tab1, { controls: panel1.id })
    expectActivePanel(panel1, { labelledby: tab1.id })

    expectInactiveTab(tab2, { controls: panel2.id })
    expectInactivePanel(panel2, { labelledby: tab2.id })
  })
  it('can init with active tab index', () => {
    document.body.innerHTML = standardHTML

    coreTabs('.my-tabs', 1)

    const tab1 = document.querySelector('button')
    const tab2 = document.querySelector('a')
    const panel1 = document.querySelector('article')
    const panel2 = document.querySelector('section')

    expectInactiveTab(tab1, { controls: panel1.id })
    expectInactivePanel(panel1, { labelledby: tab1.id })
    expectActiveTab(tab2, { controls: panel2.id })
    expectActivePanel(panel2, { labelledby: tab2.id })
  })
  it('can init with active tab element', () => {
    document.body.innerHTML = standardHTML

    const tab1 = document.querySelector('button')
    const tab2 = document.querySelector('a')

    coreTabs('.my-tabs', tab2)

    const panel1 = document.querySelector('article')
    const panel2 = document.querySelector('section')

    expectInactiveTab(tab1, { controls: panel1.id })
    expectInactivePanel(panel1, { labelledby: tab1.id })
    expectActiveTab(tab2, { controls: panel2.id })
    expectActivePanel(panel2, { labelledby: tab2.id })
  })
  it('can init on html without panels as nextElementSibling. panels found by aria-controls', () => {
    document.body.innerHTML = `
    <div>
      <div id="my-tabs">
        <button aria-controls="panel-1">Button tab</button>
        <button aria-controls="panel-2">Button tab</button>
      </div>
    </div>
    <!--
      Putting tabs somewhere else in the DOM.

      NB! there must not be any semantic content between tabs and panels.
    -->
    <div>
      <div id="panel-1">Panel 1</div>
      <div id="panel-2">Panel 2</div>
    </div>`

    coreTabs('#my-tabs', 0)

    expectActivePanel(document.querySelector('#panel-1'), {
      labelledby: document.querySelector('[aria-controls=panel-1]').id
    })
    expectInactivePanel(document.querySelector('#panel-2'), {
      labelledby: document.querySelector('[aria-controls=panel-2]').id
    })
  })
  it('coreTabs with dangerouslyPromiseToHandlePanels should not modify panels', () => {
    document.body.innerHTML = standardHTMLWithIDs

    const tabs = document.querySelector('#tabs')
    const panels = document.querySelector('#panels')

    const initialHTML = panels.outerHTML

    coreTabs(tabs, 0, { dangerouslyPromiseToHandlePanels: true })

    expect(initialHTML).toEqual(panels.outerHTML)
  })
  it('coreTabs with dangerouslyPromiseToHandleTabs should not modify tabs', () => {
    document.body.innerHTML = standardHTMLWithIDs

    const tabs = document.querySelector('#tabs')
    const initialHTML = tabs.innerHTML

    coreTabs(tabs, 0, { dangerouslyPromiseToHandleTabs: true })

    // using innerHTML because we will modify tabs-element with data-* attrs
    expect(initialHTML).toEqual(tabs.innerHTML)
  })
  it('setTabAttributes sets the correct attributes', () => {
    document.body.innerHTML = standardHTMLWithIDs

    const tabs = document.querySelector('#my-tabs')

    coreTabs(tabs, 0, { dangerouslyPromiseToHandleTabs: true })

    const tab1 = document.querySelector('#tab-1')
    const tab2 = document.querySelector('#tab-2')

    setTabAttributes(tab1, true)
    setTabAttributes(tab2, false)

    expectActiveTab(tab1, { controls: 'panel-1' })
    expectInactiveTab(tab2, { controls: 'panel-2' })
  })
  it('setPanelAttributes sets the correct attributes', () => {
    document.body.innerHTML = standardHTMLWithIDs
    const tabs = document.querySelector('#my-tabs')

    coreTabs(tabs, 0, { dangerouslyPromiseToHandldePanels: true })

    const panel1 = document.querySelector('#panel-1')
    const panel2 = document.querySelector('#panel-2')
    const tab1 = document.querySelector('#tab-1')
    const tab2 = document.querySelector('#tab-2')

    setPanelAttributes(panel1, tab1.id, true)
    setPanelAttributes(panel2, tab2.id, false)

    expectActivePanel(panel1, { labelledby: 'tab-1' })
    expectInactivePanel(panel2, { labelledby: 'tab-2' })
  })
})
