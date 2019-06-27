# Core Scroll

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.
> It also hides the scrollbars and automatically disables animation for users who prefers [reduced motion](https://css-tricks.com/introduction-reduced-motion-media-query/).


<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script> -->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-scroll/core-scroll.min.js"></script>
<script src="core-scroll/core-scroll.jsx.js"></script>
<style>
  .my-wrap { overflow: hidden; white-space: nowrap; height: 100%; border: 1px solid }
  .my-wrap-js { height: 200px }
  .my-scroll ul { list-style: none; margin: 0; padding: 0 }
  .my-scroll li,
  .my-scroll > a,
  .my-scroll > div { box-sizing: border-box; display: inline-block; vertical-align: top; width: 30%; height: 90px; padding: 10px; border: 1px solid; margin: 10px; transition: 1s }
</style>
demo-->

## Example

```html
<!--demo-->
<button for="my-scroll-js" value="up" aria-label="Rull opp">&uarr;</button>
<button for="my-scroll-js" value="down" aria-label="Rull ned">&darr;</button>
<br>
<button for="my-scroll-js" value="left" aria-label="Rull til venstre">&larr;</button>
<button for="my-scroll-js" value="right" aria-label="Rull til høyre">&rarr;</button>
<div class="my-wrap my-wrap-js">
  <core-scroll id="my-scroll-js" class="my-scroll">
    <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
    <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
    <br>
    <div>1</div><div><div class="my-wrap">
      <core-scroll class="my-scroll">
        <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
        <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
        <br>
        <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
        <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
        <br>
        <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
        <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
        <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
      </core-scroll>
    </div></div><div>3</div><div>4</div><a href="#">5</a>
    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
    <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
    <br>
    <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
    <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
    <br>
    <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
    <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
  </core-scroll>
</div>
```

<br>

### Example: React

```html
<!--demo-->
<div id="jsx-scroll"></div>
<script type="text/jsx">
  class MyScroll extends React.Component {
    constructor (props) {
      super(props)
      this.state = {}
      this.onScroll = this.onScroll.bind(this)
    }
    onScroll ({target}) {
      this.setState({
        left: target.scrollLeft && (() => target.scroll('left')),
        right: target.scrollRight && (() => target.scroll('right'))
      })
    }
    render () {
      return <div>
        <button disabled={!this.state.left} onClick={this.state.left}>Left JSX</button>
        <button disabled={!this.state.right} onClick={this.state.right}>Right JSX</button>
        <div className="my-wrap">
          <CoreScroll className="my-scroll" onScrollChange={this.onScroll}>
            <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
            <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
            <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
          </CoreScroll>
        </div>
      </div>
    }
  }
  ReactDOM.render(<MyScroll />, document.getElementById('jsx-scroll'))
</script>
```

<br>

### Example: custom child items

`core-scroll` calculates scroll distance based on currently visible direct children. When using substructures like `<ul><li>...` you, must tell `core-scroll` what elements are considered items, by using the `items` attribute/property:

```
<core-scroll items="li">
  <ul>
    <li>List-item 1</li>
    <li>List-item 2</li>
    ...
  </ul>
</core-scroll>
```

```html
<!--demo-->
<button for="my-scroll-child" value="left" aria-label="Rull til venstre">&larr;</button>
<button for="my-scroll-child" value="right" aria-label="Rull til høyre">&rarr;</button>
<div class="my-wrap">
  <core-scroll id="my-scroll-child" class="my-scroll" items="li">
    <ul>
      <li>List-item 1</li><li>List-item 2</li><li>List-item 3</li><li>List-item 4</li>
      <li>List-item 5</li><li>List-item 6</li><li>List-item 7</li><li>List-item 8</li>
      <li>List-item 9</li><li>List-item 10</li><li>List-item 11</li><li>List-item 12</li>
    </ul>
  </core-scroll>
</div>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-scroll  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/6/core-scroll/core-scroll.min.js"></script>  <!-- Using static -->
```

## Usage

Buttons can control a `core-scroll` by targeting its ID and specifying a direction. The `disabled` attribute is automatically added/removed to controller buttons when there is no more pixels to scroll in specified direction. Important: `core-scroll` manipulates styling to hide scrollbars, [see how to work with margin and height &rarr;](#styling)

```html
<button
  for="my-scroll-js"      <!-- {String} Id of <core-scroll> -->
  value="up"              <!-- {String} Sets direction of scroll. Possible values: "left", "right", "up" or "down" -->
  aria-label="Rull opp">  <!-- {String} Sets label -->
  &uarr;
</button>
<core-scroll
  id="my-scroll-js"       <!-- {String} Id corresponding to for attribute of <button> -->
  friction=".2">          <!-- {Number} Optional. Default 0.8. Controls scroll speed. Lower friction means higher speed -->
  <div>1</div>            <!-- Direct children is used to calculate natural stop points for scroll -->
  <div>2</div>
  <div>3</div>
</core-scroll>
```

```js
import CoreScroll from '@nrk/core-scroll'                 // Using NPM
window.customElements.define('core-scroll', CoreScroll)   // Using NPM. Replace 'core-scroll' with 'my-scroll' to namespace

const myScroll = document.querySelector('core-scroll')

// Getters
myScroll.scrollLeft                   // Amount of pixels remaining in scroll direction left
myScroll.scrollRight                  // Amount of pixels remaining in scroll direction right
myScroll.scrollTop                    // Amount of pixels remaining in scroll direction up
myScroll.scrollBottom                 // Amount of pixels remaining in scroll direction down
myScroll.items                        // Get all items

// Setters
myScroll.items                        // Set to String to specify scroll children (see example above)

// Methods
myScroll.scroll('left')               // Scroll in specified direction
myScroll.scroll({x: 0, y: 10})        // Scroll to exact position
myScroll.scroll({x: 0, move: 'down'}) // Scroll with position and direction
```

### React / Preact
```jsx
import CoreScroll from '@nrk/core-scroll/jsx'

<CoreScroll friction={Number}         // Optional. Default 0.8. Controls scroll speed
            onScrollChange={Function} // Optional. Scroll change event handler
            onScrollClick={Function}> // Optional. Scroll click event handler
  {/* elements */}
</CoreScroll>

```

## Events

*Note: Starting a `core-scroll` mousemove inside a iframe, and releasing the mouse outside, will fail to end movement. This is due to `mouseup` not bubbling though iframes. Please avoid iframes.*

### scroll.change

Fired regularly during a scroll. The event is [throttled](https://css-tricks.com/the-difference-between-throttling-and-debouncing/) to run every 500ms and ensure better performance:


```js
document.addEventListener('scroll.change', (event) => {
  event.target   // The scroll element
})
```


### scroll.click

Fired when clicking a button controlling `core-scroll`:


```js
document.addEventListener('scroll.click', (event) => {
  event.target        // The scroll element
  event.detail.move   // Direction to move (left, right, up, down)
})
```

### scroll

[A native event](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) fired for every scrolled pixel. Be cautious about performance when listening to `scroll`; heavy or many read/write operations will slow down your page. The event does not bubble, and you therefore need [`useCapture`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) set to true when listening for `scroll` events from a parent element:

```js
document.addEventListener('scroll', (event) => {
  event.target        // NB: Can be any scrolling element since this is a native event

  // Example check if the event.target is the correct @nrk/core-scoll
  if (event.target.id === 'ID-OF-MY-CORE-SCROLL-HERE') {
    // Do Something
  }
}, true) // Note the true parameter, activating capture listening
```



## Styling

### Scrollbar hiding

`core-scroll` adds negative margins in some browsers to hide scrollbars. Therefore, make sure to place `core-scroll` inside a wrapper element with `overflow: hidden`:

```
<div style="overflow:hidden"><core-scroll>...</core-scroll></div>
```

### Setting height

By default, `core-scroll` scales based on content. If you want to set a fixed height, set this on the wrapper element (not directly on the `core-scroll` element):

✅ Do | 🚫 Don't
:-- | :--
`<div style="overflow:hidden;height:200px"><core-scroll>...</core-scroll></div>` | `<div style="overflow:hidden"><core-scroll style="height:200px"></core-scroll></div>`

### Button states

The `<button>` elements receive `disabled` attributes reflecting the current scroll state:

```css
.my-scroll-button {}                  /* Target button in any state */
.my-scroll-button:disabled {}         /* Target button in disabled state */
.my-scroll-button:not(:disabled) {}   /* Target button in enabled state */
```

### NB: Safari bug
If you are creating a horizontal layout, you might experience unwanted vertical scrolling in Safari. This happens when children of <code>@nrk/core-scroll</code> have half-pixel height values (due to images/videos/elements with aspect-ratio sizing). Avoid the vertical scrolling by setting  <code>padding-bottom: 1px</code> on the <code>@nrk/core-scroll</code> element.
