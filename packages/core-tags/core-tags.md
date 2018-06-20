---
name: Tags
category: Components
---

```tags.html
<fieldset class="my-tags">
  <legend>Velg sjanger</legend>
  <span>
    <button type="button">Jazz</button>
    <button type="button" tabindex="-1">Fjern Jazz</button>
  </span>
  <span>
    <button type="button">Rock</button>
    <button type="button" tabindex="-1">Fjern Rock</button>
  </span>
  <input type="search">
  <ul hidden>
    <li><button>Chrome</button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
</fieldset>
```
```tags.css
ul { list-style: none; margin: 0; padding: 0; box-shadow: 0 3px 6px rgba(0,0,0,.2) }
label span { display:inline-block; background: red; padding: 5px }
/* enter/space/dblclick = gjør til input, esc = pille */
/* tom + backspace = fokus, gang 2 = slett, cmd + a etc */
```
```tags.js
coreTags('.my-tags')
```
