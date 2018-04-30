---
name: Scroll
category: Components
---

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.

```scroll.html
<button data-core-scroll="#my-scroll@0%">Left</button>
<div id="my-scroll">
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
    <a href="#">Item 5</a>
  </div>
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
    <a href="#">Item 5</a>
  </div>
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
    <a href="#">Item 5</a>
  </div>
  <div>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
    <div>Item 4</div>
    <a href="#">Item 5</a>
  </div>
</div>
<button data-core-scroll="#my-scroll@0%">Right</button>
```
```scroll.js
coreScroll('#my-scroll')
```
```scroll.css hidden
#my-scroll { white-space: nowrap; border: 1px solid; height: 300px }
#my-scroll > * > * { display: inline-block; width: 200px; height: 100px; margin: 10px; border: 1px solid }
```
