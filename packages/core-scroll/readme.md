# Core Scroll

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices. `core-scroll` also hides the scrollbars and automatically disables animation for users who prefers [reduced motion](https://css-tricks.com/introduction-reduced-motion-media-query/).

## Installation

```bash
npm install @nrk/core-scroll
```
```js
import CoreScroll from '@nrk/core-scroll'     // Vanilla JS
import CoreScroll from '@nrk/core-scroll/jsx' // React/Preact JSX
```

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
  .my-scroll > * { box-sizing: border-box; display: inline-block; vertical-align: top; width: 30%; height: 90px; padding: 10px; border: 1px solid; margin: 10px; transition: 1s }
</style>
demo-->

## Demo

```html
<!--demo-->
<button data-core-scroll="my-scroll-js" value="up" aria-label="Rull opp">&uarr;</button>
<button data-core-scroll="my-scroll-js" value="down" aria-label="Rull ned">&darr;</button>
<br>
<button data-core-scroll="my-scroll-js" value="left" aria-label="Rull til venstre">&larr;</button>
<button data-core-scroll="my-scroll-js" value="right" aria-label="Rull til høyre">&rarr;</button>
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
    onScroll ({detail, target}) {
      this.setState({
        left: detail.left && (() => target.scroll('left')),
        right: detail.right && (() => target.scroll('right'))
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



## Usage

Scroll speed is controlled by `friction` rather than `duration` (a short scroll distance will have a shorter duration and vice versa) for a more natural feeling of motion. Buttons can control a `core-scroll` by targeting its ID and specifying a direction; `left|right|up|down`. The `disabled` is automatically added/removed to controller buttons when there is no more pixels to scroll in specified direction. Important: `@nrk/core-scroll` manipulates styling to hide scrollbars, [see how to work with margin and height &rarr;](#styling)

### HTML / JavaScript
```html
<button data-core-scroll="my-scroll-js" value="up" aria-label="Rull opp">&uarr;</button>
<core-scroll id="my-scroll-js">
  <!-- Direct children is used to calculate natural stop points for scroll -->
  <div>1</div>
  <div>2</div>
  <div>3</div>
</core-scroll>
```
```js
import coreScroll from '@nrk/core-scroll'

coreScroll(String|Element|Elements)  // Accepts a selector string, NodeList, Element or array of Elements,
coreScroll(String|Element|Elements, 'right'|'left'|'up'|'down') // Optionally pass a second argument to cause scroll
coreScroll(String|Element|Elements, {                           // Or pass a object
  move: 'right'|'left'|'up'|'down',    // Optional. Scroll a direction
  x: Number,                           // Optional. The scrollLeft
  y: Number,                           // Optional. The scrollTop
  friction: 0.8,                       // Optional. Changes scroll speed. Defaults to 0.8
})
coreScroll(String|Element|Elements, '') // Optionally send in a third argument to customize the debounce rate of the resize event and the throttle rate of the scroll event
```

### React / Preact
```jsx
import CoreScroll from '@nrk/core-scroll/jsx'

<CoreScroll onChange={(state) => {}}>
  {/* elements */}
</CoreScroll>


// state parameter in the onChange event has the following structure:
state = {
  scrollUp: Function|null,
  scrollDown: Function|null,
  scrollLeft: Function|null,
  scrollRight: Function|null
}
// These properties are functions that the user can access in order to provide
// buttons that scroll up/down/left/right. When the prop is set to null, it indicates
// that it is not possible to scroll further in that given direction.

```



## Events

### scroll.change
`'scroll.change'` is fired regularly during a scroll. The event is [throttled](https://css-tricks.com/the-difference-between-throttling-and-debouncing/) to run every 500ms and ensure better performance. The event bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):


```js
document.addEventListener('scroll.change', (event) => {
  event.target        // The core-scroll element triggering scroll.change event
  event.detail.left   // Amount of pixels remaining in scroll direction left
  event.detail.right  // Amount of pixels remaining in scroll direction right
  event.detail.up     // Amount of pixels remaining in scroll direction up
  event.detail.down   // Amount of pixels remaining in scroll direction down
})
```


### scroll.click
`'scroll.click'` is fired when clicking a button controlling `@nrk/core-scroll`. The event bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):


```js
document.addEventListener('scroll.click', (event) => {
  event.target        // The core-scroll element triggering scroll.change event
  event.detail.move   // Direction to move (left, right, up, down)
})
```

### scroll
`'scroll'` [is a native event](https://developer.mozilla.org/en-US/docs/Web/Events/scroll) fired for every scrolled pixel. Be cautious about performance when listening to `scroll`; heavy or many read/write operations will slow down your page. The event does not bubble, and you therefore need [`useCapture`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) set to true when listening for `scroll` events from a parent element:

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

`@nrk/core-scroll` adds negative margins in some browsers to hide scrollbars. Therefore, make sure to place `@nrk/core-scroll` inside a wrapper element with `overflow: hidden`:

```
<div style="overflow:hidden"><div id="core-scroll"></div></div>
```

### Setting height

By default, `@nrk/core-scroll` scales based on content. If you want to set a fixed height, set this on the wrapper element (not directly on the `@nrk/core-scroll` element):

✅ Do | 🚫 Don't
:-- | :--
`<div style="overflow:hidden;height:200px"><div id="core-scroll"></div></div>` | `<div style="overflow:hidden"><div id="core-scroll" style="height:200px"></div></div>`

### Button states

The `<button>` elements receive `disabled` attributes reflecting the current scroll state:

```css
.my-scroll-button {}                  /* Target button in any state */
.my-scroll-button:disabled {}         /* Target button in disabled state */
.my-scroll-button:not(:disabled) {}   /* Target button in enabled state */
```

### NB: Safari bug
If you are creating a horizontal layout, you might experience unwanted vertical scrolling in Safari. This happens when children of <code>@nrk/core-scroll</code> have half-pixel height values (due to images/videos/elements with aspect-ratio sizing). Avoid the vertical scrolling by setting  <code>padding-bottom: 1px</code> on the <code>@nrk/core-scroll</code> element.
