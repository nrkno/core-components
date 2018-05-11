---
name: Scroll
category: Components
---

> `@nrk/core-scroll` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices.

```scroll.html
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
```
```scroll.js
coreScroll('.my-scroll');
```
```scroll.jsx
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
        <Scroll className="my-scroll" onChange={(state) => this.setState(state)}>
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
.my-scroll > * { box-sizing: border-box; display: inline-block; vertical-align: top; width: 30%; height: 90px; padding: 10px; border: 1px solid; margin: 10px; transition: 1s }
```
