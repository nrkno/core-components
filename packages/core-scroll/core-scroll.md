---
name: Scroll
category: Components
---

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.

```scroll.html
<button data-core-scroll="my-scroll" value="up" aria-label="Rull til opp">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-up" /></svg>
</button>
<button data-core-scroll="my-scroll" value="down" aria-label="Rull til ned">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-down" /></svg>
</button>
<br>
<button data-core-scroll="my-scroll" value="left" aria-label="Rull til venstre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-left" /></svg>
</button>
<button data-core-scroll="my-scroll" value="right" aria-label="Rull til høyre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-right" /></svg>
</button>
<div class="my-wrap">
  <div class="my-scroll" id="my-scroll">
    <div>Item 1</div><div>Item 2</div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
    <div>Item 6</div><div>Item 7</div><div>Item 8</div><div>Item 9</div><div>Item 10</div>
    <div>Item 11</div><div>Item 12</div><div>Item 13</div><div>Item 14</div><div>Item 15</div>
    <br>
    <div>Item 1</div><div><div class="my-wrap">
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
    </div></div><div>Item 3</div><div>Item 4</div><a href="#">Item 5</a>
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
<script async src="https://static.nrk.no/core-icons/latest/core-icons.min.js"></script>
```
```scroll.js
coreScroll('.my-scroll', {hideScrollbars: true});
document.addEventListener('scroll.throttled', function (event) {
  console.log(event.detail)
});
```
```scroll.css
.my-wrap { overflow: hidden; white-space: nowrap; border: 1px solid; height: 300px; max-height: 100% }
.my-scroll > * { box-sizing: border-box; display: inline-block; vertical-align: top; width: 30%; height: 55%; padding: 20px; outline: 1px solid; outline-offset: -10px; transition: 1s }
.my-scroll > *:nth-child(3n) { width: 35% }
:disabled { filter: sepia(1) saturate(7) hue-rotate(-70deg) }
```
