# Core Tabs

> `<core-tabs>` converts `<button>` and `<a>` elements to keyboard accessible tabs, controlling following tabpanels.
> Tabs can be nested and easily extended with custom animations or behaviour through the `tabs.toggle` event.

<!--demo
<script src="core-tabs/core-tabs.min.js"></script>
<script src="core-tabs/core-tabs.jsx.js"></script>
<style>
  [role="tabpanel"] { background: #eee; padding: 10px }
  [aria-selected="true"] { border: 2px solid }

  .my-vertical-tabs [role="tablist"] { float: left; width: 150px }
  .my-vertical-tabs [role="tabpanel"] { overflow: hidden }
  .my-vertical-tabs [role="tab"] { display: inline-block }
</style>
demo-->

## Demo

```html
<!--demo-->
<core-tabs>
  <button>Button tab</button>
  <button>Nested tabs</button>
  <a href="#link">Link tab</a>
</core-tabs>
<div>Text of tabpanel 1</div>
<div hidden>
  <core-tabs>
    <button>Subtab 1</button>
    <button>Subtab 2</button>
    <button>Subtab 3</button>
  </core-tabs>
  <div>Text of subpanel tabpanel 1</div>
  <div>Text of subpanel tabpanel 2</div>
</div>
<div hidden>Text of tabpanel 3</div>
```

```html
<!--demo-->
<div id="jsx-tabs" class="my-vertical-tabs"></div>
<script type="text/jsx">
  ReactDOM.render(<div>
    <CoreTabs open={0} onToggle={function(){}}>
      <button>Button tab JSX</button>
      <button>Nested tabs JSX</button>
    </CoreTabs>
    <div>Text of tab 1</div>
    <div>
      <CoreTabs>
        <button>Subtab 1 JSX</button>
        <button hidden>Subtab 2 JSX</button>
      </CoreTabs>
      <div>Subpanel 1</div>
      <div hidden>Subpanel 2</div>
    </div>
  </div>, document.getElementById('jsx-tabs'))
</script>
```



## Usage


### Installation

```bash
npm install @nrk/core-tabs
```

### HTML / JavaScript

```html
<core-tabs tab="Number|String|Element">   <!-- Optional. Sets active tab from index, id or element -->
  <button>Tab 1</button>                  <!-- Tab elements must be <a> or <button>. Do not use <li> -->
  <a href="#">Tab 2</a>
  <button>Tab 2</button>
</core-tabs>
<div>Tabpanel 1 content</div>             <!-- First tabpanel is the next element sibling of core-tabs -->
<div hidden>Tabpanel 1 content</div>      <!-- Second tabpanel. Use hidden attribute to prevent FOUC -->
<div hidden>Tabpanel 1 content</div>      <!-- Third tabpanel.  Use hidden attribute to prevent FOUC -->
```

```js
import CoreTabs from '@nrk/core-tabs'

window.customElements.define('core-toggle', CoreTabs)  // Register custom element
const myTabs = document.querySelector('core-tabs')

// Getters
myTabs.tab        // {Element} Get active tab
myTabs.tabs       // {Array} Get all tabs
myTabs.panel      // {Element} Get active tabpanel
myTabs.panels     // {Array} Get all tabpanels
// Setters
myTabs.tab = 0    // {Number|String|Element} Set active tab from index, id or element
```

### React / Preact

```js
import CoreTabs from '@nrk/core-tabs/jsx'

<CoreTabs
  tab={Number|String|Element}   // Optional. Sets active tab from number, id or element
  onTabsToggle={Function}>      // Optional. Listen to toggle event
  <button>Tab 1</button>        // Tab elements must be <a> or <button>. Do not use <li>
  <a href="#">Tab 2</a>
</CoreTabs>
<div>Tabpanel 1 content</div>             // First tabpanel is the next element sibling of CoreTabs
<div hidden>Tabpanel 1 content</div>      // Second tabpanel. Use hidden attribute to prevent FOUC
<div hidden>Tabpanel 1 content</div>      // Third tabpanel.  Use hidden attribute to prevent FOUC
```



## Events
`'tabs.toggle'` is fired when toggling a tab. The event bubbles and can therefore be detected both from button element itself, or any parent element (read event delegation):

```js
document.addEventListener('tabs.toggle', (event) =>
  event.target     // The core-tabs element triggering event
})
```

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


## FAQ
### Why must tabs be direct children of `core-tabs` element and not inside `<ul><li>...</li></ul>`?
A `<ul>`/`<li>` structure would seem logical for tabs, but this causes some screen readers to incorrectly announce tabs as single (tab 1 of 1).

### Does panels always need be a next element sibling?
The aria specification does not allow any elements that are focusable by a screen reader to be placed between tabs and panels. Therefore, `core-tabs` defaults to use the next element siblings as panels.
This behaviour can be overridden, by setting up `id` on panel elements and `aria-controls` on tab element. Use with caution and *only* do this if your project *must* use another DOM structure. Example:

```js
const myTabs = document.querySelector('core-tabs')
myTabs.tabs.forEach((tabs, index) => tab.setAttribute('aria-controls', myTabs.panels[index].id = 'my-panel-' + index))
```
