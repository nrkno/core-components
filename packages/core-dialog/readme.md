# Core Dialog

> `@nrk/core-dialog` is an elevated element with which the user interacts with to perform some task or decision.
> It supports nestability, keyboard navigation containment and restoring focus when dialog is closed.


<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script>-->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-dialog/core-dialog.min.js"></script>
<script src="core-dialog/core-dialog.jsx.js"></script>
<style>
  .my-dialog h1 { margin-top: 0 }
  .my-dialog {
    position: absolute;
    margin: auto;
    top: 5%;
    left: 0;
    right: 0;
    border: 0;
    padding: 2em;
    width: 100%;
    max-width: 300px;
    background: #fff;
    transition: .2s;
  }

  .my-dialog + backdrop,
  .my-backdrop {
    position: fixed;
    background: rgba(0,0,0,.3);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: .2s;
  }
  .my-dialog[hidden],
  .my-dialog + backdrop[hidden],
  .my-backdrop[hidden] {
    pointer-events: none;
    visibility: hidden;
    display: block;
    opacity: 0;
  }
</style>
demo-->

## Examples (plain JS)
#### Nested dialog

```html
<!--demo-->
<button data-for="my-dialog" type="button">Open dialog</button>
<core-dialog id="my-dialog" class="my-dialog" aria-label="first dialog title" hidden>
  <h1>Dialog title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <label>
    <small>Label for autofocused input</small>
    <input type="text" autofocus placeholder="Input with autofocus">
  </label>
  <br>
  <br>
  <button data-for="close" type="button">Close</button>
  <button data-for="my-dialog-nested" type="button">Open an additional dialog</button>
  <core-dialog id="my-dialog-nested" class="my-dialog" aria-label="other dialog title" hidden>
    <h1>Another dialog, triggered inside the first dialog</h1>
    <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero.</p>
    <button data-for="close" type="button">Close</button>
  </core-dialog>
</core-dialog>
```
#### Strict dialog

```html
<!--demo-->
<button data-for="strict-dialog">Open strict dialog</button>
<core-dialog id="strict-dialog" class="my-dialog" aria-label="strict dialog title" hidden strict>
  <h1>Strict dialog title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button type="button">This button does nothing</button>
  <button data-for="close" type="button">Close</button>
</core-dialog>
```
#### Modal dialog

```html
<!--demo-->
<button data-for="modal-dialog">Open dialog without backdrop</button>
<core-dialog id="modal-dialog" class="my-dialog" aria-label="modal dialog title" hidden backdrop="off">
  <h1>Dialog without backdrop</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button data-for="close">Close</button>
</core-dialog>
```
#### Custom backdrop

```html
<!--demo-->
<button data-for="modal-custom">Open dialog with custom backdrop</button>
<core-dialog id="modal-custom" class="my-dialog" aria-label="modal dialog title" hidden backdrop="back-custom">
  <h1>Dialog title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button data-for="close">Close</button>
</core-dialog>
<div id="back-custom" class="my-backdrop" style="background:rgba(0,0,50,.8)" hidden></div>
```
#### Preventing overscroll

Prevent scrolling the background when scrolling inside a scrollable element inside the dialog by setting `overscroll-behavior: contain` on the dialog-element.

