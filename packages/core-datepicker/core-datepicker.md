---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<!-- <button class="my-toggle" value="">Choose date</button>  <!-- must be <button> or <input> -->
<input type="text" class="my-toggle" placeholder="Choose date">
<div class="my-date my-dropdown" hidden>
  <button value="now">I dag</button>
  <button value="now - 1 day">I går</button>
  <button value="now + 1 day">I morgen</button>
  <button value="- 1 week">Tilbake en uke</button>
  <button value="+ 1 week">Fremover en uke</button>
  <button value="now tuesday - 1 week">Tirsdag sist uke</button>
  <button value="now + 10 years">Om ti år</button>
  <button value="yy00-01-01 - 100 years">Forrige århundre</button>
  <br>
  <label><span>Måned</span><select></select></label>
  <label><span>Year</span>
    <select>
      <option value="2016-m-d">2016</option>
      <option value="2017-m-d">2017</option>
      <option value="2018-m-d">2018</option>
      <option value="2019-m-d">2019</option>
    </select>
  </label>
  <fieldset>
    <caption>Måned</caption>
    <label><input type="radio" name="my-group-name" value="y-1-d">Jan</label>
    <label><input type="radio" name="my-group-name" value="y-2-d">Fed</label>
    <label><input type="radio" name="my-group-name" value="y-3-d">Mars</label>
    <label><input type="radio" name="my-group-name" value="y-4-d">April</label>
    <label><input type="radio" name="my-group-name" value="y-5-d">Mai</label>
    <label><input type="radio" name="my-group-name" value="y-6-d">Juni</label>
    <label><input type="radio" name="my-group-name" value="y-7-d">Juli</label>
    <label><input type="radio" name="my-group-name" value="y-8-d">Aug</label>
    <label><input type="radio" name="my-group-name" value="y-9-d">Sep</label>
    <label><input type="radio" name="my-group-name" value="y-10-d">Okt</label>
    <label><input type="radio" name="my-group-name" value="y-11-d">Nov</label>
    <label><input type="radio" name="my-group-name" value="y-12-d">Des</label>
  </fieldset>
  <label><span>År</span><input type="text" data-mask="?-m-d"></label>
  <label><span>Tid</span><input type="text" data-mask="y-m-d ?:?"></label>
  <table></table>
</div>
```
```datepicker.js
coreDatepicker.days = ['m', 't', 'o', 't', 'f', 'l', 's'] // Change name of days
coreDatepicker('.my-date')
coreToggle('.my-toggle', {   // Make datepicker popup
  open: true,
  popup: true
})
```
```datepicker.css
.my-date button[aria-current="date"] { border: 1px dashed }
.my-date button[aria-pressed="true"] { border: 2px solid }
.my-date button[aria-disabled="true"] { opacity: .3 }
```
