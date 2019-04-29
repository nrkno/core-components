# Core Progress

> `@nrk/core-progress` enhances the `<progress>` element and makes it universally accessible



## Installation

```bash
npm install @nrk/core-progress --save-exact
```
```js
import coreProgress from '@nrk/core-progress'     // Vanilla JS
import coreProgress from '@nrk/core-progress/jsx' // React/Preact JSX
```



<!--demo
<script src="core-progress/core-progress.min.js"></script>
<script src="core-progress/core-progress.jsx.js"></script>
<style>
.my-track { background: #ccc; border-radius: 3px; overflow: hidden; font: 700 12px/1 sans-serif }
.my-track [value] { background: #16f; color: #fff; padding: 3px 6px; transition: 1s }
.my-track [indeterminate] { animation: indeterminate 2s linear infinite; background: linear-gradient(90deg,#16f 25%, #8bf 50%, #16f 75%) 0/400% }
.my-radial { stroke-linecap: round }
/*${this.nodeName}::after{content:attr(aria-label)}*/
@keyframes indeterminate { to { background-position: 100% 0 } }
</style>
demo-->

## Demo

```html
<!--demo-->
<label>Progress:
  <div class="my-track">
    <core-progress id="my-progress" value="20" max="100"></core-progress>
  </div>
</label>
<label>Round:
  <div style="width:40px">
    <core-progress type="radial" class="my-radial" value="20" max="100"><hr></core-progress>
  </div>
</label>
<script>
  document.getElementById('my-progress').value = 50 // update progress
</script>
```

```html
<!--demo-->
<label>Indeterminate progress:
  <div class="my-track">
    <core-progress id="my-indeterminate-progress" value="Loading..." max="100"></core-progress>
  </div>
</label>
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
      return <label>Progress JSX:
        <div className="my-track">
          <CoreProgress value={this.state.value} max={this.state.max} onProgressChange={(state) => this.setState(state)} />
        </div>
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
  <div class="my-track">
    <core-progress id="my-progress" value={Number|String} max={Number}></core-progress>
  </div>
</label>
```

```js
TODO
```

### React / Preact

```js
import CoreProgress from '@nrk/core-progress/jsx'

<div className="my-track">
  <CoreProgress value={Number|String} max={Number} onProgressChange={(event) => {}} />
</div>
```



## Events

Before a `@nrk/core-progress` changes state, a `progress.change` event is fired (both for VanillaJS and React/Preact components). The event also [bubbles](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture), and can therefore be detected both from the progress element itself, or any parent element (read [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)):


```js
document.addEventListener('progress.change', (event) => {
  event.target                  // The progress element
  event.target.value            // The current progress value
  event.target.max              // The max progress value
  event.target.percentage       // The calculated percentage from (value / max * 100)
  event.target.indeterminate    // True if the progress is indeterminate (no value attribute)
})
```

## Styling

TODO
