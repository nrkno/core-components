---
name: Scroll
category: Components
---

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.

```scroll.html
<button data-core-scroll=".my-scroll" data-core-scroll-x="-100%" aria-label="Rull til venstre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-left" /></svg>
</button>
<div class="my-wrap">
  <div class="my-scroll">
    <div>Item 1</div><div>Item 2</div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
    <div>Item 6</div><div>Item 7</div><div>Item 8</div><div>Item 9</div><div>Item 10</div>
    <div>Item 11</div><div>Item 12</div><div>Item 13</div><div>Item 14</div><div>Item 15</div>
    <br>
    <div>Item 1</div><div>Item 2</div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
    <div>Item 6</div><div>Item 7</div><div>Item 8</div><div>Item 9</div><div>Item 10</div>
    <div>Item 11</div><div>Item 12</div><div>Item 13</div><div>Item 14</div><div>Item 15</div>
    <br>
    <div>Item 1</div><div>Item 2</div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
    <div>Item 6</div><div>Item 7</div><div>Item 8</div><div>Item 9</div><div>Item 10</div>
    <div>Item 11</div><div>Item 12</div><div>Item 13</div><div>Item 14</div><div>Item 15</div>
    <br>
    <div>Item 1</div><div>Item 2</div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
    <div>Item 6</div><div>Item 7</div><div>Item 8</div><div>Item 9</div><div>Item 10</div>
    <div>Item 11</div><div>Item 12</div><div>Item 13</div><div>Item 14</div><div>Item 15</div>
  </div>
</div>
<button data-core-scroll=".my-scroll" data-core-scroll-x="+100%" aria-label="Rull til høyre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-right" /></svg>
</button>
<script async src="https://static.nrk.no/core-icons/latest/core-icons.min.js"></script>
```
```scroll.js
coreScroll('.my-scroll', {
  hideScrollbars: true,
  // snapAlign: 'start none',
  // snapPadding: '0px 0px 0px'
})
```
```scroll.css
.my-wrap { overflow: hidden; white-space: nowrap; border: 1px solid; height: 300px }
.my-scroll > * { box-sizing: border-box; display: inline-block; width: 30%; height: 55%; padding: 20px; outline: 1px solid; outline-offset: -10px }
:disabled { filter: sepia(1) saturate(7) hue-rotate(-70deg) }
```
