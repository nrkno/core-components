---
name: Tabs
category: Components
---

> `@nrk/core-tabs` converts `<button>` and `<a>` elements to keyboard accessible tabs, controlling children of next element sibling (tabpanels). Tabs can be nested and easily extended with custom animations or behavior through the `tabs.toggle` event.

```tabs.html
<div class="my-tabs"> <!-- Children must be <a> or <button> -->
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
```
```tabs.js
coreTabs('.my-tabs')
```
```tabs.jsx
<Tabs open={0} onToggle={function(){}} className='my-vertical-tabs'>
  <div>
    <button>Button tab JSX</button>
    <button>Nested tabs JSX</button>
  </div>
  <div>
    <div>Text of tab 1</div>
    <Tabs>
      <div>
        <button>Subtab 1 JSX</button>
        <button>Subtab 2 JSX</button></div>
      <div>
        <div>Subpanel 1</div>
        <div>Subpanel 2</div>
      </div>
    </Tabs>
  </div>
</Tabs>
```
```tabs.css
[role="tabpanel"] { background: #eee; padding: 10px }
[aria-selected="true"] { border: 2px solid }

.my-vertical-tabs [role="tablist"] { float: left; width: 150px }
.my-vertical-tabs [role="tabpanel"] { overflow: hidden }
.my-vertical-tabs [role="tab"] { display: inline-block }
```
```tabs.css hidden
.my-vertical-tabs { margin-top: 2em }
```

## Usage
```js
import coreTabs from '@nrk/core-tabs'

coreTabs(
  String|Element|Elements,    // Accepts a selector string, NodeList, Element or array of Elements
  open                        // Optional. Can be String: id of tab, Element: tab or Number: index of tab
)
```
```jsx
import Input from '@nrk/core-tabs/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <Tabs> will handle state itself unless you call event.preventDefault() in onToggle

<Tabs open={0} onToggle={(event) => {}}>
  <div>                     // First element must contain tabs
    <button>Tab 1</button>  // Tabs items must be <button> or <a>
    <a href="#">Tab 2</a>
  </div>
  <div>                     // Next element must contain tabpanels
    <div>Panel 1</div>      // No need to set hidden attribute in JSX; this is controlled by "open"
    <div>Panel 2</div>
  </div>
</Tabs>
```

## Events
`'tabs.toggle'` is fired before toggle (both for VanillaJS and React/Preact components). The `tabs.toggle` event is cancelable, meaning you can use `event.preventDefault()` to cancel default toggling. The event also bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):

```js
document.addEventListener('tabs.toggle', (event) => {
  event.target                // The core-tabs element triggering tabs.toggle event
  event.detail.isOpen         // Index of the open tab
  event.detail.willOpen       // Index of the clicked tab

  // TIP - access the actual DOM elements:
  const tabs = event.target.children
  const panels = event.target.nextElementSibling.children

  const isOpenTab = tabs[event.detail.isOpen]
  const isOpenPanel = tabs[event.detail.isOpen]
  const willOpenTab = panels[event.detail.willOpen]
  const willOpenPanel = panels[event.detail.willOpen]
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
