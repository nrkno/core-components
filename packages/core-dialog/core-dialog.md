---
name: Dialog
category: Components
---

> `<dialog>` is an element with which the user interacts with to perform some task or decision. `core-dialog` simply adds `dialog` functionality to a specified element (preferably a `<div>`). `core-dialog` supports nestability, keyboard navigation containment and restoring focus when dialog is closed.

```dialog.html
<button data-dialog="#docs-dialog">Open dialog</button>
<div id="docs-dialog" class="docs-dialog" role="dialog">
  <h1>This is a title</h1>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  
  <button class="docs-button close" data-dialog="close">Lukk</button>
  <button class="docs-button" data-dialog="#docs-dialog-nested">Open an additional dialog</button>
</div>
<div id="docs-dialog-nested" class="docs-dialog">
  <h2>Another dialog, triggered inside the first dialog</h2>
  <p>Nunc mi felis, condimentum quis hendrerit sed, porta eget libero. Aenean scelerisque ex eu nisi varius hendrerit. Suspendisse elementum quis massa at vehicula. Nulla lacinia mi pulvinar, venenatis nisi ut, commodo quam. Praesent egestas mi sit amet quam porttitor, mollis mattis mi rhoncus.</p>
  <button class="docs-button close" data-dialog="close">Lukk</button>
</div>
<div id="docs-react-dialog"></div>
```
```dialog.js
coreDialog('#docs-dialog', {open: false, label: 'første dialog tittel'})
coreDialog('#docs-dialog-nested', {open: false, label: 'andre dialog tittel'})
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
    this.setState({open: event.detail.isOpen})
  }

  render () {
    return (
      <div>
        <button className="docs-button" onClick={this.toggleDialog}>Open dialog jsx</button>
        <Dialog
          className="docs-dialog"
          open={this.state.open}
          handleToggle={this.handleToggle}
          ariaLabel="React dialog"
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


<h3>HTML &mdash; closing dialog</h3>
      <pre class="prettyprint">

</pre>

## Usage
```html
<!-- Opening a dialog -->
<!-- By setting the data-dialog attribute with a reference to an element -->
<!-- we automatically set up a click handler that will open the dialog -->
<!-- Note: you need to initialize core-dialog -->
<button data-dialog="#my-dialog">Open dialog</button>
<!-- Closing a dialog -->
<div id="my-dialog">
  <h1>Title of dialog</h1>
  <p>Some content</p>
  <!-- By setting the data-dialog attribute to "close" we automatically -->
  <!-- set up a click handler that will close the dialog -->
  <!-- Note: you need to initialize core-dialog -->
  <button data-dialog="close">Close dialog</button>
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
