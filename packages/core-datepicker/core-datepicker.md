---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<input type="text" name="">
<button class="my-date" value="today">Choose date</button>  <!-- must be <button> -->
<div class="my-dropdown">                                   <!-- hidden prevents flash of unstyled content -->
  <div class="nrk-grid">
    <div><button name="day" value="now">I dag</button></div>
    <div><button name="day" value="-1 day">I går</button></div>
    <div><button name="day" value="+1 day">I morgen</button></div>
  </div>
  <label><span>Måned</span><select name="month"></select></label>
  <label><span>År</span><input type="number" name="year"></label>
  <table></table>
</div>
```
```datepicker.js
coreDatepicker('.my-date')
coreToggle('.my-date', {   // Make datepicker popup
  open: true,
  popup: true
})
```
