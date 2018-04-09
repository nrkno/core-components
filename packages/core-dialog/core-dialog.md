---
name: Dialog
category: Components
---

> `<dialog>` is an element with which the user interacts with to perform some task or decision. `core-dialog` simply adds `dialog` functionality to a specified element (preferably a `<div>`). `core-dialog` supports nestability, keyboard navigation containment and restoring focus when dialog is closed.

```dialog.html
<button data-core-dialog="#my-dialog">Open dialog</button>
<dialog id="my-dialog" class="my-dialog" aria-label="første dialog tittel">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <input type="text" class="my-input" placeholder="Type &quot;C&quot;...">
  <ul class="my-dropdown" hidden>
    <li><button>Chrome</button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
  <button class="docs-button close" data-core-dialog="close">Lukk</button>
  <button class="docs-button" data-core-dialog="#my-dialog-nested">Open an additional dialog</button>
</dialog>
<dialog id="my-dialog-nested" class="my-dialog" aria-label="andre dialog tittel">
  <h2>Another dialog, triggered inside the first dialog</h2>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button class="docs-button close" data-core-dialog="close">Lukk</button>
</dialog>
<div id="docs-react-dialog"></div>
```
```dialog.js
coreDialog('.my-dialog', false)
/*document.addEventListener('dialog.toggle', (event) => {
  console.log('dialog.toggle: ', event)
})*/
coreInput('.my-input')
```
```dialog.jsx

class DialogContainerTest extends React.Component {
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
    console.log('handleToggle: ', event)
    this.setState({open: !event.detail.isOpen})
  }

  render () {
    return (
      <div>
        <button className="docs-button" onClick={this.toggleDialog}>Open dialog jsx</button>
        <Dialog
          className="my-dialog"
          open={this.state.open}
          onToggle={this.handleToggle}
          aria-label="React dialog"
        >
          <h2>{this.state.contentTitle}</h2>
          <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
          <button className="docs-button close" onClick={this.toggleDialog}>Lukk</button>
        </Dialog>
      </div>
    )
  }
}

<DialogContainerTest />
```
```dialog.css

.my-dialog {
  background: #fff;
  border: solid 2px #000;
  padding: 10px;
  margin: 0;
  display: none;
}

.my-dialog[open] {
  display: block;
  position: fixed;
  top: 5%;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  z-index: 10000;
}

.my-dialog + backdrop {
  background: #000;
  opacity: 0.3;
  z-index: 9990;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.my-dialog + backdrop[hidden] {
  display: none;
}
```

## Usage
```html
<!-- Opening a dialog -->
<!-- By setting the data-core-dialog attribute with a reference to an element -->
<!-- we automatically set up a click handler that will open the dialog -->
<!-- Note: you need to initialize core-dialog -->
<button data-core-dialog="#my-dialog">Open dialog</button>
<!-- Closing a dialog -->
<div id="my-dialog">
  <h1>Title of dialog</h1>
  <p>Some content</p>
  <!-- By setting the data-core-dialog attribute to "close" we automatically -->
  <!-- set up a click handler that will close the dialog -->
  <!-- Note: you need to initialize core-dialog -->
  <button data-core-dialog="close">Close dialog</button>
</div>
```
```js
import coreDialog from '@nrk/core-dialog'

// Initialize a specific component or multiple components
coreDialog(String|Element|Elements, { // Accepts a <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" target="
">selector string</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/NodeList" target="_blank">NodeList</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element" target="_blank">Element</a> or array of Elements
  open: null,                       // Defaults to true if open is set, otherwise false. Use true|false to force open state
  label: ''                         // Defaults to aria-label if set or an empty string. Should be implemented in order for the dialog to have a label readable by screen readers
})

// Example:
coreDialog('.my-dialog')
coreDialog('.my-dialog', {open: true, label: 'A super dialog'})
```

```jsx
import Dialog from '@nrk/core-dialog/jsx'

<Dialog
  open={this.props/state.open}
  handleToggle={function(){}}
  ariaLabel="JSX dialog"
>
  <h2>My React/Preact dialog</h2>
  <p>Some content</p>
  <button onClick={closeDialog}></button>
</Dialog>

function closeDialog (event) {
  // change open state/props to false
}
```

## Events

```js
document.addEventListener('dialog.toggle', (event) => {
  event.target                // The dialog container element
  event.detail.willOpen       // The open state that the dialog will get (unless event.preventDefault() is called)
})
```

## FAQ

<details>
  <summary>Why not use `<dialog>` instead?</summary>
  There is currently <a href="https://caniuse.com/#feat=dialog" target="_blank">minimal support</a> for the `<dialog>` element.
  In order to provide a consistent user experience across different platforms and good accessibility, `core-dialog` was created.
  <p>
    For more information about the dialog element visit the <a href="https://www.w3.org/TR/html52/interactive-elements.html#the-dialog-element">W3C HTML 5.2 specification</a>.<br />
    For more information about WAI-ARIA practices for the dialog element visit the <a href="https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal">W3C WAI-ARIA Authoring Practices 1.1</a>
  </p>
</details>
