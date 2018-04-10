---
name: Tabs
category: Components
---

> `@nrk/core-tabs`

```tabs.html
<div>
  <div class="my-tabs">
    <button>Tor Gjermund</button>         <!-- Direct children must be <a> or <button> -->
    <button>Einar</button>
    <a href="#link">Bjartmar</a>
  </ul>
  <div> <!-- Children of next element will become panels of correlating <button> and <a> tabs -->
    <div>Text about Tor Gjermund </div>
    <div hidden>Text about Einar</div>    <!-- hidden prevents flash of unstyled content -->
    <div hidden>Text about Bjartmar</div>
  </div>
</div>
<br>
<div>
  <div class="my-tabs nrk-grid" aria-label="Choose a person">
    <button>Kristoffer</button>
    <a href="#link">William</a>
    <button>Eirik</button>
  </div>
  <div> <!-- Children of next element will become panels of correlating <button> and <a> tabs -->
    <div>Text about Kristoffer </div>
    <div hidden>Text about Eirik</div>
    <div hidden>Text about William</div>
  </div>
</div>

```
```tabs.js
coreTabs('.my-tabs')
```
```tabs.css
[role="tab"][aria-selected="true"] { border: 2px solid }
```
