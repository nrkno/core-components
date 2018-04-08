---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<!-- <input type="text" name="">
<button class="my-date">Choose date</button>  <!-- must be <button> or <input> -->
<input type="text" class="my-date" placeholder="Choose date">
<div class="my-dropdown">                     <!-- hidden prevents flash of unstyled content -->
  <div class="nrk-grid">
    <div><button data-core-datepicker value="now">I dag</button></div>
    <div><button data-core-datepicker value="now - 1 day">I går</button></div>
    <div><button data-core-datepicker value="now + 1 day">I morgen</button></div>
    <div><button data-core-datepicker value="- 7 days">Tilbake en uke</button></div>
    <div><button data-core-datepicker value="+ 7 days">Fremover en uke</button></div>
    <div><button data-core-datepicker value="now tuesday - 7 days">Tirsdag sist uke</button></div>
    <div><button data-core-datepicker value="now + 10 years">Om ti år</button></div>
    <div><button data-core-datepicker value="yy00-01-01 - 100 years">Forrige århundre</button></div>
  </div>
  <label><span>Måned</span><select name="month"></select></label>
  <label><span>År</span><input type="number" name="year"></label>
  <table></table>
</div>
```
```datepicker.js
coreDatepicker('.my-date')
// coreToggle('.my-date', {   // Make datepicker popup
//   open: true,
//   popup: true
// })
```
```datepicker.css
.my-dropdown button[aria-pressed="true"] { box-shadow: 0 0 0 1px }
```
