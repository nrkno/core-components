# Migration guide

> For migrating to custom elements

---

All packages were rewritten as custom elements in the following version transition.
This is a big update and requires adjustment to new syntax, properties, event names and methods in both VanillaJS and
React versions of the components:


* `@nrk/core-datepicker@2` &rarr; `@nrk/core-datepicker@3`
* `@nrk/core-dialog@1` &rarr; `@nrk/core-dialog@2`
* `@nrk/core-progress@1` &rarr; `@nrk/core-progress@2`
* `@nrk/core-scroll@3` &rarr; `@nrk/core-scroll@4`
* `@nrk/core-tabs@1` &rarr; `@nrk/core-tabs@2`
* `@nrk/core-toggle@2` &rarr; `@nrk/core-toggle@3`
* `@nrk/core-input@1` &rarr; `@nrk/core-suggest@1` (renamed)


## Steps

We suggest you don't upgrade all components at once, but one at a time. Let's do
`@nrk/core-toggle`. First step is to upgrade the version number to the latest major.

With NPM, use the components' version number:

```sh
npm install @nrk/core-toggle@3  # Using NPM.
```

With static, use the `major/6` version in the URL:

```html
<script src="https://static.nrk.no/core-components/major/5/core-toggle/core-toggle.min.js"></script>  <!-- Using static -->
```

### Usage

Once installed, you need to change your HTML/JS or JSX usage from the old syntax.

VanillaJS old:

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

VanillaJS new:

```html
<button>Toggle</button>
<core-toggle popup hidden>  <!-- Popup option -->
  ...
</core-toggle>
```


In React the new markup structure is new the same as VanillaJS, so a change is needed some places:

React old:
```html
<CoreToggle popup>
  <button>Toggle</button>
  <div>Content</div>
</CoreToggle>
```
React new:

```html
<button>Toggle</button>
<CoreToggle popup hidden>
  <div>Content</div>
</CoreToggle>
```

### Registering

If you're consuming the component from NPM, you also need to register the element in your JS in order to use it.
This step is done automatically when using static or React components, so not needed in that case:

```js
import CoreToggle from '@nrk/core-toggle'                 // Using NPM
window.customElements.define('core-toggle', CoreToggle)   // Using NPM
```

Suggested now is to replace `'core-datepicker'` with `'my-datepicker'` to effectively namespace your element
and avoid potential naming conflicts in your project with other components with the same name.


### Important changes

- Options provided to the old VanillaJS components through objects are now element attributes (see `popup` above) and element props. Use element attributes in HTML and use getters, setters and methods in JS to interact with a component.

- Almost all events in the new version don't provide a `event.detail` object anymore. In those cases read state from `event.target`,
which is the component.

- Some React event names has changed from `on{EventName}` to the `on{Name}{EventName}` form. This matches the VanillaJS event names 1:1,
only with the `on`-prefix and capitalized name. For example `onToggle` in `@nrk/core-dialog` has changed to `onDialogToggle`.

- React components are now just thin wrappers around the vanilla components - forwarding all props and events from them.
The markup in JSX will now follow the VanillaJS markup, logically. See react example above.

- Data attributes using the `core-` prefix are gone. CSS selectors using these (for example `[data-core-dialog]`)
in your code may need to be updated. Instead the standard `for` attribute is used widely in the new solution.

- The new core components no longer supports Internet Explorer versions < 11. See [browser support](?readme.md#browser-support).


Refer to [the documentation](https://static.nrk.no/core-components/latest/index.html)
for your component for new installation, a list of all available attributes getters, setters, methods and events.


### Testing

Some changes to testing will be required if your tests involves rendering out a core component.
Read more about that in the [main readme](?readme.md#testing).
