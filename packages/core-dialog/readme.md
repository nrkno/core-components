# Core Dialog

## `<dialog>` is an element with which the user interacts with to perform some task or decision. `@nrk/core-dialog` simply adds `dialog` functionality to a `<dialog>` if it is not supported (or extends functionality if is supported). `@nrk/core-dialog` supports nestability, keyboard navigation containment and restoring focus when dialog is closed.

---

## Installation

```bash
npm install @nrk/core-dialog --save-exact
```
```js
import coreDialog from '@nrk/core-dialog'     // Vanilla JS
import CoreDialog from '@nrk/core-dialog/jsx' // ...or React/Preact compatible JSX
```

---

<!--demo
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

  .my-dialog + backdrop {
    position: fixed;
    background: rgba(0,0,0,.3);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: .2s;
  }
  .my-dialog:not([open]),
  .my-dialog + backdrop[hidden] {
    pointer-events: none;
    visibility: hidden;
    display: block;
    opacity: 0;
  }
</style>
demo-->

## Demo

```html
<!--demo-->
<button data-core-dialog="my-dialog">Open dialog</button>
<dialog id="my-dialog" class="my-dialog" aria-label="første dialog tittel">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button data-core-dialog="my-dialog-nested">Open an additional dialog</button>
  <button type="button" autofocus style="visibility: hidden">Should not be focusable</button>
  <button type="button" autofocus>Autofocus</button>
  <button data-core-dialog="close">Close</button>
</dialog>
<dialog id="my-dialog-nested" class="my-dialog" aria-label="andre dialog tittel">
  <h1>Another dialog, triggered inside the first dialog</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero.</p>
  <button data-core-dialog="close">Close</button>
</dialog>
<button data-core-dialog="strict-dialog">Open strict dialog</button>
<dialog id="strict-dialog" class="my-dialog" aria-label="første dialog tittel">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button type="button">This button does nothing</button>
  <button data-core-dialog="close">Close</button>
</dialog>
<div id="docs-react-dialog"></div>
<script>
  coreDialog('#my-dialog', {open: false});
  coreDialog('#my-dialog-nested', {open: false});
  coreDialog('#strict-dialog', {open: false, strict: true});
</script>
```

```html
<!--demo-->
<div id="jsx-dialog"></div>
<div id="jsx-dialog-strict"></div>
<script type="text/jsx">
  class DialogContainerDemo extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        open: false,
        contentTitle: 'Dialog for JSX'
      }
      this.toggleDialog = this.toggleDialog.bind(this)
      this.handleToggle = this.handleToggle.bind(this)
    }

    toggleDialog () {
      this.setState({open: !this.state.open})
    }

    handleToggle (event) {
      event.preventDefault()
      this.setState({open: !event.detail.isOpen})
    }

    render () {
      return (
        <div>
          <button onClick={this.toggleDialog}>Open dialog jsx</button>
          <CoreDialog
            className="my-dialog"
            open={this.state.open}
            onToggle={this.handleToggle}
            aria-label="React dialog"
          >
            <h1>{this.state.contentTitle}</h1>
            <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
            <button onClick={this.toggleDialog}>Lukk</button>
          </CoreDialog>
        </div>
      )
    }
  }

  class StrictDialogContainerDemo extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        open: false,
        contentTitle: 'Strict dialog for JSX'
      }
      this.toggleDialog = this.toggleDialog.bind(this)
    }

    toggleDialog () {
      this.setState({open: !this.state.open})
    }

    render () {
      return (
        <div>
          <button data-core-dialog="dialog-jsx">Open strict dialog jsx</button>
          <CoreDialog
            id="dialog-jsx"
            className="my-dialog"
            onToggle={this.handleStrictToggle}
            aria-label="React dialog"
            strict>
            <h1>{this.state.contentTitle}</h1>
            <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
            <button data-core-dialog="close">Lukk</button>
          </CoreDialog>
        </div>
      )
    }
  }

  ReactDOM.render(<DialogContainerDemo />, document.getElementById('jsx-dialog'))
  ReactDOM.render(<StrictDialogContainerDemo />, document.getElementById('jsx-dialog-strict'))
</script>
```

