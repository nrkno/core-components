---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<button data-core-datepicker=".my-date" value="now - 1 day">I går</button>
<!--
<button class="my-date">Choose date</button>  <!-- must be <button> or <input> -->
<input type="text" class="input" placeholder="Choose date">
<div class="my-dropdown" hidden>              <!-- hidden prevents flash of unstyled content -->
  <input type="text" class="my-date">
  <div class="my-calendar">
    <button value="now">I dag</button>
    <button value="now - 1 day">I går</button>
    <button value="now + 1 day">I morgen</button>
    <button value="- 7 days">Tilbake en uke</button>
    <button value="+ 7 days">Fremover en uke</button>
    <button value="now tuesday - 7 days">Tirsdag sist uke</button>
    <button value="now + 10 years">Om ti år</button>
    <button value="yy00-01-01 - 100 years">Forrige århundre</button>
    <br>
    <label><span>Måned</span><select></select></label>
    <label><span>År</span><input type="number"></label>
    <table></table>
  </div>
</div>
```
```datepicker.js
coreDatepicker('.my-date')
coreToggle('.input', {   // Make datepicker popup
  open: true,
  popup: true
})
```
```datepicker.css
.my-calendar button[aria-current="date"] { outline: 1px dashed }
.my-calendar button[aria-pressed="true"] { box-shadow: 0 0 0 1px }
.my-calendar button[aria-disabled="true"] { opacity: .3 }
```
