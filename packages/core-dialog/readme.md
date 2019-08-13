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

## Example

```html
<!--demo-->
<!-- Normal -->
<button for="my-dialog">Open dialog</button>
<core-dialog id="my-dialog" class="my-dialog" aria-label="first dialog title" hidden>
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button for="my-dialog-nested">Open an additional dialog</button>
  <button type="button" autofocus style="visibility: hidden">Should not be focusable</button>
  <button type="button" autofocus>Autofocus</button>
  <button for="close">Close</button>
  <core-dialog id="my-dialog-nested" class="my-dialog" aria-label="other dialog title" hidden>
    <h1>Another dialog, triggered inside the first dialog</h1>
    <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero.</p>
    <button for="close">Close</button>
  </core-dialog>
</core-dialog>

<!-- Strict -->
<button for="strict-dialog">Open strict dialog</button>
<core-dialog id="strict-dialog" class="my-dialog" aria-label="strict dialog title" hidden strict>
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button type="button">This button does nothing</button>
  <button for="close">Close</button>
</core-dialog>

<!-- Modal -->
<button for="modal-dialog">Open modal dialog</button>
<core-dialog id="modal-dialog" class="my-dialog" aria-label="modal dialog title" hidden backdrop="false">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button for="close">Close</button>
</core-dialog>

<!-- Custom backdrop -->
<button for="modal-custom">Open dialog with custom backdrop</button>
<core-dialog id="modal-custom" class="my-dialog" aria-label="modal dialog title" hidden backdrop="back-custom">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button for="close">Close</button>
</core-dialog>
<div id="back-custom" class="my-backdrop" style="background:rgba(0,0,50,.8)" hidden></div>
```

```html
<!--demo-->
<div id="jsx-dialog"></div>
<div id="jsx-dialog-strict"></div>
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
        <div>
          <button onClick={this.toggleDialog}>Open dialog jsx</button>
          <CoreDialog
            className="my-dialog"
            hidden={this.state.hidden}
            onDialogToggle={this.handleToggle}
            aria-label="React dialog">
            <h1>Dialog for JSX</h1>
            <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
            <button onClick={this.toggleDialog}>Lukk</button>
          </CoreDialog>
        </div>
      )
    }
  }

  ReactDOM.render(<DialogContainerDemo />, document.getElementById('jsx-dialog'))
  ReactDOM.render(<div>
    <button for="dialog-jsx">Open strict dialog jsx</button>
    <CoreDialog id="dialog-jsx" className="my-dialog" aria-label="React dialog" hidden strict backdrop>
      <h1>Strict dialog for JSX</h1>
      <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
      <button for="close">Lukk</button>
    </CoreDialog>
    <br />
    <button for="dialog-cust">Open no backdrop</button>
    <CoreDialog id="dialog-cust" className="my-dialog" aria-label="React dialog without backdrop" backdrop={false} hidden>
      <h1>Strict dialog for JSX</h1>
      <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
      <button for="close">Lukk</button>
    </CoreDialog>
  </div>, document.getElementById('jsx-dialog-strict'))
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
<script src="https://static.nrk.no/core-components/major/7/core-dialog/core-dialog.min.js"></script>  <!-- Using static -->
```


## Usage

### HTML / JavaScript

```html
<button for="my-dialog">Open</button>  <!-- Opens dialog with id="my-dialog" -->
<core-dialog id="my-dialog"
             hidden                    <!-- Hide dialog by default -->
             strict                    <!-- Optional. If true, prevents the dialog from closing on ESC-key and on backdrop click -->
             backdrop="{false|ID}"     <!-- Optional. false disables backdrop, ID points to backdrop element -->
             aria-label="{String}">    <!-- Optional. Is read by screen readers -->
  <h1>Title of dialog</h1>
  <p>Some content</p>
  <button for="close">Close dialog</button>   <!-- Closes dialog when for="close" -->
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
myDialog.strict = false // Set strict mode
myDialog.backdrop = false | true | id // Set to disable/enable backdrop

// Methods
myDialog.close()        // Close dialog
myDialog.show()         // Open dialog
```

### React / Preact

```jsx
import CoreDialog from '@nrk/core-dialog/jsx'

<button for="my-dialog">Open</button>         // Opens dialog with id="my-dialog"
<CoreDialog id="my-dialog"
            hidden                            // Hide dialog by default
            strict                            // Optional. If true, prevents the dialog from closing on ESC-key and on backdrop click
            backdrop={false}                  // Optional. Set to disable backdrop
            aria-label={String}               // Optional. Is read by screen readers
            onDialogToggle={Function}>        // Optional. Toggle event handler. See event 'dialog.toggle'
  <h1>My React/Preact dialog</h1>
  <p>Some content</p>
  <button for="close"></button>               // Closes dialog when for="close"
</CoreDialog>
```



## Markup

### Required focusable element

Your dialog must contain `<input>`, `<button>`, `<select>`, `<textarea>`, `<a>`
or element with `tabindex="-1"` to ensure the user is navigated into the `<core-dialog>`.
As a best practice; if your dialog contains a form element, use `autofocus`.
If you dialog is without form elements, start your dialog
content with `<h1 tabindex="-1">Dialog title</h1>`.

### Elements order

Though not strictly required, the `<button>` opening a dialog should be placed directly before the `<core-dialog>` itself. This eases the mental model for screen reader users.

### Backdrop

`core-dialog` automatically creates a `<backdrop>` element as next adjacent sibling if needed. If the `backdrop` attribute is set to an `id` (somehting else than `true|false`), the element with the corresponding ID will be used as backdrop. Note that a backdrop is needed to enable click-outside-to-close. Custom backdrop example:
```
<core-dialog backdrop="my-backdrop"></core-dialog>
<div id="my-backdrop"></div>
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
