# Core Components

> A kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components.
> It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.


## Installation

Install components from NPM. This provides possibility to namespace the custom element by letting you
register it under own tag name. Recommended:

```bash
npm install @nrk/core-datepicker  # Using NPM
```

Alternatively, install components from static.
Using static registers the custom element with its default tag name automatically:

```html
<script src="https://static.nrk.no/core-components/major/5/core-datepicker/core-datepicker.min.js"></script>  <!-- Using static -->
```

Custom elements needs to be registered once globally so your browser will know about it before usage.  This step is done automatically when installing from static or using React components:

```js
import CoreDatepicker from '@nrk/core-datepicker'                 // Using NPM
window.customElements.define('core-datepicker', CoreDatepicker)   // Using NPM. Replace 'core-datepicker' with 'my-datepicker' to namespace
```

Then, the component is ready to be used in your markup:

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


## Testing

Due to the [lack of support for custom elements in jsdom](https://github.com/jsdom/jsdom/issues/1030) you need to use a headless browser environment like [puppeteer](https://github.com/GoogleChrome/puppeteer) to write your unit tests involving core components. Alternatively, it may be possible to [patch the default jsdom environment](https://github.com/jsdom/jsdom/issues/1030#issuecomment-486974452) to support custom elements without resorting the a headless browser, but this is untested.
For an example on how to do it with puppeteer, see [our unit tests](https://github.com/nrkno/core-components/blob/master/packages/core-datepicker/core-datepicker.test.js).

## Browser support

* Browsers: IE/Edge 11+, Safari, Firefox, Chrome, Opera
* Screen readers: MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA

## Motivation
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser, screen reader and other existing javascript.

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.
