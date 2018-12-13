# Core Progress

> `@nrk/core-progress` enhances the `<progress>` element and makes it universally accessible



## Installation

```bash
npm install @nrk/core-progress --save-exact
```
```js
import coreProgress from '@nrk/core-progress'     // Vanilla JS
import coreProgress from '@nrk/core-progress/jsx' // ...or React/Preact compatible JSX
```



<!--demo
<script src="core-progress/core-progress.min.js"></script>
<script src="core-progress/core-progress.jsx.js"></script>
<style>

</style>
demo-->

## Demo

```html
<!--demo-->
<label>Progress:
  <progress class="my-progress" value="20" max="100"></progress>
</label>
<script>
  // optional: init progress when attributes value or max are not present:
  // coreProgress('.my-progress');
  coreProgress('.my-progress', 50); // update progress
</script>
```

```html
<!--demo-->
<label>Indeterminate progress:
  <progress class="my-indeterminate-progress" max="100"></progress>
</label>
<script>
  // Progress is indeterminate when no value attribute is present.
  coreProgress('.my-indeterminate-progress', 'Loading...');
</script>
```

```html
<!--demo-->
<div id="jsx-progress"></div>
<script type="text/jsx">
  class MyProgress extends React.Component {
    constructor (props) {
      super(props)
      this.state = { value: 50, max: 100 }
    }
    render () {
      return <label> Progress JSX:
        <CoreProgress className="my-jsx-progress" value={this.state.value} max={this.state.max} onChange={(state) => this.setState(state)} />
      </label>
    }
  }
  ReactDOM.render(<MyProgress />, document.getElementById('jsx-progress'))
</script>
```


## Usage

### HTML / Javascript

```html
<label>Progress:
  <progress class="my-progress"></progress>
</label>
```

```js
coreProgress(
  selector, // Selector string or HTML Element
  value // See table below
);
```

### Possible `value`s

Type | Example | Description
:-- | :-- | :--
Integer | `coreProgress(el, 50)` | An integer updates the progress value directly
String | `coreProgress(el, 'Loading...')` | A non-numerical string will indicate that the progress is indeterminate. The same string will be read by screen readers.
Object | `coreProgress(el, {value: 50, max: 100})` | An object can define a value and/or a max value
undefined | `coreProgress(el)` | When no value is passed, the progress element will automatically get pick up values from markup attributes and enhance accessibility.

### React / Preact

```js
import CoreProgress from '@nrk/core-progress/jsx'

<CoreProgress value={Number|String} max={Number} onChange={(event) => {}} />
```



## Events

Before a `@nrk/core-progress` changes state, a `progress.change` event is fired (both for VanillaJS and React/Preact components). The event is cancelable, meaning you can use [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) to cancel the state change. The event also [bubbles](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture), and can therefore be detected both from the progress element itself, or any parent element (read [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)):


```js
document.addEventListener('progress.change', (event) => {
  event.target                  // The progress element
  event.detail.value            // The current progress value
  event.detail.max              // The max progress value
  event.detail.percentage       // The calculated percentage from (value / max * 100)
  event.detail.indeterminate    // True if the progress is indeterminate (no value attribute)
})
```


## Styling

The progress element can be a bit hard to style nicely, but [CSS-tricks](https://css-tricks.com/html5-progress-element/) has some nice tips on how to make it pretty!
*Note: As Internet Explorer 9 does not support `<progress>`, `@nrk/core-progress` instead shows progress as a percentage string.*
