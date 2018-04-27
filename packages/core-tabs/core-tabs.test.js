import coreTabs from './core-tabs'

describe('core-tabs', () => {
  it('can init on standard HTML', () => {
    document.body.innerHTML = `
      <div class="my-tabs">
        <button>Button tab</button>
      </div>
      <!-- Next element children will become panels of correlating tab -->
      <div>
        <div id="my-panel">Text of tab 1</div>
      </div>`

    coreTabs('.my-tabs')

    expect(document.getElementById('my-panel').hasAttribute('aria-labelledby')).toBeTruthy()
  })
  it('can init on html without panels as nextElementSibling. panels found by aria-controls', () => {
    document.body.innerHTML = `
    <div>
      <div id="my-tabs">
        <button aria-controls="my-panel">Button tab</button>
      </div>
    </div>
    <!--
      Putting tabs somewhere else in the DOM.

      NB! there must not be any semantic content between tabs and panels.
    -->
    <div>
      <div id="my-panel">Panel</div>
    </div>`

    const tabs = document.querySelector('#my-tabs')

    coreTabs(tabs)

    expect(document.getElementById('my-panel').hasAttribute('aria-labelledby')).toBeTruthy()
  })
})