---

## Usage

### HTML / JavaScript

```html
<!-- Opening a dialog -->
<!-- By setting the data-core-dialog attribute with a ID reference to an element -->
<!-- we automatically set up a click handler that will open the dialog -->
<!-- Note: you need to initialize core-dialog -->
<button data-core-dialog="my-dialog">Open dialog</button>
<!-- Closing a dialog -->
<dialog id="my-dialog">
  <h1>Title of dialog</h1>
  <p>Some content</p>
  <!-- By setting the data-core-dialog attribute to "close" we automatically -->
  <!-- set up a click handler that will close the dialog -->
  <!-- Note: you need to initialize core-dialog -->
  <button data-core-dialog="close">Close dialog</button>
</dialog>
```
```js
import coreDialog from '@nrk/core-dialog'

// Initialize a specific component or multiple components
coreDialog(String|Element|Elements, { // Accepts a selector string, NodeList, Element or array of Elements
  open: null,                         // Defaults to true if open is set, otherwise false. Use true|false to force open state
  strict: true|false,                 // Defaults to false. If set to true the dialog will not close on ESC-key nor on click on backdrop
  label: ''                           // Defaults to aria-label if set or an empty string. Should be implemented in order for the dialog to have a label readable by screen readers
})

// Example:
coreDialog('.my-dialog')
coreDialog('.my-dialog', {open: true, label: 'A super dialog'})
```

### React / Preact

```jsx
import CoreDialog from '@nrk/core-dialog/jsx'

<CoreDialog open={true|false} strict={true|false} onToggle={function(){}} aria-label="Title of dialog">
  <h1>My React/Preact dialog</h1>
  <p>Some content</p>
  <button onClick={closeDialog}></button>
</CoreDialog>

function closeDialog (event) {
  // change open state/props to false
}
```

---

## Markup

### Supporting IE9
If you need `@nrk/core-dialog` to support IE9, add the following code in your `<head>` tag:
```
<!--[if IE 9]><script>document.createElement('dialog')</script><![endif]-->
```

### Elements order

Though not strictly required, the `<button>` opening a `@nrk/core-dialog` should be placed directly before the `<dialog>` itself. This eases the mental model for screen reader users.

### Autofocus

If you have form elements inside a `@nrk/core-dialog`, you can optionally add an `autofocus` attribute to the most prominent form element. This helps the user navigate quickly when toggle is opened.

---

## Events

```js
document.addEventListener('dialog.toggle', (event) => {
  event.target                // The dialog container element
  event.detail.isOpen         // The current open state the dialog has
  event.detail.willOpen       // The open state that the dialog will get (unless event.preventDefault() is called)
})
```

---

## Styling

```css
.my-dialog {}                         /* Target dialog in closed state */
.my-dialog[open] {}                   /* Target dialog in open state */
.my-dialog + backdrop {}              /* Target backdrop in open state */
.my-dialog + backdrop[hidden] {}      /* Target backdrop in closed state */
```

**Note** : There is a z-index limit for the backdrop at 2000000000. Do not use higher z-index values in your site in order for `core-dialog` to work properly. The limit exists because some browser extensions, like [ghostery](https://chrome.google.com/webstore/detail/ghostery-%E2%80%93-privacy-ad-blo/mlomiejdfkolichcflejclcbmpeaniij?hl=en) have absurdly high z-indexes. The issue is further explained [here](https://techjunkie.com/maximum-z-index-value).

---

## FAQ
### Why use `<dialog>` when it is not supported by all browsers?
There is currently [minimal support](https://caniuse.com/#feat=dialog) for the `<dialog>` element. However, to ensure best accessibility, `@nrk/core-dialog` uses native functionality whenever possible, and augments with `role="dialog"` as a fallback. For more information about the dialog element visit the [W3C HTML 5.2 specification](https://www.w3.org/TR/html52/interactive-elements.html#the-dialog-element). For more information about WAI-ARIA practices for the dialog element visit the [W3C WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)
