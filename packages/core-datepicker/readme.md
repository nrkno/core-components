# Core Datepicker

> `@nrk/core-datepicker` enhances all child `input`, `select` `table` and `button` elements with keyboard accessible functionality
> for selecting both dates and times. The interface and granularity of date refinement can easily be altered through markup.

<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script> -->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-toggle/core-toggle.min.js"></script>
<script src="core-toggle/core-toggle.jsx.js"></script>
<script src="core-datepicker/core-datepicker.min.js"></script>
<script src="core-datepicker/core-datepicker.jsx.js"></script>
<style>
  .my-popup:not([hidden]) { display: block; position: absolute; z-index: 3; padding: 1rem; background: #fff; box-shadow: 0 5px 9px rgba(0,0,0,.4) }
  button[aria-current="date"] { border: 1px dashed }
  button[data-adjacent="true"] { opacity: .3 }
  button[autofocus] { border: 2px solid }
  :disabled { filter: brightness(.7) sepia(1) hue-rotate(-50deg) }
</style>
demo-->

## Example

```html
<!-- demo -->
<button class="my-toggle">Velg dato</button>
<core-toggle popup hidden class="my-popup">
  <core-datepicker id="my-datepicker"
    days="Mon,Tue,Wed,Thu,Fri,Sat,Sun"
    months="January,Febuary,March,April,May,June,July,August,September,October,November,December">
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
  </core-datepicker>
</core-toggle>
<button for="my-datepicker" value="now">Nå</button>
<button for="my-datepicker" value="+1 week">Neste uke</button>
<select for="my-datepicker">
  <option>Tid</option>
  <option value="11:m">11</option>
  <option value="12:m">12</option>
  <option value="13:m">13</option>
</select>
<table for="my-datepicker"></table>
<input type="text" id="my-datepicker-output">
<script>
  // Update GUI
  document.getElementById('my-datepicker').disabled = (date) => {
    var oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(new Date().getDate() + 7)
    return date > oneWeekFromNow
  }

  // Update output
  document.addEventListener('datepicker.change', function (event) {
    if (event.target.id !== 'my-datepicker') return
    document.getElementById('my-datepicker-output').value = event.target.date.toLocaleString()
  })
</script>
```

```html
<!-- demo -->
<div id="jsx-datepicker"></div>
<script type="text/jsx">
  class MyDate extends React.Component {
    constructor (props) {
      super(props)
      this.today = Date.now() - Date.now() % 864e3
      this.state = { date: new Date() }
      this.onNow = this.onNow.bind(this)
      this.onChange = this.onChange.bind(this)
    }
    onNow () { this.setState({ date: new Date() }) }
    onChange (event) { this.setState({ date: event.target.date }) }
    render () {
      return <div>
        <button>Velg dato JSX</button>
        <CoreToggle hidden popup className="my-popup">
          <CoreDatepicker
            timestamp={this.state.date.getTime()}
            disabled={(date) => date <= this.today}
            onDatepickerChange={this.onChange}>
              <label>År<input type="year" /></label>
              <label>Måned<select></select></label>
              <table></table>
          </CoreDatepicker>
        </CoreToggle>
        <button onClick={this.onNow}>I dag JSX</button>
        <input type="text" readOnly value={this.state.date.toLocaleDateString()} />
      </div>
    }
  }

  ReactDOM.render(<MyDate />, document.getElementById('jsx-datepicker'))
</script>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-datepicker  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/7/core-datepicker/core-datepicker.min.js"></script>  <!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills#custom-elements) custom elements if needed.


## Usage

All date values - both HTML markup and JavaScript - accepts accepts dates as numbers, or as natural language in [the format of @nrk/simple-date-parse](https://github.com/nrkno/simple-date-parse).

### HTML / JavaScript

```html
<core-datepicker
  timestamp="{String}"    <!-- Optional. Sets date from UNIX timestamp -->
  months="{String}"       <!-- Optional. Comma separated list of custom month names to be used. ("Jan,Feb,...") -->
  days="{String}">        <!-- Optional. Comma separated list of custom weekday names to be used ("Man,Tir,Ons,...") -->
  <!-- There are different behaviours depending on the type of <input>. -->
  <!-- When 'radio' or 'checkbox' is used, core-datepicker checks the value field -->
  <!-- to see if the date specified is matching the values of the <input>s. -->
  <!-- When any other type is used, core-datepicker sets the type to number -->
  <!-- and sets the date specified in the value field. -->
  <!-- NOTE: Other input types are not handled by core-datepicker to allow -->
  <!-- more customizability with other elements inside core-datepicker container -->
  <input type="radio|checkbox|year|month|day|hour|minute|second|timestamp"/>

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
</core-datepicker>
```

```js
import CoreDatepicker from '@nrk/core-datepicker'               // Using NPM
window.customElements.define('core-datepicker', CoreProgress)   // Using NPM. Replace 'core-datepicker' with 'my-datepicker' to namespace

const myDatepicker = document.querySelector('core-datepicker')

// Getters
myDatepicker.date          // Get date object
myDatepicker.timestamp     // Get timestamp
myDatepicker.year          // Get year
myDatepicker.month         // Get month
myDatepicker.day           // Get day
myDatepicker.hour          // Get hour
myDatepicker.minute        // Get minute
myDatepicker.second        // Get second
// Setters
myDatepicker.date = 'now'                    // Set date. Accepts simple-date-parse format or Date object
myDatepicker.months = ['Jan', 'Feb', ...]    // Set list of custom month names to be used
myDatepicker.days = ['Man', 'Tir', ...]      // Set list of custom weekday names to be used
myDatepicker.disabled = Function|Boolean     // Disable dates. If true disable all dates. Function receives each date, returns a boolean.
// Methods
myDatepicker.parse('fri')                    // Utility function for parsing time and dates. Really just @nrk/simple-date-parse
```

### React / Preact

```jsx
import CoreDatepicker from '@nrk/core-datepicker/jsx'

<CoreDatepicker timestamp={String}                // Optional. Sets date from timestamp
                months={String}                   // Optional. Comma separated list of custom month names to be used ("Jan,Feb,...")
                days={String}                     // Optional. Comma separated list of custom weekday names to be used ("Man,Tir,Ons,...")
                ref={(comp) => {}}                // Optional. Get reference to React component
                forwardRef={(el) => {}}           // Optional. Get reference to underlying DOM custom element
                onDatepickerChange={Function}     // Optional. See 'datepicker.change'
                onDatepickerClickDay={Function}>  // Optional. See 'datepicker.click.day'
  <input type="radio|checkbox|year|month|day|hour|minute|second|timestamp"/> // Same as with vanilla js
  <select></select>                    // Same as with vanilla js
  <table></table>                      // Same as with vanilla js
</CoreDatepicker>
```



## Events

### datepicker.change

Fired when date is changed by user or programatically:

```js
document.addEventListener('datepicker.change', (event) => {
  event.target     // The datepicker
  event.detail     // The new date that triggered change
})
```

### datepicker.click.day

Fired if the user clicks a day in the month days grid. The `datepicker.click.day` runs before `datepicker.change`:

```js
document.addEventListener('datepicker.click.day', (event) => {
  event.target     // The datepicker
})
```

## Properties

`@nrk/core-datepicker` defaults to Norwegian Bookmål text without abbreviations (writing `September` instead of `Sept`). This can be configured by setting the `days` and `months` properties. Note that abbreviations should always be at least 3 characters long to ensure a better experience for screen reader users (for instance writing `Mon`, `Tue`... instead of `m`, `t`...).

```js
myDatepicker.days = ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'] // Change name of days
myDatepicker.months = ['jan', 'feb', ...] // Change name of months
myDatepicker.disabled = (date) => date > Date.now() // Disable future dates
myDatepicker.disabled = false // Enable all dates
```


## Styling

### CSS

```css
.my-datepicker                                /* Target datepicker container */
.my-datepicker input:checked                  /* Target selected checkbox/radio dates */
.my-datepicker input:disabled                 /* Target disabled checkbox/radio dates */
.my-datepicker button:disabled                /* Target disabled dates */
.my-datepicker button[autofocus]              /* Target the chosen date in month view */
.my-datepicker button[aria-current="date"]    /* Target current date (today) in month view */
.my-datepicker button[data-adjacent="false"]  /* Target date in current month in the month view */
.my-datepicker button[data-adjacent="true"]   /* Target date in next or previous month in the month view */
```
