# Core Components

> A kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) custom element based components. It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.


## Getting started

### Installation

The recommended way to install a core component is using NPM.
Using NPM provides namespacing of components by letting you
register the custom element under any tag name to avoid name conflicts:

```bash
npm install @nrk/core-datepicker  # Using NPM
```

You can also install using static. This is not recommended as it registers the
custom element with its default tag name (i.e. `core-toggle`) automatically on load,
potentially resulting in name conflicts later on:

```html
<script src="https://static.nrk.no/core-components/major/7/core-datepicker/core-datepicker.min.js"></script>  <!-- Using static -->
```

### Usage

After installation, import your component and register it a custom element before using it in
your markup. Registering is also done automatically for React components:


```js
import CoreDatepicker from '@nrk/core-datepicker'                 // Using NPM. VanillaJS. Need to be registered
import CoreDatepicker from '@nrk/core-datepicker/jsx'             // Using NPM. React/Preact. Automatically registers itself
window.customElements.define('core-datepicker', CoreDatepicker)   // Register element. Replace 'core-datepicker' with your own tag name
```

```html
<core-datepicker days="Man,Tir,Ons,Tor,Fre,Lør,Søn">...</core-datepicker>   <!-- VanillaJS HTML -->
<CoreDatepicker days="Man,Tir,Ons,Tor,Fre,Lør,Søn">...</CoreDatepicker>     <!-- React/Preact JSX -->
```
Remember to read the documentation on each component for more usage, details and examples.

## Motivation

Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser, screen reader and other existing javascript.

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.


## Browser support

* Browsers: Internet Explorer 11+, Edge 15+, Safari 9+, Firefox?, Chrome 46, Opera?
* Screen readers: MacOS/iOS: VoiceOver, Android: TalkBack, Windows: JAWS/NVDA

For Internet Explorer and older Edge browsers you need a [polyfill](https://github.com/webcomponents/custom-elements) for the custom elements spec.


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

  connectedCallback () {
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

  handleEvent (event) {
    super.handleEvent(event)
    // Your event handler here...
  }
}

// Register your custom element
window.customElements.define('my-toggle', MyToggle)
```

Note that these functions are optional to extend if your component doesn't require
it in its lifecycle. Read more about [using custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) on MDN.


## Testing

Due to the [lack of support for custom elements in jsdom](https://github.com/jsdom/jsdom/issues/1030) you need to use a headless browser environment like [puppeteer](https://github.com/GoogleChrome/puppeteer) or [protractor](https://www.protractortest.org/) to write your unit tests involving core components. For an example on how to do it with protractor, see [our unit tests](https://github.com/nrkno/core-components/blob/master/packages/core-datepicker/core-datepicker.test.js).