Note that `overscroll-behavior` is only supported through enabling experimental features in Safari and Safari on iOS ([caniuse](https://caniuse.com/?search=overscroll-behavior)).

Read [this](https://ishadeed.com/article/prevent-scroll-chaining-overscroll-behavior/) if you want a primer on how `overscroll-behavior` works.

```html
<!--demo-->
<button data-for="overscroll-dialog">Open scrollable dialog</button>
<core-dialog id="overscroll-dialog" class="my-dialog" aria-label="Scrollable dialog title" hidden style="overscroll-behavior: contain">
  <h1>Scrollable dialog title</h1>
  <p style="max-height: 100px;overflow: scroll;border: 1px solid gray;">
    Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
  </p>
  <p style="max-height: 100px;overflow: scroll;border: 1px solid gray;">
    Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
  </p>
  <button data-for="close" type="button">Close</button>
</core-dialog>
```

## Examples (React)
#### Class component

```html
<!--demo-->
<div id="jsx-dialog"></div>
<script type="text/jsx">
  class DialogContainerDemo extends React.Component {
    constructor (props) {
      super(props)
      this.state = { hidden: true }
      this.toggleDialog = this.toggleDialog.bind(this)
      this.handleToggle = this.handleToggle.bind(this)
    }

    toggleDialog () {
      this.setState({ hidden: !this.state.hidden })
    }

    handleToggle (event) {
      this.setState({ hidden: event.target.hidden })
    }

    render () {
      return (
        <>
          <button onClick={this.toggleDialog} type="button">Open React dialog</button>
          <CoreDialog
            className="my-dialog"
            hidden={this.state.hidden}
            onDialogToggle={this.handleToggle}
            aria-label="React dialog"
          >
            <h1>Dialog for JSX</h1>
            <p>
              Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
            </p>
            <button onClick={this.toggleDialog} type="button">Lukk</button>
          </CoreDialog>
        </>
      )
    }
  }

  ReactDOM.render(<DialogContainerDemo />, document.getElementById('jsx-dialog'))
</script>
```

#### Strict dialog

```html
<!--demo-->
<div id="jsx-dialog-strict"></div>
<script type="text/jsx">
  ReactDOM.render(
    <>
      <button data-for="dialog-strict-jsx" type="button">Open strict React dialog</button>
      <CoreDialog
        id="dialog-strict-jsx"
        className="my-dialog"
        aria-label="Strict React dialog"
        hidden
        strict
      >
        <h1>Strict dialog for JSX</h1>
        <p>
          Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
        </p>
        <button data-for="close" type="button">Lukk</button>
      </CoreDialog>
    </>,
    document.getElementById('jsx-dialog-strict')
  )
</script>
```

#### No backdrop

```html
<!--demo-->
<div id="jsx-dialog-no-backdrop"></div>
<script type="text/jsx">
  ReactDOM.render(
    <>
      <button data-for="dialog-no-back-jsx" type="button">Open React dialog without backdrop</button>
      <CoreDialog
        id="dialog-no-back-jsx"
        className="my-dialog"
        aria-label="React dialog without backdrop"
        backdrop="off"
        hidden
      >
        <h1>React dialog without backdrop</h1>
        <p>
          Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
        </p>
        <button data-for="close" type="button">Lukk</button>
      </CoreDialog>
    </>,
    document.getElementById('jsx-dialog-no-backdrop')
  )
</script>
```
#### Custom backdrop

**NB!** Do not wrap `CoreDialog` with custom backdrop as direct children of React.Fragments (instead, wrap in a block element like `<div>`), to ensure access to the backdrop element on mount.

```html
<!--demo-->
<div id="jsx-dialog-custom"></div>
<script type="text/jsx">
  ReactDOM.render(
    <div>
      <button data-for="dialog-cust-jsx" type="button">Open React dialog with custom backdrop</button>
      <CoreDialog
        id="dialog-cust-jsx"
        className="my-dialog"
        aria-label="React dialog with custom backdrop"
        backdrop="custom-backdrop-jsx"
        hidden
      >
        <h1>React dialog with custom backdrop</h1>
        <p>
          Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.
        </p>
        <button data-for="close" type="button">Lukk</button>
      </CoreDialog>
      <div
        id="custom-backdrop-jsx"
        className="my-backdrop"
        style={{background:'rgba(0,0,50,.8)'}}
        hidden
      ></div>
    </div>,
    document.getElementById('jsx-dialog-custom')
  )
</script>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-dialog  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/9/core-dialog/core-dialog.min.js"></script>  <!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements) custom elements if needed.


## Usage

### HTML / JavaScript

```html
<button data-for="my-dialog">Open</button>    <!-- Opens dialog with id="my-dialog" -->
<core-dialog id="my-dialog"
             hidden                      <!-- Hide dialog by default -->
             strict                      <!-- Optional. If set, prevents the dialog from closing on ESC-key and on backdrop click -->
             backdrop="{on|off|String}"  <!-- Optional. Default is "on" and will use standard backdrop. "off" disables backdrop and string ID points to custom backdrop element -->
             aria-label="{String}">      <!-- Optional. Is read by screen readers -->
  <h1>Title of dialog</h1>
  <p>Some content</p>
  <button data-for="close">Close dialog</button>   <!-- Closes dialog when data-for="close" -->
</core-dialog>
```

```js
import CoreDialog from '@nrk/core-dialog'                 // Using NPM
window.customElements.define('core-dialog', CoreDialog)   // Using NPM. Replace 'core-dialog' with 'my-dialog' to namespace

const myDialog = document.querySelector('core-dialog')

// Getters
myDialog.hidden         // True if hidden
myDialog.strict         // True if strict
myDialog.backdrop       // Get backdrop element (if enabled) (see "Markup" for more info)

// Setters
myDialog.hidden = false // Open dialog
myDialog.strict = false // Set strict mode. If set, prevents the dialog from closing on ESC-key and on backdrop click
myDialog.backdrop = 'on' | 'off' | 'my-drop' // Set "on"/"off" to enable/disable standard backdrop or string ID to point to custom backdrop element
myDialog.style.zIndex = '9' // Set z-index manually. If unset, z-index is automatically set for both dialog and backdrop element. Default unset.

// Methods
myDialog.close()        // Close dialog
myDialog.show()         // Open dialog
```

### React / Preact

```jsx
import CoreDialog from '@nrk/core-dialog/jsx'

<button data-for="my-dialog">Open</button>    // Opens dialog with id="my-dialog"
<CoreDialog id="my-dialog"
            hidden                            // Hide dialog by default
            strict                            // Optional. If set, prevents the dialog from closing on ESC-key and on backdrop click
            backdrop={Boolean|String}         // Optional. If false, disables backdrop, string ID points to custom backdrop element
            aria-label={String}               // Optional. Is read by screen readers
            ref={(comp) => {}}                // Optional. Get reference to React component
            forwardRef={(el) => {}}           // Optional. Get reference to underlying DOM custom element
            onDialogToggle={Function}>        // Optional. Toggle event handler. See event 'dialog.toggle'
  <h1>My React/Preact dialog</h1>
  <p>Some content</p>
  <button data-for="close"></button>          // Closes dialog when data-for="close"
</CoreDialog>
```



## Markup

### Required focusable element

Your dialog must contain a tabbable element (e.g. visible `<input>`, `<button>`, `<select>`, `<textarea>`, `<a>`, `<summary>`, `<audio>`, `<video>`, `<iframe>`, `<area>` or with the `contenteditable` or `draggable` attributes) or a focusable element (with `tabindex="-1"`) to ensure the users focus is navigated into the `<core-dialog>`.
As a best practice; if your dialog contains a form element, use `autofocus`.
If you dialog is without form elements, start your dialog
content with `<h1 tabindex="-1">Dialog title</h1>`.

### Elements order

Though not strictly required, the `<button>` opening a dialog should be placed directly before the `<core-dialog>` itself. This eases the mental model for screen reader users. Othewise, use `<button data-for="my-dialog-id"></button>`.

### Backdrop

`core-dialog` automatically creates a `<backdrop>` element as next adjacent sibling if needed. If the `backdrop` attribute is set to an `id` (something else than `true|false`), the element with the corresponding ID will be used as backdrop. Note that a backdrop is needed to enable click-outside-to-close. Custom backdrop example:

```html
<core-dialog backdrop="my-backdrop"></core-dialog>
<div id="my-backdrop"></div>
```

## Stacking

To manually control z-index of dialogs (and their corresponding backdrop element, set z-index from either HTML, CSS or JS. When set, the dialog will not try to place itself automatically over the topmost dialog and you are responsible for stacking order.

For example:

```html
<style>
  .my-dialog { z-index: 100 }
  .my-backdrop { z-index: 90 }
</style>

<script>
  myDialog.style.zIndex = 100
  myBackdrop.style.zIndex = 90
</script>

<core-dialog style="z-index: 100" hidden>...</core-dialog>
<backdrop style="z-index: 90" hidden>...</backdrop>
```

## Events

### dialog.toggle

Fired when a dialog is toggled:

```js
document.addEventListener('dialog.toggle', (event) => {
  event.target    // The dialog element
})
```

## Styling

```css
.my-dialog {}                         /* Target dialog in any state */
.my-dialog[hidden] {}                 /* Target dialog in closed state */
.my-dialog:not([hidden]) {}           /* Target dialog in open state */
.my-dialog + backdrop {}              /* Target backdrop in open state */
.my-dialog + backdrop[hidden] {}      /* Target backdrop in closed state */
```

**Note:** There is a z-index limit for the backdrop at 2000000000. Do not use higher z-index values in your site in order for `core-dialog` to work properly. The limit exists because some browser extensions, like [ghostery](https://chrome.google.com/webstore/detail/ghostery-%E2%80%93-privacy-ad-blo/mlomiejdfkolichcflejclcbmpeaniij?hl=en) have absurdly high z-indexes. The issue is further explained [here](https://techjunkie.com/maximum-z-index-value).
