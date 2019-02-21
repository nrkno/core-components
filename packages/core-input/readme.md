# Core Input

> `@nrk/core-input` enhances `<input>` fields with keyboard accessible functionality for autocomplete suggestions, search results and smart select box abilities.



## Installation

```bash
npm install @nrk/core-input --save-exact
```
```js
import coreInput from '@nrk/core-input'     // Vanilla JS
import CoreInput from '@nrk/core-input/jsx' // React/Preact JSX
```

<!--demo
<script src="core-input/core-input.min.js"></script>
<script src="core-input/core-input.jsx.js"></script>
<style>li button:focus {outline: 3px solid rgb(94, 158, 215)}</style>
demo-->

## Demo

```html
<!--demo-->
<input type="text" class="my-input" placeholder="Type &quot;C&quot;...">
<ul hidden>
  <li><button>Chrome</button></li>
  <li><button>Firefox</button></li>
  <li><button>Opera</button></li>
  <li><button>Safari</button></li>
  <li><button>Microsoft Edge</button></li>
</ul>
<script>
  coreInput('.my-input')
</script>
```

```html
<!--demo-->
<div id="jsx-input"></div>
<script type="text/jsx">
  ReactDOM.render(<CoreInput>
    <input type='text' placeholder='Type "C"... (JSX)' />
    <ul className='my-dropdown'>
      <li><button>Chrome</button></li>
      <li><button>Firefox</button></li>
      <li><button>Opera</button></li>
      <li><button>Safari</button></li>
      <li><button>Microsoft Edge</button></li>
    </ul>
  </CoreInput>, document.getElementById('jsx-input'))
</script>
```



## Usage

Typing toggles the [hidden attribute](https://developer.mozilla.org/en/docs/Web/HTML/Global_attributes/hidden) on items of type `<button>` and `<a>`, based on matching [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent). Focusing the input unhides the following element. The default filtering behavior can easily be altered through the The default filtering behavior can easily be altered through the `'input.select'`, `'input.filter'`, `'input.ajax'` and  `'input.ajax.beforeSend'` [events](#events). 

Results will be rendered in the element directly after the `<input>`.
Always use `coreInput.escapeHTML(String)` to safely render data from API or user.

### HTML / JavaScript


```html
<input type="text" class="my-input">                  <!-- Input element must be a textual <input> -->
<ul hidden>                                           <!-- Can be any tag, but items should be inside <li> -->
  <li><button>Item 1</button></li>                    <!-- Items must be <button> or <a> -->
  <li><button value="Suprise!">Item 2</button></li>   <!-- Alternative value can be defined -->
  <li><a href="https://www.nrk.no/">NRK.no</a></li>   <!-- Actual links are recommended when applicable -->
</ul>
```
```js
import coreInput from '@nrk/core-input'

coreInput(String|Element|Elements, {    // Accepts a selector string, NodeList, Element or array of Elements
  open: Boolean,                        // Optional. Defaults to value of aria-expanded. Use to force open state
  content: String,                      // Optional. Set String of HTML content. HTML is used for full flexibility on markup
  ajax: String                          // Optional. Fetch external data, example: "https://search.com?q={{value}}"
})

// Passing a string as second argument sets the 'content' option
coreInput('.my-input', '<li><a href="?q=' + coreInput.escapeHTML(input.value) + '">More results</a></li>') // escape html
coreInput('.my-input', '<li><button>' + coreInput.highlight(item.text, input.value) + '</button></li>') // highlight match
```

### React / Preact

```js
import CoreInput from '@nrk/core-input/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <CoreInput> will handle state itself unless you call event.preventDefault() in onFilter, onSelect or onAjax

<CoreInput open={false} onFilter={(event) => {}} onSelect={(event) => {}} onAjax={(event) => {}} ajax="https://search.com?q={{value}}">
  <input type="text" />   // First element must result in a input-tag. Accepts both elements and components
  <ul>                    // Next element will be used for items. Accepts both elements and components
    <li><button>Item 1</button></li>                  // Interactive items must be <button> or <a>
    <li><button value="Suprise!">Item 2</button></li> // Alternative value can be defined
    <li><a href="https://www.nrk.no/">NRK.no</a></li> // Actual links are recommended when applicable
  </ul>
</CoreInput>
```



## Events

### input.filter
`'input.filter'` is fired before a default filtering (both for VanillaJS and React/Preact components). The `input.filter` event is cancelable, meaning you can use `event.preventDefault()` to cancel default filtering and respond to users typing yourself. The event also bubbles, and can therefore be detected both from the input element itself, or any parent element (read event delegation):

```js
document.addEventListener('input.filter', (event) => {
  event.target                // The core-input element triggering input.filter event
  event.detail.relatedTarget  // The content element controlled by input
})
```

### input.select
`'input.select'` event is fired when the user clicks/selects a item (both for VanillaJS and React/Preact components). The `input.select` event is cancelable, meaning you can use `event.preventDefault()` to cancel replacing the input value and handle select-action yourself. The event also bubbles, and can therefore be detected both from the button element itself, or any parent element (read event delegation):

```js
document.addEventListener('input.select', (event) => {
  event.target                // The core-input element triggering input.select event
  event.detail.relatedTarget  // The content element controlled by input
  event.detail.currentTarget  // The item clicked/selected
  event.detail.value          // The item value
})
```

### input.ajax.beforeSend
The `'input.ajax.beforeSend'` event is fired before sending debounced ajax requests. If you wish to alter the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), use `event.preventDefault()` and then execute [XHR methods](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Methods) on the `event.detail`. If not prevented, requests are sent using the `GET` method and the header `'X-Requested-With': 'XMLHttpRequest'`. The event bubbles, and can therefore be detected both from the input element itself, or any parent element (read event delegation):

