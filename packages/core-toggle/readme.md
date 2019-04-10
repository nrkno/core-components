# Core Toggle

> `@nrk/core-toggle` simply makes a `<button>` toggle the visibility of next element sibling. Toggles can be nested and easily extended with custom animations or behavior through the [toggle event](#events). It has two modes:

<!--demo
<script src="core-toggle/core-toggle.min.js"></script>
<style>core-toggle:not([hidden]){display:block}</style>
demo-->

## Installation

```bash
npm install @nrk/core-toggle --save-exact
```
```js
import CoreToggle from '@nrk/core-toggle'

window.customElements.define('core-toggle', CoreToggle)
```


## Demo

```html
<!--demo-->
<button>Popup VanillaJS</button>
<core-toggle class="my-dropdown" popup hidden>
  <ul>
    <li><a>Link</a></li>
    <li>
      <button>Can also be nested</button>
      <core-toggle class="my-dropdown" popup hidden>
        <ul>
          <li><a>Sub-link</a></li>
          <li><input type="text" autofocus aria-label="Skriv her"></li>
        </ul>
      </core-toggle>
    </li>
  </ul>
</core-toggle>
```

```html
<!--demo-->
<div id="jsx-toggle-popup"></div>
<script type="text/jsx">
  ReactDOM.render(<>
    <button>Popup JSX</button>
    <core-toggle className='my-dropdown' hidden popup onToggle={console.warn} onToggleSelect={console.warn}>
      <ul>
        <li><button>Select</button></li>
        <li><a href='#'>Link</a></li>
        <li>
          <button>Can also be nested</button>
          <core-toggle className='my-dropdown' hidden popup>
            <ul>
              <li><a href='#'>Sub-link</a></li>
            </ul>
          </core-toggle>
        </li>
      </ul>
    </core-toggle>
  </>, document.getElementById('jsx-toggle-popup'))
</script>
```

## Usage

### HTML / JavaScript

```html
<button>Toggle VanillaJS</button> <!-- must be <button> placed directly before core-toggle, or with id -->
<core-toggle popup={false|true|String} hidden>Content</core-toggle> <!-- use hidden to prevent flash of unstyled content -->
```

```js
import CoreToggle from '@nrk/core-toggle'

window.customElements.define('core-toggle', CoreToggle)
```

## Markup

### With aria-controls

Putting the toggle button directly before the content is highly recommended, as this fulfills all accessibility requirements by default. There might be scenarios though, where styling makes this DOM structure impractical. In such cases, give the toggle button an `aria-controls` attribute, and the content an `id` with corresponding value. Make sure there is no text between the button and toggle content, as this will break the experience for screen reader users:

```html
<div>
  <button id="my-button">Toggle VanillaJS</button>
</div>
<core-toggle for="my-button" hidden>Content</core-toggle>
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

### toggleSelect

The `toggleSelect` event is fired whenever an item is selected inside a toggle with the `popup` option enabled.
Useful for setting the value of the toggle button with the selected value.


```js
document.addEventListener('toggleSelect', (event) => {
  event.target                              // The buttom element triggering the event
  event.detail.relatedTarget                // The content element controlled by button
  event.detail.currentTarget                // The item element selected
  event.detail.value                        // The selected item's value
})
```


## Styling

All styling in documentation is example only. Both the `<button>` and content element receive attributes reflecting the current toggle state:

```css
.my-button {}                         /* Target button in any state */
.my-button[aria-expanded="true"] {}   /* Target only open button */
.my-button[aria-expanded="false"] {}  /* Target only closed button */

.my-toggle-content {}                 /* Target content in any state */
.my-toggle-content:not([hidden]) {}   /* Target only open content */
.my-toggle-content[hidden] {}         /* Target only closed content */
```

## Demo: Expand

Content is only toggled when clicking the button. Great for accordions and expand/collapse panels.

```html
<!--demo-->
<button id="hei">Toggle VanillaJS</button>  <!-- must be <button> -->
<core-toggle hidden>Content</core-toggle>  <!-- hidden prevents flash of unstyled content -->
```
```html
<!--demo-->
<div id="jsx-toggle-default"></div>
<script type="text/jsx">
  ReactDOM.render(<>
    <button>Toggle JSX</button>
    <core-toggle popup={false} hidden={true} onToggle={console.log}>Content</core-toggle>
  </>, document.getElementById('jsx-toggle-default'))
</script>
```


## Demo: Select

Listen to the `toggleSelect` event and update the button's value from the selected item
to create a component that behaves like a `<select>`:

```html
<!--demo-->
<button>Select number</button>
<core-toggle class="my-select my-dropdown" hidden>
  <li><button>One</button></li>
  <li><button>Two</button></li>
  <li><button>Three</button></li>
</core-toggle>
<script>
  document.addEventListener('toggleSelect', (event) => {
    if (!event.target.classList.contains('my-select')) return
    event.target.button.textContent = event.detail.textContent
    event.target.hidden = true
    // coreToggle(event.target, { value: event.detail.value, open: false })
  })
</script>
```

```html
<!--demo-->
<!-- <div id="jsx-toggle-select"></div>
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
</script> -->
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
