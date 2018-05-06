---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances a `<button>` or `<input>` field with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<!-- <button class="my-toggle" value="">Choose date</button>  <!-- must be <button> or <input> -->
<input type="text" class="my-toggle" placeholder="Choose date">
<div class="my-date my-dropdown" hidden>
  <fieldset>
    <legend>Navigasjon</legend>
    <button value="now">I dag</button>
    <button value="now - 1 day">I går</button>
    <button value="now + 1 day">I morgen</button>
    <button value="- 1 week">Tilbake en uke</button>
    <button value="+ 1 week">Fremover en uke</button>
    <button value="now tuesday - 1 week">Tirsdag sist uke</button>
    <button value="now + 10 years">Om ti år</button>
    <button value="yy00-01-01 - 100 years">Forrige århundre</button>
  </fieldset>
  <label><span>År</span>
    <select data-unit="year">
      <option>2016</option>
      <option>2017</option>
      <option>2018</option>
      <option>2019</option>
    </select>
  </label>
  <label>
    <span>Måned</span>
    <select data-unit="month"></select>
  </label>
  <fieldset>
    <legend>Måned</legend>
    <label><input type="radio" name="my-months" data-unit="month" value="1">Jan</label>
    <label><input type="radio" name="my-months" value="y-2-d">Feb</label>
    <label><input type="radio" name="my-months" value="y-3-d">Mars</label>
    <label><input type="radio" name="my-months" value="y-4-d">April</label>
    <label><input type="radio" name="my-months" value="y-5-d">Mai</label>
    <label><input type="radio" name="my-months" value="y-6-d">Juni</label>
    <label><input type="radio" name="my-months" value="y-7-d">Juli</label>
    <label><input type="radio" name="my-months" value="y-8-d">Aug</label>
    <label><input type="radio" name="my-months" value="y-9-d">Sep</label>
    <label><input type="radio" name="my-months" value="y-10-d">Okt</label>
    <label><input type="radio" name="my-months" value="y-11-d">Nov</label>
    <label><input type="radio" name="my-months" value="y-12-d">Des</label>
  </fieldset>
  <label><span>År</span><input type="number" data-unit="year"></label>
  <fieldset>
    <legend>Klokke</legend>
    <label><span>Time</span><input type="number" data-unit="hour"></label>
    <label><span>Minutt</span><input type="number" data-unit="minute"></label>

    <label>
      <span>Time</span>
      <select data-unit="hour" data-step="10" data-min="0" data-max="50">
        <option value="">--</option>
        <option>11</option>
        <option>12</option>
        <option>13</option>
      </select>
    </label>
  </fieldset>
  <table></table>
</div>
```
```datepicker.js
coreDatepicker.days = ['m', 't', 'o', 't', 'f', 'l', 's'] // Change name of days

// Disable dates
document.addEventListener('datepicker.change', (event) => event.preventDefault())
document.addEventListener('datepicker.render', (event) => {
  const now = coreDatepicker.parse('00:00')
  console.log(now)
  event.detail.setDisabled((date) => date < now)
})

// Initialize
coreDatepicker('.my-date')
coreToggle('.my-toggle', {open: true, popup: true})   // Make popup
```
```datepicker.css
.my-date button[aria-current="date"] { border: 1px dashed }
.my-date button[aria-pressed="true"] { border: 2px solid }
.my-date button[aria-disabled="true"] { opacity: .3 }
.my-date :disabled { cursor: not-allowed; filter: sepia(1) saturate(7) hue-rotate(-70deg) }
```
