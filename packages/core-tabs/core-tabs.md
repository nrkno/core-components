---
name: Tabs
category: Components
---

> `@nrk/core-tabs`

```tabs.html
<div class="my-tabs"> <!-- Accepts any tag and structure. All <button> and <a> inside will become tabs -->
  <button>Tab 1</button>
  <button>Tab 2</button>
  <button>Tab 3</button>
</div>
<div> <!-- Children of next element will become panels of correlating <button> and <a> tabs -->
  <div hidden>Panel 1</div>
  <div>Panel 2</div> <!-- hidden prevents flash of unstyled content -->
  <div hidden>Panel 3</div>
</div>
```
```tabs.js
coreTabs('.my-tabs')
```
```tabs.css
.my-tabs button[aria-selected="true"] { border: 2px solid }
```
