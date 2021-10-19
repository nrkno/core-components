# Core Progress

> `@nrk/core-progress` is an accessible progress element for displaying linear and radial progresses.

<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script> -->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-progress/core-progress.min.js"></script>
<script src="core-progress/core-progress.jsx.js"></script>
<style>
.my-track { display: block; background: #ccc; border-radius: 3px; overflow: hidden; font: 700 12px/1 sans-serif }
.my-track [value] { background: #16f; color: #fff; padding: 3px 6px; transition: 1s }
.my-track [indeterminate] { animation: indeterminate 2s linear infinite; background: linear-gradient(90deg,#16f 25%, #8bf 50%, #16f 75%) 0/400% }
.my-radial { color: #16f; stroke: #ccc; transition:stroke-dashoffset 1s }
@keyframes indeterminate { to { background-position: 100% 0 } }
</style>
demo-->

## Example


```html
<!--demo-->
<label>
  Progress:
  <span class="my-track">
    <core-progress value=".5"></core-progress>
  </span>
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
        <span className="my-track">
          <CoreProgress value={this.state.value} max={this.state.max} onProgressChange={(state) => this.setState(state)} />
        </span>
      </label>
    }
  }
  ReactDOM.render(<MyProgress />, document.getElementById('jsx-progress'))
</script>
```

```html
<!--demo-->
<label>Indeterminate progress:
  <span class="my-track">
    <core-progress value="Loading..." max="100"></core-progress>
  </span>
</label>
```

```html
<!--demo-->
<label>Radial progress:
  <span style="display:block;width:40px">
    <core-progress type="radial" class="my-radial" value=".75"></core-progress>
  </span>
</label>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-progress  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/9/core-progress/core-progress.min.js"></script>  <!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements) custom elements if needed.


## Usage

### HTML / Javascript

```html
<div class="my-track">
  <core-progress type="{String}"            <!-- Optional. Default "linear". Type of progress. Possible values: "linear" and "radial" -->
                 value="{Number|String}"    <!-- Optional. Default 0. Value progress value. If string, indeterminate is set to true -->
                 max="{Number}"             <!-- Optional. Default 1. Maximum value. Progress percentage is calculated relative to this -->
                 indeterminate="{Boolean}"  <!-- Optional. Set indeterminate value -->
  </core-progress>
</div>
```

```js
import CoreProgress from '@nrk/core-progress'                 // Using NPM
window.customElements.define('core-progress', CoreProgress)   // Using NPM. Replace 'core-progress' with 'my-progress' to namespace

const myProgress = document.querySelector('core-progress')

// Getters
myProgress.type                   // The progress type
myProgress.value                  // The current progress value
myProgress.max                    // The max progress value
myProgress.percentage             // The calculated percentage from (value / max * 100)
myProgress.indeterminate          // True if the progress is indeterminate (no value attribute)
// Setters
myProgress.type = 'radial'        // Set the progress type. Possible values: "linear" and "radial"
myProgress.value = .5             // Set the progress value. If string, indeterminate is set to true
myProgress.max = 10               // Set the max progress value
myProgress.indeterminate = true   // Set indeterminate value
```

### React / Preact

```js
import CoreProgress from '@nrk/core-progress/jsx'

<div className="my-track">
  <CoreProgress type={String}                   // Optional. Default "linear". Type of progress. Possible values: "linear" and "radial"
                value={Number|String}           // Optional. Default 0. Value of progress relative to max. If string, indeterminate is set to true
                max={Number}                    // Optional. Default 1. Maximum value. Progress percentage is calculated relative to this
                indeterminate={Boolean}         // Optional. Set indeterminate value
                ref={(comp) => {}}              // Optional. Get reference to React component
                forwardRef={(el) => {}}         // Optional. Get reference to underlying DOM custom element
                onProgressChange={Function} />  // Optional. Progress change event handler
</div>
```

## Events

### change

Fired when the progress value changes:


```js
document.addEventListener('change', (event) => {
  event.target    // The progress element
})
```

## Styling

For linear progress bars, wrap the `<core-progress>` in a container element that will work as the track
and style it appropriately along with the progress:

```html
<style>
.my-track { /* */ }
.my-track [value] { /* */ }
.my-track [indeterminate] { /* */ }
</style>

<div class="my-track">
  <core-progress value="Loading..." max="100"></core-progress>
</div>
```

For radial progress bars you don't need a wrapper. Use the following properties on the `<core-progress>` element itself
to style track and progress:

Property | Affects | Example
:-- | :-- | :--
`color` | Color of progress | <core-progress type="radial" style="width:30px;color:#00b9f2" value=".3"></core-progress>
`stroke` | Color of track | <core-progress type="radial" style="width:30px;stroke:#ccc" value=".3"></core-progress>
`stroke-width` | Percentage thickness | <core-progress type="radial" style="width:30px;stroke-width:100" value=".3"></core-progress>
