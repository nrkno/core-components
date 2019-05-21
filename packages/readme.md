# Core Components

> A kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) custom element based components. It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.


## Installation

### Using NPM (recommended)
Using NPM provides namespacing of components by letting you
register the custom element under any tag name:

```bash
npm install @nrk/core-datepicker  # Using NPM
```

```js
import CoreDatepicker from '@nrk/core-datepicker'                 // Using NPM
window.customElements.define('core-datepicker', CoreDatepicker)   // Replace 'core-datepicker' with your own tag name

import CoreDatepicker from '@nrk/core-datepicker/jsx'             // Using NPM
<CoreDatepicker ...propsHere></CoreDatepicker>                    // React modules resovles custom tag names under the hood
```

### Using static.nrk.no (avoid)
Using static registers the custom element with its default tag name (i.e. `core-toggle`) automatically:

```html
<script src="https://static.nrk.no/core-components/major/5/core-datepicker/core-datepicker.min.js"></script>
```

### Use the component in your HTML

```html
<core-datepicker days="Man,Tir,Ons,Tor,Fre,Lør,Søn">...</core-datepicker>   <!-- VanillaJS -->
<CoreDatepicker days="Man,Tir,Ons,Tor,Fre,Lør,Søn">...</CoreDatepicker>     <!-- React/Preact -->
```
Read the documentation on each component for more usage, details and examples.


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

  attributeChangedCallback (name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)
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

Note that these functions are optional to extend if your component doesn't require
it in its lifecycle.

## Browser support

* Browsers: IE/Edge 11+ ([with polyfill](https://github.com/webcomponents/custom-elements)), Safari, Firefox, Chrome, Opera
* Screen readers: MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA

## Motivation
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser, screen reader and other existing javascript.

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.

## Testing

Due to the [lack of support for custom elements in jsdom](https://github.com/jsdom/jsdom/issues/1030) you need to use a headless browser environment like [puppeteer](https://github.com/GoogleChrome/puppeteer) to write your unit tests involving core components. Alternatively, it may be possible to [patch the default jsdom environment](https://github.com/jsdom/jsdom/issues/1030#issuecomment-486974452) to support custom elements without resorting the a headless browser, but this is untested.
For an example on how to do it with puppeteer, see [our unit tests](https://github.com/nrkno/core-components/blob/master/packages/core-datepicker/core-datepicker.test.js).
