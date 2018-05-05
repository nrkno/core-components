---
name: Scroll
category: Components
---

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.

```scroll.html
<button data-core-scroll="my-scroll-js" value="up" aria-label="Rull til opp">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-up" /></svg>
</button>
<button data-core-scroll="my-scroll-js" value="down" aria-label="Rull til ned">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-down" /></svg>
</button>
<br>
<button data-core-scroll="my-scroll-js" value="left" aria-label="Rull til venstre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-left" /></svg>
</button>
<button data-core-scroll="my-scroll-js" value="right" aria-label="Rull til høyre">
  <svg width="15" height="15" aria-hidden="true"><use xlink:href="#nrk-chevron-right" /></svg>
</button>
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
<script async src="https://static.nrk.no/core-icons/latest/core-icons.min.js"></script>
```
```scroll.js
coreScroll('.my-scroll');
```
```scroll.jsx
class MyScroll extends React.Component {
  constructor (props) {
    super(props)
    this.state = {right: true}
    this.onLeft = this.onClick.bind(this, 'left')
    this.onRight = this.onClick.bind(this, 'right')
    this.onChange = this.onChange.bind(this)
  }
  onChange (event) { this.setState(event.detail) }
  onClick (direction) { this.scroll.update(direction) }
  render () {
    return <div>
      <button disabled={!this.state.left} onClick={this.onLeft}>Left</button>
      <button disabled={!this.state.right} onClick={this.onRight}>Right</button>
      <div className="my-wrap">
        <Scroll className="my-scroll" onChange={this.onChange} ref={(scroll) => (this.scroll = scroll)}>
          <div>1</div><div>2</div><div>3</div><div>4</div><a href="#">5</a>
          <div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
          <div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
        </Scroll>
      </div>
    </div>
  }
}
<MyScroll />
```
```scroll.css
#my-scroll-js { height: 200px }
.my-wrap { overflow: hidden; white-space: nowrap; border: 1px solid; height: 100% }
.my-scroll > * { box-sizing: border-box; display: inline-block; vertical-align: top; width: 30%; height: 90px; padding: 20px; outline: 1px solid; outline-offset: -10px; transition: 1s }
```
