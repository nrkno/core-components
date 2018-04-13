---
name: Toggle
category: Components
---

> `@nrk/core-toggle` simply makes a `<button>` toggle the visibility of next element sibling. Toggles can be nested and easily extended with custom animations or behavior through the [toggle event](#events). It has two modes:

<div class="nrk-grid">
<div class="nrk-xs-12of12 nrk-md-6of12" style="padding-right:30px"><h2>Default toggle</h2>
Content is only toggled when clicking `<button>`. Great for accordions and expand/collapse panels.

```toggle.html
<button class="my-toggle">Toggle VanillaJS</button>  <!-- must be <button> -->
<div hidden>Content</div>                                       <!-- hidden prevents flash of unstyled content -->
```
```toggle.js
coreToggle('.my-toggle') // Optionally pass {open: true|false} as second argument to open/close
```
```toggle.jsx
<Toggle popup={false} open={false} onToggle={function(){}}>
  <button>Toggle JSX</button>
  <div>Content</div>
</Toggle>
```
</div>
<div class="nrk-xs-12of12 nrk-md-6of12"><h2>Popup toggle</h2>
Content is toggled when clicking `<button>`, and closed when clicking outside content. Great for dropdowns and tooltips.

```popup.html
<button class="my-popup">Popup VanillaJS</button>
<ul class="my-dropdown" hidden>
  <li><a href="#">Link</a></li>
  <li>
    <button class="my-popup">Can also be nested</button>
    <ul class="my-dropdown" hidden>
      <li><a href="#">Sub-link</a></li>
    </ul>
  </li>
</ul>
```
```popup.js
coreToggle('.my-popup', {popup: true})
```
```popup.jsx
<Toggle popup>
  <button>Popup JSX</button>
  <ul className='my-dropdown'>
    <li><a href='#'>Link</a></li>
    <li>
      <Toggle popup>
        <button>Can also be nested</button>
        <ul className='my-dropdown'>
          <li><a href='#'>Sub-link</a></li>
        </ul>
      </Toggle>
    </li>
  </ul>
</Toggle>
```
</div>
</div>

## Usage

```js
import coreToggle from '@nrk/core-toggle'

coreToggle(String|Element|Elements, { // Accepts a selector string, NodeList, Element or array of Elements
  open: null,                         // Defaults to value of aria-expanded or false. Use true|false to force open state
  popup: null                         // Defaults to value of aria-haspopup or false. Use true|false to force popup mode
})
```

```jsx
import Toggle from '@nrk/core-toggle/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <Toggle> will handle state itself unless you call event.preventDefault() in onToggle

<Toggle open={false} popup={false} onToggle={(event) => {}}>
  <button>Use with JSX</button>  // First element must result in a <button>-tag. Accepts both elements and components
  <div>Content</div>             // Next element will be toggled. Accepts both elements and components
</Toggle>
```

## Events

Before a `@nrk/core-toggle` changes open state, a [toggle event](https://www.w3schools.com/jsref/event_ontoggle.asp) is fired (both for VanillaJS and React/Preact components). The toggle event is cancelable, meaning you can use [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) to cancel toggling. The event also [bubbles](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture), and can therefore be detected both from button element itself, or any parent element (read [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)):

```js
document.addEventListener('toggle', (event) => {
  event.target                              // The button element triggering toggle event
  event.detail.relatedTarget                // The content element controlled by button
  event.detail.isOpen                       // The current toggle state (before toggle event has run)
  event.detail.willOpen                     // The wanted toggle state
})
```

## Styling

All styling in documentation is example only. Both the `<button>` and content element receive attributes reflecting the current toggle state:

```css
.my-toggle {}                         /* Target button in any state */
.my-toggle[aria-expanded="true"] {}   /* Target only open button */
.my-toggle[aria-expanded="false"] {}  /* Target only closed button */

.my-toggle-content {}                 /* Target content in any state */
.my-toggle-content:not([hidden]) {}   /* Target only open content */
.my-toggle-content[hidden] {}         /* Target only closed content */
```

## FAQ
<details>
<summary>Why not use `<details>` instead?</summary>
Despite having a native [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) element for expanding/collapsing content, there are several issues regarding [browser support](https://caniuse.com/#feat=details), [styling](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#Example_with_styling), [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/). Furthermore, polyfills often conflict with other standards such as `<dialog>`.
</details>

<details>
<summary>Why is there no `role="menu"` in dropdowns?</summary>
The [menu role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html) is mainly inteded for context menues and toolbars in [application interfaces](https://www.w3.org/TR/wai-aria-1.1/#application), and has quite complex [keyboard navigation](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html#kbd_label) requirements. As most end users will not expect application behavior in websites and internal web based systems, (implemented) attributes like `aria-controls` and `aria-labelledby` is sufficient for a good user experience.
</details>

<details>
<summary>Why does dropdowns not open on hover?</summary>
Both touch devices and screen readers will have trouble properly interacting with hoverable interfaces (unless more complex fallback logic is implemented). To achieve a consistent and accessible interface, `core-toggle` is designed around click interactions.
</details>

<details>
<summary>Why is there no group-option to achieve a single open toggle?</summary>
Some expand/collapse interfaces like [accordions](https://www.nngroup.com/articles/accordions-complex-content/) behaves like a group - allowing only one expanded area at the time. This pattern however requires more logic and carefully designed animations to avoid confusion over expected scroll position.
<br>
<br>
*Example: The user first opens "Toggle-1", and then "Toggle-2" (which closes "Toggle-1"). Since "Toggle-1" is placed above, the position "Toggle-2" now changes - potentially outside the viewport on smaller devices.
Note: If you do need to implement grouping, you can achieve this by reacting to the toggle event.*
</details>
