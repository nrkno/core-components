---
name: Tags
category: Components
---

```tags.html
<fieldset>
  <legend>Velg sjanger</legend>
  <button title="Trykk enter for å endre, trykk backspace for å slette">
    Rock
    <span aria-label="Fjern Rock"></span>
  </button>
  <button title="Trykk enter for å endre, trykk backspace for å slette">
    Jazz
    <span aria-label="Fjern Jazz"></span>
  </button>
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
span { display:inline-block; background: red; padding: 5px }
/* enter/space/dblclick = gjør til input, esc = pille */
/* tom + backspace = fokus, gang 2 = slett, cmd + a etc */
```
```tags.js
coreInput('input')
// coreTags('fieldset')
```
