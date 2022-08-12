# Core Toggle

> `@nrk/core-toggle` makes a `<button>` toggle the visibility of next element sibling. Toggles can be nested and easily extended with custom animations or behavior through the [toggle event](#events).

<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script> -->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-toggle/core-toggle.min.js"></script>
<script src="core-toggle/core-toggle.jsx.js"></script>
<style>core-toggle:not([hidden]){display:block}</style>
demo-->

## Example

```html
<!--demo-->
<button type="button">Popup VanillaJS</button>
<core-toggle class="my-dropdown" data-popup hidden>
  <ul>
    <li><a>Link</a></li>
    <li>
      <button type="button">Can also be nested</button>
      <core-toggle class="my-dropdown" data-popup hidden>
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
    <button type="button">Popup JSX</button>
    <CoreToggle className='my-dropdown' hidden data-popup onToggleSelect={console.warn}>
      <ul>
        <li><button type="button">Select</button></li>
        <li><a href='#'>Link</a></li>
        <li>
          <button type="button">Can also be nested</button>
          <CoreToggle className='my-dropdown' hidden data-popup>
            <ul>
              <li><a href='#'>Sub-link</a></li>
            </ul>
          </CoreToggle>
        </li>
      </ul>
    </CoreToggle>
  </>, document.getElementById('jsx-toggle-popup'))
</script>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-toggle  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/9/core-toggle/core-toggle.min.js"></script>  <!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements) custom elements if needed.


## Usage

### HTML / JavaScript

```html
<button type="button">Toggle VanillaJS</button>       <!-- Must be <button> placed directly before <core-toggle> or use id + data-for attributes -->
<core-toggle
  hidden                                <!-- Set hidden attribute to prevent FOUC -->
  data-popup="{String?}"                <!-- Optional. If present, clicking outside open toggle will close it. Providing a string also enables select-behavior, by replacing value inside button with selected value, and suffixes provided string to aria-label on button -->
>
  Content                               <!-- Content to be toggled. Accepts text, elements and components -->
</core-toggle>
```

```js
import CoreToggle from '@nrk/core-toggle'                 // Using NPM
window.customElements.define('core-toggle', CoreToggle)   // Using NPM. Replace 'core-toggle' with 'my-toggle' to namespace

const myToggle = document.querySelector('core-toggle')

// Getters
myToggle.button         // Get toggle button element
myToggle.popup          // Get popup value
myToggle.hidden         // Get hidden value
myToggle.value          // Get toggle button text

// Setters
myToggle.popup = {Boolean|String}   // If true, clicking outside open toggle will close it. Providing a string also enables select-behavior, by replacing value inside button with selected value, and suffixes provided string to aria-label on button
myToggle.hidden = true              // Set hidden attribute
myToggle.value = 'Velg'             // Sets innerHTML of the button and safely updates aria-label for screen readers. Defaults to button.innerHTML
```

### React / Preact

```js
import CoreToggle from '@nrk/core-toggle/jsx'

<button type="button">Use with JSX</button>
<CoreToggle
  hidden                         // Set hidden attribute to prevent FOUC
  data-popup={Boolean|String}    // Optional. If true, clicking outside open toggle will close it. Providing a string also enables select-behavior, by replacing value inside button with selected value, and suffixes provided string to aria-label on button
  ref={(comp) => {}}             // Optional. Get reference to React component
  forwardRef={(el) => {}}        // Optional. Get reference to underlying DOM custom element
  onToggle={Function}            // Optional. Toggle event listener. See event 'toggle'
  onToggleSelect={Function}      // Optional. Toggle select event listener. See event 'toggle.select'
>
  Content                        // Content to be toggled. Accepts text, elements and components
</CoreToggle>
```

## Markup

### With for

Putting the toggle button directly before the content is highly recommended, as this fulfills all accessibility requirements by default. There might be scenarios though, where styling makes this DOM structure impractical. In such cases, give the `<button>` a `data-for` attribute (`for` is deprecated), and the `<core-toggle>` an `id` with corresponding value. Make sure there is no text between the button and toggle content, as this will break the experience for screen reader users:

```html
<div>
  <button data-for="my-toggle" type="button">Toggle</button>
</div>
<core-toggle id="my-toggle" hidden>...</core-toggle>
```

### Popup and button HTML

Using the `data-popup` attribute in conjunction with embedded HTML in your toggle button (an SVG icon for instance) will only preserve text when updating the value/label for the button. To preserve the embedded HTML, put the actual button text inside a `<span>`:

```html
<button type="button">
  <span>Toggle</span>
  <svg style="width:1.5em; height:1.5em" aria-hidden="true"><use xlink:href="#nrk-heart"></use></svg>
</button>
<core-toggle data-popup="..." hidden>...</core-toggle>
```


### Autofocus

If you have form elements inside a `<core-toggle>`, you can optionally add a `autofocus` attribute to the most prominent form element. This helps the user navigate quickly when toggle is opened.

### Autoposition

When using core-toggle near the screen edges, the `autoposition` attribute positions the toggled content where there is visual room around the button, using `position:fixed`.
This enables core-toggle to be used inside scrollable areas.

```html
<!--demo-->
<div style="overflow:auto; height:70px; width:200px; border:2px dashed #ccc;">
  <button type="button">Toggle is autopositioned</button>
  <core-toggle class="my-dropdown" autoposition hidden>
    <ul>
      <li><a>Link</a></li>
      <li><a>Another link</a></li>
      <li><a>Linking is life</a></li>
    </ul>
  </core-toggle>
  <p>Scroll me to the edge!</p>
</div>
```
## Events

### toggle

Fired after open state changes:


```js
document.addEventListener('toggle', (event) => {
  event.target   // The toggle element
})
```

### toggle.select

Fired whenever an `<a>` or `<button>` element is selected inside a toggle with the `data-popup` option enabled.
Useful for setting the value of the toggle button with the selected value.


```js
document.addEventListener('toggle.select', (event) => {
  event.target   // The toggle element
  event.detail   // The selected element
  event.target.value = event.detail  // Example: set value of toggle to selected element
})
```


## Styling

**Note:** `<core-toggle>` is `display: inline` by default. Change this by for instance setting `core-toggle:not([hidden]) { display: block | flex | grid }` or similar in your app. Not needed when `position` or `float` is used. All styling in documentation is example only. Both the `<button>` and `<core-toggle>` element receive attributes reflecting the current toggle state:

```css
.my-button {}                         /* Target button in any state */
.my-button[aria-expanded="true"] {}   /* Target only open button */
.my-button[aria-expanded="false"] {}  /* Target only closed button */

.my-toggle-content {}                 /* Target content in any state */
.my-toggle-content:not([hidden]) {}   /* Target only open content */
.my-toggle-content[hidden] {}         /* Target only closed content */
```

## Example: Expand

Content is only toggled when clicking the button. Great for accordions and expand/collapse panels.

```html
<!--demo-->
<button type="button">Toggle VanillaJS</button>  <!-- must be <button> -->
<core-toggle hidden>Content</core-toggle>  <!-- hidden prevents flash of unstyled content -->
```
```html
<!--demo-->
<div id="jsx-toggle-default"></div>
<script type="text/jsx">
  ReactDOM.render(<>
    <button type="button">Toggle JSX</button>
    <CoreToggle hidden onToggle={console.log}>Content</CoreToggle>
  </>, document.getElementById('jsx-toggle-default'))
</script>
```


## Example: Select

`data-popup`-attribute is required for Select behavior

Listen to the `toggle.select` event and update the button's value from the selected item
to create a component that behaves like a `<select>`:

```html
<!--demo-->
<button type="button">Episode 1</button>
<core-toggle class="my-select my-dropdown" hidden data-popup="Choose episode">
  <ul>
    <li><button type="button">Episode 1</button></li>
    <li><button type="button">Episode 2</button></li>
    <li><button type="button">Episode 3</button></li>
  </ul>
</core-toggle>
<script>
  document.addEventListener('toggle.select', (event) => {
    if (!event.target.classList.contains('my-select')) return
    event.target.value = event.detail
    event.target.hidden = true
    event.target.button.focus()
  })
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
      event.target.hidden = true
      this.setState({ value: event.detail.textContent })
    }
    render () {
      return <>
        <button type="button">{this.state.value}</button>
        <CoreToggle className='my-dropdown' data-popup='Example picker' hidden onToggleSelect={this.onSelect}>
          <ul>
            <li><button type="button">One</button></li>
            <li><button type="button">Two</button></li>
            <li><button type="button">Three</button></li>
          </ul>
        </CoreToggle>
      </>
    }
  }
  ReactDOM.render(<MyToggleSelect/>, document.getElementById('jsx-toggle-select'))