```js
document.addEventListener('input.ajax.beforeSend', (event) => {
  event.target  // The core-input element triggering input.ajax.beforeSend event
  event.detail  // The XMLHttpRequest object
})
```

```js
// Example
document.addEventListener('input.ajax.beforeSend', (event) => {
  event.preventDefault() // Stop default behaviour
  event.detail.open('POST', 'https://example.com')
  event.detail.setRequestHeader('Content-Type', 'application/json')
  event.detail.setRequestHeader('my-custom-header', 'my-custom-value')
  event.detail.send(JSON.stringify({query: event.target.value}))
})
```

### input.ajax
`'input.ajax'` event is fired when the input field receives data from ajax. The event also bubbles, and can therefore be detected both from the input element itself, or any parent element (read event delegation):

```js
document.addEventListener('input.ajax', (event) => {
  event.target  // The core-input element triggering input.ajax event
  event.detail  // The ajax request
  event.detail.responseText  // The response body text
  event.detail.responseJSON  // The response json. Defaults to false if no valid JSON found
})
```



## Styling
All styling in documentation is example only. Both the `<button>` and content element receive attributes reflecting the current toggle state:

```css
.my-input {}                          /* Target input in any state */
.my-input[aria-expanded="true"] {}    /* Target only open button */
.my-input[aria-expanded="false"] {}   /* Target only closed button */

.my-input-content {}                  /* Target content element in any state */
.my-input-content:not([hidden]) {}    /* Target only open content */
.my-input-content[hidden] {}          /* Target only closed content */

.my-input-content :focus {}           /* Target focused item */
.my-input-content mark {}             /* Target highlighted text */
```



## Notes

### Ajax

