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
<input type="text" id="my-datepicker-output">
```
```datepicker.js
// coreDate.days = ['m', 't', 'o', 't', 'f', 'l', 's'] // Change name of days

// Update GUI
document.addEventListener('datepicker.change', function (event) {
  if (event.target.id === 'my-datepicker') {
    document.getElementById('my-datepicker-output').value = event.detail.nextDate.toLocaleString()
  }
})

// Initialize
coreDatepicker('#my-datepicker')
coreToggle('.my-toggle', {popup: true}) // Make popup
```
```datepicker.jsx
class MyDate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {date: new Date()}
    this.onNow = this.onNow.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onNow () { this.setState({date: Datepicker.parse('now')}) }
  onChange (event) { this.setState({date: event.detail.nextDate}) }
  render () {
    return <Toggle popup={true}>
      <button>Velg dato JSX</button>
      <Datepicker date={this.state.date} onChange={this.onChange} className="my-datepicker my-dropdown">
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
```

## Usage
```html
  <div class="my-datepicker my-dropdown" id="my-datepicker">
    
    <!-- There are different behaviors depending on the type of <input>. -->
    <!-- When 'radio' or 'checkbox' is used, core-datepicker checks the value field -->
    <!-- to see if the date specified is matching the values of the <input>s. -->
    <!-- When any other type is used, core-datepicker sets the type to number -->
    <!-- and sets the date specified in the value field. -->
    <input type="radio|checkbox|timestamp|text|number|etc"/>
    
    <!-- If an empty <select> is provided, core-datepicker will populate the select -->
    <!-- with months and automatically handle the date state when an option is chosen -->
    <select></select>
    <!-- If you use a <select> that is already populated, core-datepicker will not -->
    <!-- modify it, but handle the dates specified in values -->
    <select>
      <option value="2016-m-d">Set year to 2016</option>
      <option value="19yy-1-1">Back 100 years and set to January 1st.</option>
      <option value="1985-12-19">December 19, 1985</option>
    </select>


    <!-- If an empty <table> is provided, core-datepicker will display all dates -->
    <!-- for the current/chosen month -->
    <table></table>

    <!-- To see what is supported in our natural language parser, please visit: -->
    <!-- https://github.com/nrkno/simple-date-parse -->

    <!-- It is also possible to extend the datepicker with more features -->
    <!-- As shown in the example, it is possible to provide buttons that moves -->
    <!-- the date a certain amount of time  -->
    <fieldset>
      <legend>Navigasjon</legend>
      <!-- Dates relative to today/now by using the keyword 'now' -->
      <button value="now">I dag</button>
      <button value="now - 1 day|week|month|year">I går/forrige uke/måned/år</button>
      <button value="now + 1 day|week|month|year">I morgen/neste uke/måned/år</button>

      <!-- Semi-specific dates -->
      <!-- Will use the first two digits of the current year and set the two last -->
      <!-- digits of the year 0. Will set the date to 1st of January -->
      <button value="yy00-01-01">Start of current century</button>
    </fieldset>
  </div>
```

```js
import coreDatepicker from '@nrk/core-datepicker'

coreDatepicker(
  String|Element|Elements, // Accepts a selector string, NodeList, Element or array of Elements
  String|Date              // Specify the date which coreDatepicker should use.
  // e.g:
  'now + 2 days'           // Will set the date to the day after tomorrow  
})
```

```jsx
import Datepicker from '@nrk/core-datepicker/jsx'

<Datepicker date={String|Date} onChange={function(){}} >
  {/* Same as with vanilla js */}
  <input type="radio|checkbox|timestamp|text|number|etc"/>

  {/* Same as with vanilla js */}
  <select></select> 

  {/* Same as with vanilla js */}
  <table></table>
<Datepicker>
```


## Events
```js
document.addEventListener('datepicker.change', (event) => {
  event.target                        // The datepicker container
  event.detail.nextDate               // The new date that triggered change
  event.detail.prevDate               // The previous/current date
})
```

## Styling

```css
.my-datepicker                              /* Target datepicker container */
.my-datepicker button[aria-current="date"]  /* Target current date (today) in the table */
.my-datepicker button[aria-pressed="true"]  /* Target the chosen date in the table */
.my-datepicker button[aria-disabled="true"] /* Target disabled dates in the table */
```
