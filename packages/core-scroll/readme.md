# Core Scroll

## `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices. `core-scroll` also automatically disables animation for users who prefers [reduced motion](https://css-tricks.com/introduction-reduced-motion-media-query/).

---

## Installation

```bash
npm install @nrk/core-scroll --save-exact
```
```js
import coreScroll from '@nrk/core-scroll'     // Vanilla JS
import CoreScroll from '@nrk/core-scroll/jsx' // ...or React/Preact compatible JSX
```

---

<!--demo
<script src="core-scroll/core-scroll.min.js"></script>
<script src="core-scroll/core-scroll.jsx.js"></script>
<style>
  #my-scroll-js { height: 200px }
  .my-wrap { overflow: hidden; white-space: nowrap; border: 1px solid; height: 100% }
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
<div class="my-wrap">
  <div class="my-scroll" id="my-scroll-js">
    <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
    <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
    <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
    <br>
    <div>1</div><div><div class="my-wrap">
      <div class="my-scroll">
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
      </div>
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
  </div>
</div>
<script>
  coreScroll('.my-scroll');
</script>
```

```html
<!--demo-->
<div id="jsx-scroll"></div>
<script type="text/jsx">
  class MyScroll extends React.Component {
    constructor (props) {
      super(props)
      this.state = {}
    }
    render () {
      return <div>
        <button disabled={!this.state.scrollLeft} onClick={this.state.scrollLeft}>Left JSX</button>
        <button disabled={!this.state.scrollRight} onClick={this.state.scrollRight}>Right JSX</button>
        <div className="my-wrap">
          <CoreScroll className="my-scroll" onChange={(state) => this.setState(state)}>
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

---

## Usage

Scroll speed is controlled by `friction` rather than `duration` (a short scroll distance will have a shorter duration and vice versa) for a more natural feeling of motion. Buttons can control a `core-scroll` by targeting its ID and specifying a direction; `left|right|up|down`. The `disabled` is automatically added/removed to controller buttons when there is no more pixels to scroll in specified direction.

### HTML / JavaScript
```html
<button data-core-scroll="my-scroll-js" value="up" aria-label="Rull opp">&uarr;</button>
<div id="my-scroll-js">
  <!-- Direct children is used to calculate natural stop points for scroll -->
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
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

---

## Events
`'scroll.change'` is fired regularly during a scroll. The event is [throttled](https://css-tricks.com/the-difference-between-throttling-and-debouncing/) to achieve better performance. The event bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):


```js
document.addEventListener('scroll.change', (event) => {
  event.target        // The core-scroll element triggering scroll.change event
  event.detail.left   // Amount of pixels remaining in scroll direction left
  event.detail.right  // Amount of pixels remaining in scroll direction right
  event.detail.up     // Amount of pixels remaining in scroll direction up
  event.detail.down   // Amount of pixels remaining in scroll direction down
})
```

---

## Styling
All styling in documentation is example only. The `<button>` elements receive `disabled `attributes reflecting the current scroll state:

```css
.my-scroll-button {}                  /* Target button in any state */
.my-scroll-button:disabled {}         /* Target button in disabled state */
.my-scroll-button:not(:disabled) {}   /* Target button in enabled state */
```
