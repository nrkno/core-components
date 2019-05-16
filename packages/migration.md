# Migration guide

> For migrating to custom elements

## Version transition

All packages are rewritten as custom elements in the following version transitions.
This is a breaking update and requires adjustment to new syntax, properties, event names and methods in both VanillaJS and
React versions of the components:

* `@nrk/core-datepicker@2` &rarr; `@nrk/core-datepicker@3`
* `@nrk/core-dialog@1` &rarr; `@nrk/core-dialog@2`
* `@nrk/core-progress@1` &rarr; `@nrk/core-progress@2`
* `@nrk/core-scroll@3` &rarr; `@nrk/core-scroll@4`
* `@nrk/core-tabs@1` &rarr; `@nrk/core-tabs@2`
* `@nrk/core-toggle@2` &rarr; `@nrk/core-toggle@3`
* `@nrk/core-input@1` &rarr; `@nrk/core-suggest@1` (renamed)

We suggest you don't upgrade all components at once, but one at a time. Let's do
`@nrk/core-toggle`:

## Step 1 - Install

First step is to upgrade the version number to the latest major.

### With NPM, use the components' version number:

```sh
npm install @nrk/core-toggle@3  # Using NPM.
```

### With static, use the `major/6` version in the URL:

```html
<script src="https://static.nrk.no/core-components/major/5/core-toggle/core-toggle.min.js"></script>  <!-- Using static -->
```

## Step 2 - Render

Once installed, you need to change your HTML/JS or JSX usage from the old syntax.

### VanillaJS old:

```js
const toggle = document.querySelector('div')
coreToggle(toggle, {
  popup: true // Popup option
})
```

```html
<button>Toggle</button>
<div hidden>...</div>
```

### VanillaJS new:

```js
import CoreToggle from '@nrk/core-toggle'                 // Using NPM
window.customElements.define('core-toggle', CoreToggle)   // Replace 'core-toggle' with your own tag name
```

```html
<button>Toggle</button>
<core-toggle popup hidden>  <!-- Popup option -->
  ...
</core-toggle>
```

---

In React the new markup structure is new the same as VanillaJS, so a change is needed some places:

### JSX old:
```html
<CoreToggle popup>
  <button>Toggle</button>
  <div>Content</div>
</CoreToggle>
```
### JSX new:

```html
<button>Toggle</button>
<CoreToggle popup hidden>
  <div>Content</div>
</CoreToggle>
```

## Step 3 - Usage

Some changes are general for all components in the transition from function calls to custom elements. In particular, React components are now just thin wrappers around the vanilla components so event names and markup is more similar. Still, we encourage you to see the the documentation of each component for all available attributes getters, setters, methods and events. Notable global changes:

Description | Example before | Example after
:-- | :-- | :--
**Options**<br> Options provided to the old VanillaJS components through objects are now element attributes (see `popup` above) and element props. Use element attributes in HTML and use getters, setters and methods in JS to interact with a component. | `coreToggle(el, { popup: true })` | `<core-toggle popup></core-toggle>`
**event.detail**<br> Almost all events in the new version don't provide a `event.detail` object anymore. In those cases read state from `event.target`, which is the component. a component. | `(event) => event.detail.nextDate` | `(event) => event.target.date`
**React event names**<br> Some React event names has changed from `on{EventName}` to the `on{Name}{EventName}` form. This matches the VanillaJS event names 1:1, only with the `on`-prefix and capitalized name. | `<CoreDialog onToggle={}>` | `<CoreDialog onDialogToggle={}>`
**data-attributes**<br> Data attributes using the `core-` prefix are gone. CSS selectors using these (for example `[data-core-dialog]`) in your code may need to be updated. Instead the standard `for` attribute is used widely in the new solution. | `<button data-core-dialog="my-dialog"></button>` | `<button for="my-dialog"></button>`
**Browser support**<br> The new core components no longer supports Internet Explorer versions < 11. See [browser support](?readme.md#browser-support). | IE9+ | IE11+
**Testing**<br> Some changes to testing will be required if your tests involves rendering out a core component. Read more about that in the [main readme](?readme.md#testing).
