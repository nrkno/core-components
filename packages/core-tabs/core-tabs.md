---
name: Tabs
category: Components
---

> `@nrk/core-tabs`

```tabs.html
<div>
  <div class="my-tabs"> <!-- Children must be <a> or <button> -->
    <button>Tor Gjermund</button>
    <button>Einar</button>
    <a href="#link">Bjartmar</a>
  </div>
  <div> <!-- Next element children will become panels of correlating tab -->
    <div hidden>Text about Tor Gjermund </div> <!-- hidden prevents flash of unstyled content -->
    <div>Text about Einar</div>
    <div hidden>Text about Bjartmar</div>
  </div>
</div>
```
```tabs.js
coreTabs('.my-tabs')
```
```tabs.jsx
<Tabs open={0} onToggle={function(){}}>
  <div>
    <button>Tor Gjermund</button>
    <button>Einar</button>
    <a href="#link">Bjartmar</a>
  </div>
  <div>
    <div>Text about Tor Gjermund </div>
    <div>Text about Einar</div>
    <div>Text about Bjartmar</div>
  </div>
</Tabs>
```
```tabs.css
[aria-selected="true"] { border: 2px solid }
```
