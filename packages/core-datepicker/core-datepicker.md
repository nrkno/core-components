---
name: Datepicker
category: Components
---

> `@nrk/core-datepicker` enhances all child `<input>`, `<select>` `<table>` and `<button>` elements with keyboard accessible functionality for selecting date and time. The interface and granularity of date refinement can easily be altered through markup:

```datepicker.html
<button class="my-toggle">Velg dato</button>
<div class="my-datepicker my-dropdown" id="my-datepicker" hidden>
  <input type="timestamp">
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
  <label>
    År
    <select>
      <option value="2016-m-d">2016</option>
      <option value="2017-m-d">2017</option>
      <option value="2018-m-d">2018</option>
      <option value="2019-m-d">2019</option>
    </select>
  </label>
  <label>Måned<select></select></label>
  <fieldset>
    <legend>Måned</legend>
    <label><input type="radio" name="my-months" value="y-1-d">Jan</label>
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
  <label><span>År</span><input type="year"></label>
  <label><span>Måned</span><input type="month"></label>
  <fieldset>
    <legend>Klokke</legend>
    <label>Time<input type="hour"></label>
    <label>Minutt<input type="minute"></label>
    <label>
      <span>Time</span>
      <select>
        <option>--</option>
        <option value="11:m">11</option>
        <option value="12:m">12</option>
        <option value="13:m">13</option>
      </select>
    </label>
  </fieldset>
  <table></table>
</div>
<button data-core-datepicker="my-datepicker" value="now">Nå</button>
<button data-core-datepicker="my-datepicker" value="+1 week">Neste uke</button>
<input type="text" id="my-datepicker-output">
```
```datepicker.js
// coreDate.days = ['m', 't', 'o', 't', 'f', 'l', 's'] // Change name of days

// Update GUI
document.addEventListener('datepicker.render', function (event) {
  if (event.target.id !== 'my-datepicker') return
  event.detail.disable(function (date) { return date > Date.now() })
})

// Update output
document.addEventListener('datepicker.change', function (event) {
  if (event.target.id !== 'my-datepicker') return
  document.getElementById('my-datepicker-output').value = event.detail.nextDate.toLocaleString()
})

// Initialize
coreDatepicker('#my-datepicker')
coreToggle('.my-toggle', {popup: true}) // Make popup
```
```datepicker.jsx
class MyDate extends React.Component {
  constructor (props) {
    super(props)
    this.today = Datepicker.parse('00:00')
    this.state = {date: new Date()}
    this.onNow = this.onNow.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onNow () { this.setState({date: Datepicker.parse('now')}) }
  onChange (event) { this.setState({date: event.detail.nextDate}) }
  render () {
    return <Toggle popup={true}>
      <button>Velg dato JSX</button>
      <Datepicker
        date={this.state.date}
        disable={(date) => date < this.today}
        onChange={this.onChange}
        className="my-datepicker my-dropdown">
          <label>År<input type="year" /></label>
          <label>Måned<select></select></label>
          <table></table>
      </Datepicker>
      <button onClick={this.onNow}>I dag JSX</button>
      <input type="text" readOnly value={this.state.date.toLocaleDateString()} />
    </Toggle>
  }
}
<MyDate />
```
```datepicker.css
.my-datepicker button[aria-current="date"] { border: 1px dashed }
.my-datepicker button[aria-pressed="true"] { border: 2px solid }
.my-datepicker button[aria-disabled="true"] { opacity: .3 }
:disabled { filter: brightness(.7) sepia(1) hue-rotate(-50deg) }
```