</script>
```

## FAQ

### Why not use `<details>` instead?
Despite having a native [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) element for expanding/collapsing content, there are several issues regarding [browser support](https://caniuse.com/#feat=details), [styling](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#Example_with_styling), [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/). Furthermore, polyfills often conflict with other standards such as `<dialog>`.

### Why is there no `role="menu"` in dropdowns?
The [menu role](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html) is mainly inteded for context menues and toolbars in [application interfaces](https://www.w3.org/TR/wai-aria-1.1/#application), and has quite complex [keyboard navigation](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html#kbd_label) requirements. As most end users will not expect application behavior in websites and internal web based systems, (implemented) attributes like `aria-controls` and `aria-labelledby` is sufficient for a good user experience.

### Why does dropdowns not open on hover?
Both touch devices and screen readers will have trouble properly interacting with hoverable interfaces (unless more complex fallback logic is implemented). To achieve a consistent and accessible interface, `<core-toggle>` is designed around click interactions.

### Why is there no group-option to achieve a single open toggle?
Some expand/collapse interfaces like [accordions](https://www.nngroup.com/articles/accordions-complex-content/) behaves like a group - allowing only one expanded area at the time. This pattern however requires more logic and carefully designed animations to avoid confusion over expected scroll position.

*Example: The user first opens "Toggle-1", and then "Toggle-2" (which closes "Toggle-1"). Since "Toggle-1" is placed above, the position "Toggle-2" now changes - potentially outside the viewport on smaller devices.
Note: If you do need to implement grouping, you can achieve this by reacting to the toggle event.*
