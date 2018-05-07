---
name: Date
category: Components
---

> `@nrk/core-date` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```date.html
<!-- <button class="my-toggle" value="">Choose date</button>  <!-- must be <button> or <input> -->
<button data-core-date="my-date-id" value="now">I dag</button>

<input type="text" class="my-toggle" placeholder="Choose date">
<div class="my-date my-dropdown" id="my-date-id" hidden>
  <fieldset>
    <legend>Navigasjon</legend>
    <button data-core-date="now">I dag</button>
    <button data-core-date="now - 1 day">I går</button>
    <button data-core-date="now + 1 day">I morgen</button>
    <button data-core-date="- 1 week">Tilbake en uke</button>
    <button data-core-date="+ 1 week">Fremover en uke</button>
    <button data-core-date="now tuesday - 1 week">Tirsdag sist uke</button>
    <button data-core-date="now + 10 years">Om ti år</button>
    <button data-core-date="yy00-01-01 - 100 years">Forrige århundre</button>
  </fieldset>
  <label>
    <span>År</span>
    <select data-unit="year">
      <option value="2016-m-y">2016</option>
      <option>2017</option>
      <option>2018</option>
      <option>2019</option>
    </select>
  </label>
  <label>
    <span>Måned</span>
    <select data-core-date="month"></select>
  </label>
  <fieldset data-core-date="month">
    <legend>Måned</legend>
    <label><input type="radio" name="my-months" value="1">Jan</label>
    <label><input type="radio" name="my-months" value="2">Feb</label>
    <label><input type="radio" name="my-months" value="3">Mars</label>
    <label><input type="radio" name="my-months" value="4">April</label>
    <label><input type="radio" name="my-months" value="5">Mai</label>
    <label><input type="radio" name="my-months" value="6">Juni</label>
    <label><input type="radio" name="my-months" value="7">Juli</label>
    <label><input type="radio" name="my-months" value="8">Aug</label>
    <label><input type="radio" name="my-months" value="9">Sep</label>
    <label><input type="radio" name="my-months" value="10">Okt</label>
    <label><input type="radio" name="my-months" value="11">Nov</label>
    <label><input type="radio" name="my-months" value="12">Des</label>
  </fieldset>
  <label><span>År</span><input type="number" data-core-date="year"></label>
  <fieldset>
    <legend>Klokke</legend>
    <label><span>Time</span><input type="number" data-core-date="hour"></label>
    <label><span>Minutt</span><input type="number" data-core-date="minute"></label>
    <label>
      <span>Time</span>
      <select data-core-date="hour">
        <option>--</option>
        <option>11</option>
        <option>12</option>
        <option>13</option>
      </select>
    </label>
  </fieldset>
  <table data-core-date="day"></table>
</div>
```
```date.js
// coreDate.days = ['m', 't', 'o', 't', 'f', 'l', 's'] // Change name of days

// Disable dates
// document.addEventListener('date.change', (event) => event.preventDefault())
document.addEventListener('date.render', (event) => {
  const now = coreDate.parse('00:00')
  console.log(now)
  event.detail.setDisabled((date) => date < now)
})

// Initialize
coreDate('.my-date')
coreToggle('.my-toggle', {open: true, popup: true})   // Make popup
```
```date.css
.my-date button[aria-current="date"] { border: 1px dashed }
.my-date button[aria-pressed="true"] { border: 2px solid }
.my-date button[aria-disabled="true"] { opacity: .3 }
.my-date :disabled { cursor: not-allowed; filter: sepia(1) saturate(7) hue-rotate(-70deg) }
```