When using `@nrk/core-input` with the `ajax: https://search.com?q={{value}}` functionality, make sure to implement both a `Searching...` status (while fetching data from the server), and a `No hits` status (if server responds with no results). These status indicators are highly recommended, but not provided by default as the context of use will affect the optimal textual formulation. [See example implementation →](#demo-ajax)

If you need to alter default headers, request method or post data, use the [`input.ajax.beforeSend` event  →](#input-ajax-beforesend)



## Demo: Ajax

Ajax requests can be stopped by calling `event.preventDefault()` on `'input.filter'`. Remember to always escape html and debounce requests when fetching data from external sources. The http request sent by `@nrk/core-input` will have header `X-Requested-With: XMLHttpRequest` for easier [server side detection and CSRF prevention](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet#Protecting_REST_Services:_Use_of_Custom_Request_Headers).

```html
<!--demo-->
<input class="my-input-ajax" placeholder="Country...">
<ul class="my-dropdown" hidden></ul>
<script>
  // Initialize
  coreInput('.my-input-ajax', {
    ajax: 'https://restcountries.eu/rest/v2/name/{{value}}?fields=name'
  })
  document.addEventListener('input.filter', function (event) {
    var input = event.target
    var value = input.value.trim()

    if (input.className.indexOf('my-input-ajax') === -1) return // Make sure we are on correct input
    coreInput(input, value ? '<li><button>Searching for ' + coreInput.highlight(value, value) + '...</button></li>' : '')
  })
  document.addEventListener('input.ajax', function (event) {
    if (event.target.className.indexOf('my-input-ajax') === -1) return // Make sure we are on correct input
    var items = event.detail.responseJSON
    coreInput(event.target, items.length ? items.slice(0, 10)
      .map(function (item) { return coreInput.highlight(item.name, event.target.value) }) // Hightlight items
      .map(function (html) { return '<li><button>' + html + '</button></li>' })           // Generate list
      .join('') : '<li><button>No results</button></li>')
  })
</script>
```

```html
<!--demo-->
<div id="jsx-input-ajax"></div>
<script type="text/jsx">
  class AjaxInput extends React.Component {
    constructor (props) {
      super(props)
      this.onFilter = this.onFilter.bind(this)
      this.onAjax = this.onAjax.bind(this)
      this.state = { items: [], value: '' }
    }
    onFilter (event) {
      const value = event.target.value
      const items = value ? [{name: `Searching for ${value}...`}] : []

      this.setState({value, items}) // Store value for highlighting
    }
    onAjax (event) {
      const items = event.detail.responseJSON
      this.setState({items: items.length ? items : [{name: 'No results'}]})
    }
    render () {
      return <CoreInput
       ajax="https://restcountries.eu/rest/v2/name/{{value}}?fields=name"
       onFilter={this.onFilter}
       onAjax={this.onAjax}>
        <input type='text' placeholder='Country... (JSX)' />
        <ul className='my-dropdown'>
          {this.state.items.slice(0, 10).map((item, key) =>
            <li key={key}>
              <button>
                <CoreInput.Highlight text={item.name} query={this.state.value} />
              </button>
            </li>
          )}
        </ul>
      </CoreInput>
    }
  }
  ReactDOM.render(<AjaxInput />, document.getElementById('jsx-input-ajax'))
</script>
```



## Demo: Lazy
Hybrid solution; lazy load items, but let `core-input` still handle filtering:
```html
<!--demo-->
<input class="my-input-lazy" placeholder="Country...">
<ul class="my-dropdown" hidden></ul>
<script>
  window.getCountries = function (callback) {
    var xhr = new XMLHttpRequest()
    var url = 'https://restcountries.eu/rest/v2/?fields=name'

    xhr.onload = function () { callback(JSON.parse(xhr.responseText)) }
    xhr.open('GET', url, true)
    xhr.send()
  }

  document.addEventListener('focus', function (event) {
    if (event.target.className.indexOf('my-input-lazy') === -1) return // Make sure we are on correct input

    event.target.className = '' // Prevent double execution
    window.getCountries(function (items) {
      coreInput(event.target, items
        .map(function (item) { return '<li><button>' + coreInput.escapeHTML(item.name) + '</button></li>'})
        .join(''))
    })
  }, true)
</script>
```

```html
<!--demo-->
<div id="jsx-input-lazy"></div>
<script type="text/jsx">
  class LazyInput extends React.Component {
    constructor (props) {
      super(props)
      this.onFocus = this.onFocus.bind(this)
      this.state = {items: []}
    }
    onFocus (event) {
      this.onFocus = null // Load items only on first interaction
      window.getCountries((items) => this.setState({items})) // getCountries defined in JS
    }
    render () {
      return <CoreInput onFocus={this.onFocus}>
        <input type='text' placeholder='Country... (JSX)' />
        <ul className='my-dropdown'>
          {this.state.items.map((item, key) =>
            <li key={key}><button>{item.name}</button></li>
          )}
        </ul>
      </CoreInput>
    }
  }

  ReactDOM.render(<LazyInput />, document.getElementById('jsx-input-lazy'))
</script>
```



## Demo: Dynamic
Synchronous operation; dynamically populating items based input value:
```html
<!--demo-->
<input class="my-input-dynamic" placeholder="Type your email...">
<ul class="my-dropdown" hidden></ul>
<script>
  coreInput('.my-input-dynamic')

  document.addEventListener('input.filter', (event) => {
    if (event.target.className.indexOf('my-input-dynamic') === -1) return // Make sure we are on correct input
    event.preventDefault()

    var mails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']
    var input = event.target
    var value = input.value.trim()

    coreInput(input, value ? mails.map(function (mail) {
      return '<li><button>' + coreInput.highlight(value.replace(/(@.*|$)/, '@' + mail), value) + '</button><li>'
    }).join('') : '')
  })
</script>
```

```html
<!--demo-->
<div id="jsx-input-dynamic"></div>
<script>
  class DynamicInput extends React.Component {
    constructor (props) {
      super(props)
      this.onFilter = this.onFilter.bind(this)
      this.mails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']
      this.state = {items: []}
    }
    onFilter (event) {
      const value = event.target.value.trim()
      const items = value ? this.mails.map((mail) => value.replace(/(@.*|$)/, `@${mail}`)) : []

      event.preventDefault()
      this.setState({value, items})
    }
    render () {
      return <CoreInput onFilter={this.onFilter}>
        <input type='text' placeholder='Type your email... (JSX)' />
        <ul className='my-dropdown'>
          {this.state.items.map((text, key) =>
            <li key={key}><button><CoreInput.Highlight text={text} query={this.state.value} /></button></li>
          )}
        </ul>
      </CoreInput>
    }
  }

  ReactDOM.render(<DynamicInput />, document.getElementById('jsx-input-dynamic'))
</script>
```



## FAQ

### Why not use `<datalist>` instead?
Despite having a native [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element for autocomplete lists, there are several issues regarding [browser support](https://caniuse.com/#feat=details), varying [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/) support as well as no ability for custom styling or custom behavior.

### Why is there only a subset of aria attributes in use?
Despite well documented [examples in the aria 1.1 spesification](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html), "best practice" simply becomes unusable in several screen reader due to implementation differences. `core-input` aims to provide a equally good user experience regardless if a screen reader passes events to browser or not (events are often hijacked for quick-navigation). Several techniques and attributes have been thoroughly tested:

- `aria-activedescendant`/`aria-selected` - ignored in Android, lacks indication of list length in JAWS</li>
- `aria-owns` - full list is read for every keystroke in NVDA</li>
- `role="listbox"` - VoiceOver needs aria-selected to falsely announce "0 selected"</li>
- `role="option"` - falsely announces links and buttons as "text"</li>
- `aria-live="assertive"` - fails to correctly inform user if current target is link or button</li>
- `role="combobox"` - skipped in iOS as VoiceOver fails to inform current field is editable</li>

### How do I use core-input with multiple tags/output values?
Tagging and screen readers is a complex matter, requiring more than comma separated values. Currently, tagging is just a part of the wishlist for core-input. If tagging functionality is of interest for your project, please add a +1 to the [tagging task](https://github.com/nrkno/core-components/issues/9), describe your needs in a comment, and you'll be updated about progress.
