# Core Components

> `@nrk/core-components` is a kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components. It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.


## Installation

Install components from NPM. Using NPM provides namespacing of components by letting you
register the custom element under any tag name and adding the possibility to add more functionality to
your component by extending it. Recommended for apps and widgets:

```bash
npm install @nrk/core-datepicker  # Using NPM
```

Alternatively, install components from static.
Using static registers the custom element with default tag name automatically. Recommended for apps:

```html
<script src="https://static.nrk.no/core-components/major/1/core-datepicker/core-datepicker.min.js"></script>  <!-- Using static -->
```

VanillaJS components installed from NPM needs to be registered globally so your browser
will know about it before usage.

```js
import CoreDatepicker from '@nrk/core-datepicker'                 // Using NPM
window.customElements.define('core-datepicker', CoreDatepicker)   // Set to 'my-datepicker' for own namespace
```

Then, use the component in your HTML:

```html
<core-datepicker days="Man,Tir,Ons,Tor,Fre,Lør,Søn">...</core-datepicker>
```
Read the documentation for each component for usage and more.


## Extending

Making a new custom element extending a core component with new functionality is done easily.
Create a new class `MyToggle` that extends the component you want using the following skeleton:

```js
import CoreToggle from '@nrk/core-toggle'

class MyToggle extends CoreToggle {
  static get observedAttributes () {
    // Observe parent attributes + new attributes
    return super.observedAttributes.concat(['foo'])
  }

  connectedCallback() {
    super.connectedCallback()
    // Your connect code here...
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    // Your disconnect code here...
  }

  attributeChangedCallback (...args) {
    super.attributeChangedCallback(...args)
    // Your attribute change code here...
  }

  handleEvent(event) {
    super.handleEvent(event)
    // Your event handler here...
  }
}

// Register your custom element
window.customElements.define('my-toggle', MyToggle)
```

## Motivation
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser (IE/Edge 11+, Safari, Firefox, Chrome, Opera), screen reader (MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA) and other existing javascript.

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.
