# Core Tabs

## `@nrk/core-tabs` converts `<button>` and `<a>` elements to keyboard accessible tabs, controlling children of next element sibling (tabpanels). Tabs can be nested and easily extended with custom animations or behaviour through the `tabs.toggle` event.

---

<script src="core-tabs/core-tabs.min.js"></script>
<script src="core-tabs/jsx/index.js"></script>
<style>
  [role="tabpanel"] { background: #eee; padding: 10px }
  [aria-selected="true"] { border: 2px solid }

  .my-vertical-tabs [role="tablist"] { float: left; width: 150px }
  .my-vertical-tabs [role="tabpanel"] { overflow: hidden }
  .my-vertical-tabs [role="tab"] { display: inline-block }
</style>

```html
<!--demo-->
<div class="my-tabs"> <!-- Direct children must be <a> or <button>. Do not use <li> -->
  <button>Button tab</button>
  <button>Nested tabs</button>
  <a href="#link">Link tab</a>
</div>
<div> <!-- Next element children will become panels of correlating tab -->
  <div>Text of tab 1</div>
  <div hidden> <!-- hidden prevents flash of unstyled content -->
    <div class="my-tabs">
      <button>Subtab 1</button>
      <button>Subtab 2</button>
    </div>
    <div>
      <div>Subpanel 1</div>
      <div>Subpanel 2</div>
    </div>
  </div>
  <div hidden>Text of tab 3</div>
</div>
<script>
  coreTabs('.my-tabs')
</script>
```

```html
<!--demo-->
<div id="jsx-tabs"></div>
<script type="text/jsx">
  ReactDOM.render(<CoreTabs open={0} onToggle={function(){}} className='my-vertical-tabs'>
    <div>
      <button>Button tab JSX</button>
      <button>Nested tabs JSX</button>
    </div>
    <div>
      <div>Text of tab 1</div>
      <CoreTabs>
        <div>
          <button>Subtab 1 JSX</button>
          <button>Subtab 2 JSX</button>
        </div>
        <div>
          <div>Subpanel 1</div>
          <div>Subpanel 2</div>
        </div>
      </CoreTabs>
    </div>
  </CoreTabs>, document.getElementById('jsx-tabs'))
</script>
```

---

## Usage
```js
import coreTabs from '@nrk/core-tabs'

coreTabs(
  String|Element|Elements,    // Accepts a selector string, NodeList, Element or array of Elements
  open                        // Optional. Can be String: id of tab, Element: tab or Number: index of tab
)
```
```js
import CoreTabs from '@nrk/core-tabs/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <Tabs> will handle state itself unless you call event.preventDefault() in onToggle

<CoreTabs open={0} onToggle={(event) => {}}>
  <div>                     // First element must contain tabs
    <button>Tab 1</button>  // Tabs items must be <button> or <a>
    <a href="#">Tab 2</a>
  </div>
  <div>                     // Next element must contain tabpanels
    <div>Panel 1</div>      // No need to set hidden attribute in JSX; this is controlled by "open"
    <div>Panel 2</div>
  </div>
</CoreTabs>
```

---

## Events
`'tabs.toggle'` is fired before toggle (both for VanillaJS and React/Preact components). The `tabs.toggle` event is cancelable, meaning you can use `event.preventDefault()` to cancel default toggling. The event also bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):

```js
document.addEventListener('tabs.toggle', (event) => {
  event.target                // The core-tabs element triggering tabs.toggle event
  event.detail.isOpen         // Index of the open tab
  event.detail.willOpen       // Index of the clicked tab
  event.detail.tabs           // Array of tab elements
  event.detail.panels         // Array of panel elements

  // TIP - access the actual DOM elements:
  const isOpenTab = event.detail.tabs[event.detail.isOpen]
  const isOpenPanel = event.detail.panels[event.detail.isOpen]
  const willOpenTab = event.detail.tabs[event.detail.willOpen]
  const willOpenPanel = event.detail.panels[event.detail.willOpen]
})
```

---

## Styling
All styling in documentation is example only. Both the tabs and tabpanels receive attributes reflecting the current toggle state:

```css
.my-tab {}                          /* Target tab in any state */
.my-tab[aria-selected="true"] {}    /* Target only open tab */
.my-tab[aria-selected="false"] {}   /* Target only closed tab */

.my-tabpanel {}                     /* Target panel element in any state */
.my-tabpanel:not([hidden]) {}       /* Target only open panel */
.my-tabpanel[hidden] {}             /* Target only closed panel */
```

---

## FAQ
### Why must tabs be direct children of `core-tabs` element and not inside `<li>`?
A `<ul>`/`<li>` structure would seem logical for tabs, but this causes some screen readers to incorrectly announce tabs as single (tab 1 of 1).

### Does panels always need to direct children of next element?
The aria specification does not allow any elements that are focusable by a screen reader to be placed between tabs and panels. Therefore, `@nrk/core-tabs` defaults to use children of next element as panels.
This behaviour can be overridden, by setting up `id` on panel elements and `aria-controls` on tab element. Use with caution and *only* do this if your project *must* use another DOM structure. Example:

```js
const tabs = Array.from(document.querySelectorAll('.my-tabs__tab'))
const panels = Array.from(document.querySelectorAll('.my-tabs__panel'))
tabs.forEach((tabs, index) => tab.setAttribute('aria-controls', panels[index].id = 'my-panel-' + i))

coreTabs('.my-tabs')
```
