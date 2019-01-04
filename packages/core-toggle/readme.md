# Core Toggle

> `@nrk/core-toggle` simply makes a `<button>` toggle the visibility of next element sibling. Toggles can be nested and easily extended with custom animations or behavior through the [toggle event](#events). It has two modes:



## Installation

```bash
npm install @nrk/core-toggle --save-exact
```
```js
import coreToggle from '@nrk/core-toggle'     // Vanilla JS
import CoreToggle from '@nrk/core-toggle/jsx' // ...or React/Preact compatible JSX
```



## Demo: Default

<!--demo
<script src="core-toggle/core-toggle.min.js"></script>
<script src="core-toggle/core-toggle.jsx.js"></script>
demo-->
Content is only toggled when clicking `button`. Great for accordions and expand/collapse panels.

```html
<!--demo-->
<button class="my-toggle">Toggle VanillaJS</button>  <!-- must be <button> -->
<div hidden>Content</div>                                       <!-- hidden prevents flash of unstyled content -->
<script>
  coreToggle('.my-toggle') // Optionally pass {open: true|false} as second argument to open/close
</script>
```

```html
<!--demo-->
<div id="jsx-toggle-default"></div>
<script type="text/jsx">
  ReactDOM.render(<CoreToggle popup={false} open={false} onToggle={function(){}}>
    <button>Toggle JSX</button>
    <div>Content</div>
  </CoreToggle>, document.getElementById('jsx-toggle-default'))
</script>
```

## Demo: Popup

Content is toggled when clicking `button`, and closed when clicking outside content. Great for dropdowns and tooltips.

```html
<!--demo-->
<button class="my-popup">Popup VanillaJS</button>
<ul class="my-dropdown" hidden>
  <li><a>Link</a></li>
  <li>
    <button class="my-popup">Can also be nested</button>
    <ul class="my-dropdown" hidden>
      <li><a>Sub-link</a></li>
      <li><input type="text" autofocus aria-label="Skriv her"></li>
    </ul>
  </li>
</ul>
<script>
  coreToggle('.my-popup', { popup: 'Example picker' })
</script>
```

```html
<!--demo-->
<div id="jsx-toggle-popup"></div>
<script type="text/jsx">
  ReactDOM.render(<CoreToggle popup='Example picker'>
    <button>Popup JSX</button>
    <ul className='my-dropdown'>
      <li><a href='#'>Link</a></li>
      <li>
        <CoreToggle popup='Example picker'>
          <button>Can also be nested</button>
          <ul className='my-dropdown'>
            <li><a href='#'>Sub-link</a></li>
          </ul>
        </CoreToggle>
      </li>
    </ul>
  </CoreToggle>, document.getElementById('jsx-toggle-popup'))
</script>
```


## Demo: Select

Listen to the `toggle.select` event and update the button's value from the selected item
to create a component that behaves like a `<select>`:

```html
<!--demo-->
<button class="my-popup-value">Select number</button>
<ul class="my-dropdown" hidden>
  <li><button>One</button></li>
  <li><button>Two</button></li>
  <li><button>Three</button></li>
</ul>
<script>
  document.addEventListener('toggle.select', (event) => {
      if (event.target.className !== 'my-popup-value') return
      coreToggle(event.target, { value: event.detail.value, open: false })
  })
  coreToggle('.my-popup-value', { popup: 'Number picker'})
</script>
```

```html
<!--demo-->
<div id="jsx-toggle-select"></div>
<script type="text/jsx">
  class MyToggleSelect extends React.Component {
    constructor (props) {
      super(props)
      this.state = { value: 'Select number' }
      this.onSelect = this.onSelect.bind(this)
    }
    onSelect (event) {
      this.setState({ value: event.detail.value })
    }
    render () {
      return <CoreToggle popup='Example picker' open={false} onToggleSelect={this.onSelect}>
        <button>{this.state.value}</button>
        <ul className='my-dropdown'>
          <li><button>One</button></li>
          <li><button>Two</button></li>
          <li><button>Three</button></li>
        </ul>
      </CoreToggle>
    }
  }
  ReactDOM.render(<MyToggleSelect/>, document.getElementById('jsx-toggle-select'))
</script>
```

## Usage

### HTML / JavaScript

```html
<button class="my-toggle">Toggle VanillaJS</button>
<div hidden>Content</div>
```

```js
import coreToggle from '@nrk/core-toggle'

coreToggle(
  selector, // Accepts a selector string, NodeList, Element or array of Elements
  options   // An object. See table below for possible properties
})
```


Property | Default | Type | Description
:-- | :-- | :-- | :--
open | `aria-expanded` or `false` | `null` or `String` | Use `true` or `false` to force open state.
popup | `false` | `Boolean` or `String` | Enable or disable if clicking outside toggle should close it. Provide a string to control the `aria-label` text on the toggle.


### React / Preact

```jsx
import CoreToggle from '@nrk/core-toggle/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <Toggle> will handle state itself unless you call event.preventDefault() in onToggle

<CoreToggle open={false} popup={false} onToggle={(event) => {}}>
  <button>Use with JSX</button>  // First element must result in a <button>-tag. Accepts both elements and components
  <div>Content</div>             // Next element will be toggled. Accepts both elements and components
</CoreToggle>
```



## Markup

### With aria-controls

Putting the toggle button directly before the content is highly recommended, as this fulfills all accessibility requirements by default. There might be scenarios though, where styling makes this DOM structure impractical. In such cases, give the toggle button an `aria-controls` attribute, and the content an `id` with corresponding value. Make sure there is no text between the button and toggle content, as this will break the experience for screen reader users:

```html
<div>
  <button class="my-toggle" aria-controls="content">Toggle VanillaJS</button>
</div>
<div id="content" hidden>Content</div>
```

### Autofocus

If you have form elements inside a `@nrk/core-toggle`, you can optionally add a `autofocus` attribute to the most prominent form element. This helps the user navigate quickly when toggle is opened.



## Events

### toggle

Before a `@nrk/core-toggle` changes open state, a [toggle event](https://www.w3schools.com/jsref/event_ontoggle.asp) is fired (both for VanillaJS and React/Preact components). The toggle event is cancelable, meaning you can use [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) to cancel toggling. The event also [bubbles](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture), and can therefore be detected both from the button element itself, or any parent element (read [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)):


```js
document.addEventListener('toggle', (event) => {
  event.target                              // The button element triggering toggle event
  event.detail.relatedTarget                // The content element controlled by button
  event.detail.isOpen                       // The current toggle state (before toggle event has run)
  event.detail.willOpen                     // The wanted toggle state
})
```

### toggle.select

The `toggle.select` event is fired whenever an item is selected inside a toggle with the `popup` option enabled.
Useful for setting the value of the toggle button with the selected value.


```js
document.addEventListener('toggle.select', (event) => {
  event.target                              // The buttom element triggering the event
  event.detail.relatedTarget                // The content element controlled by button
  event.detail.currentTarget                // The item element selected
  event.detail.value                        // The selected item's value
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

### Why not use `<details>` instead?
Despite having a native [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) element for expanding/collapsing content, there are several issues regarding [browser support](https://caniuse.com/#feat=details), [styling](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#Example_with_styling), [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/). Furthermore, polyfills often conflict with other standards such as `<dialog>`.

### Why is there no `role="menu"` in dropdowns?
The [menu role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html) is mainly inteded for context menues and toolbars in [application interfaces](https://www.w3.org/TR/wai-aria-1.1/#application), and has quite complex [keyboard navigation](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html#kbd_label) requirements. As most end users will not expect application behavior in websites and internal web based systems, (implemented) attributes like `aria-controls` and `aria-labelledby` is sufficient for a good user experience.

### Why does dropdowns not open on hover?
Both touch devices and screen readers will have trouble properly interacting with hoverable interfaces (unless more complex fallback logic is implemented). To achieve a consistent and accessible interface, `core-toggle` is designed around click interactions.

### Why is there no group-option to achieve a single open toggle?
Some expand/collapse interfaces like [accordions](https://www.nngroup.com/articles/accordions-complex-content/) behaves like a group - allowing only one expanded area at the time. This pattern however requires more logic and carefully designed animations to avoid confusion over expected scroll position.

*Example: The user first opens "Toggle-1", and then "Toggle-2" (which closes "Toggle-1"). Since "Toggle-1" is placed above, the position "Toggle-2" now changes - potentially outside the viewport on smaller devices.
Note: If you do need to implement grouping, you can achieve this by reacting to the toggle event.*
