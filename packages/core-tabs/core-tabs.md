---
name: Tabs
category: Components
---

> `@nrk/core-tabs`

```tabs.html
<div>
  <ul class="my-tabs nrk-unset nrk-grid" aria-label="Choose a name">   <!-- Aria label should be set --->
    <li>Tor Gjermund</li>                  <!-- Direct children can be any tag -->
    <li><button>Einar</button></li>        <!-- Can contain <button> but does nothing -->
    <li><a href="#link">Bjartmar</a></li>  <!-- Can contain <a> -->
  </ul>
  <div> <!-- Children of next element will become panels of correlating <button> and <a> tabs -->
    <div>Text about Tor Gjermund </div>
    <div hidden>Text about Einar</div>     <!-- hidden prevents flash of unstyled content -->
    <div hidden>Text about Bjartmar</div>
  </div>
</div>
<br>
<div>
  <div class="my-tabs nrk-grid" aria-label="Choose a person">
    <div>Kristoffer</div>
    <button>Eirik</button>
    <a href="#link">William</a>
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
