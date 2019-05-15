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
Using static registers the custom element with its default tag name automatically. Recommended for apps:

```html
<script src="https://static.nrk.no/core-components/major/5/core-datepicker/core-datepicker.min.js"></script>  <!-- Using static -->
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

## Migration

The following packages were rewritten as custom elements in the version transition:

* `@nrk/core-datepicker@2` &rarr; `@nrk/core-datepicker@3`
* `@nrk/core-dialog@1` &rarr; `@nrk/core-dialog@2`
* `@nrk/core-progress@1` &rarr; `@nrk/core-progress@2`
* `@nrk/core-scroll@3` &rarr; `@nrk/core-scroll@4`
* `@nrk/core-tabs@1` &rarr; `@nrk/core-tabs@2`
* `@nrk/core-toggle@2` &rarr; `@nrk/core-toggle@3`
* `@nrk/core-input@1` &rarr; `@nrk/core-suggest@1` (renamed)

To migrate to new version, you need to adjust to new syntax, properties and methods in VanillaJS and React. Simply upgrade your component's version number to the latest major using NPM `npm install @nrk/core-toggle@3` or using `major/6` monorepo version from static.

Once installed, you need to change your HTML and JS from old syntax:

```html
<button>Toggle</button>
<div hidden>...</div>
<script>
  const toggle = document.querySelector('div')
  coreToggle(toggle, {
    popup: true       // Popup option
  })
</script>
```

to new custom element syntax:

```html
<button>Toggle</button>
<core-toggle popup hidden>  <!-- Popup option -->
  ...
</core-toggle>
```
If you're consuming the component from NPM, you also need to register the element in order to use it .
This step is done automatically when using static:
```js
import CoreToggle from '@nrk/core-toggle'                 // Using NPM
window.customElements.define('core-toggle', CoreToggle)   // Using NPM
```
React syntax remains more or less the same and some props are changed.
Most options provided to the old VanillaJS components are now plain element attributes (see `popup` above). Refer to [the documentation](https://static.nrk.no/core-components/latest/index.html)
for your component to for a list of getters, setters, methods and events.

## Testing

Due to the [lack of support for custom elements in jsdom](https://github.com/jsdom/jsdom/issues/1030) you need to use a headless browser environment like [puppeteer](https://github.com/GoogleChrome/puppeteer) to write your unit tests involving core components. Alternatively, it may be possible to [patch the default jsdom environment](https://github.com/jsdom/jsdom/issues/1030#issuecomment-486974452) to support custom elements without resorting the a headless browser, but this is untested.
For an example on how to do it with puppeteer, see [our unit tests](https://github.com/nrkno/core-components/blob/master/packages/core-datepicker/core-datepicker.test.js).


## Motivation
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser (IE/Edge 11+, Safari, Firefox, Chrome, Opera), screen reader (MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA) and other existing javascript.

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.
