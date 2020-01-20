# Core Suggest

<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script>
  window.React = preactCompat
  window.ReactDOM = preactCompat
</script> -->
<!--demo
<script src="https://unpkg.com/@webcomponents/custom-elements"></script>
<script src="core-suggest/core-suggest.min.js"></script>
<script src="core-suggest/core-suggest.jsx.js"></script>
<style>
li button:focus {outline: 3px solid rgb(94, 158, 215)}
label {display: block}
</style>
demo-->

> `@nrk/core-suggest` enhances an input, providing keyboard accessible functionality for autocompletion,
> search results and smart select box abilities and automatic highlighting. Results can be with fetched directly from markup
> or from a custom endpoint with AJAX.


## Example

```html
<!--demo-->
<label for="my-input">Search</label>
<input id="my-input" type="text" placeholder="Type something...">
<core-suggest hidden>
  <ul>
    <li><button>Chro<b>me</b></button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
</core-suggest>
```

```html
<!--demo-->
<div id="jsx-input"></div>
<script type="text/jsx">
  ReactDOM.render(<div>
    <label for="my-input-jsx">Search JSX</label>
    <input id='my-input-jsx' type='text' placeholder='Type something...' />
    <CoreSuggest className='my-dropdown' hidden>
      <ul>
        <li><button>Chrome</button></li>
        <li><button>Firefox</button></li>
        <li><button>Opera</button></li>
        <li><button>Safari</button></li>
        <li><button>Microsoft Edge</button></li>
      </ul>
    </CoreSuggest>
  </div>, document.getElementById('jsx-input'))
</script>
```

## Installation

Using NPM provides own element namespace and extensibility.
Recommended:

```bash
npm install @nrk/core-suggest  # Using NPM
```

Using static registers the custom element with default name automatically:

```html
<script src="https://static.nrk.no/core-components/major/7/core-suggest/core-suggest.min.js"></script>  <!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills#custom-elements) custom elements if needed.


## Usage

Typing into the input toggles the [hidden attribute](https://developer.mozilla.org/en/docs/Web/HTML/Global_attributes/hidden) on items of type `<button>` and `<a>`, based on matching [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) inside `<core-suggest>`. Focusing the input unhides the following element. The default filtering behavior can easily be altered through the `'suggest.select'`, `'suggest.filter'`, `'suggest.ajax'` and  `'suggest.ajax.beforeSend'` [events](#events).

Results will be rendered in the element inside `<core-suggest>`.
Always use `coreSuggest.escapeHTML(String)` to safely render data from API or user.

### HTML / JavaScript


```html
<input type="text"                                      <!-- Must be a textual input element -->
       list="{String}">                                 <!-- Optional. Specify id of suggest element -->
<core-suggest limit="{Number}"                          <!-- Optional. Limit maxium number of result items. Defaults to Infinity -->
              ajax="{String}"                           <!-- Optional. Fetches external data. See event 'suggest.ajax'. Example: 'https://search.com?q={{value}}' -->
              hidden>                                   <!-- Use hidden to toggle visibility -->
  <ul>                                                  <!-- Can be any tag, but items should be inside <li> -->
    <li><button>Item 1</button></li>                    <!-- Items must be <button> or <a> -->
    <li><button value="Suprise!">Item 2</button></li>   <!-- Alternative value can be defined -->
    <li><a href="https://www.nrk.no/">NRK.no</a></li>   <!-- Actual links are recommended when applicable -->
  </ul>
</core-suggest>
```

```js
import CoreSuggest from '@nrk/core-suggest'                 // Using NPM
window.customElements.define('core-suggest', CoreSuggest)   // Using NPM. Replace 'core-suggest' with 'my-suggest' to namespace

const mySuggest = document.querySelector('core-suggest')

// Getters
mySuggest.ajax       // Get ajax URL value
mySuggest.limit      // Get limit
mySuggest.hidden     // Get hidden
mySuggest.input      // Get input for suggest
// Setters
mySuggest.ajax = "https://search.com?q={{value}}"    // Set ajax endpoint URL for fetching external data.
mySuggest.limit = 5                                  // Set limit for results
mySuggest.hidden = false                             // Set hidden value
// Methods
mySuggest.escapeHTML('<span>...</span>')             // Utility function for escaping HTML string
```

### React / Preact

```js
import CoreSuggest from '@nrk/core-suggest/jsx'

<input type="text"                         // First element result in an input-tag. Accepts both elements and components
       list="{String}" />                  // Optional. Specify id of suggest element
<CoreSuggest id={String}                   // Suggestion list
             hidden={Boolean}              // Use hidden to toggle visibility
             limit={Number}                // Limit the maximum number of results in list.
             ajax={String}                 // Fetches external data. See event 'suggest.ajax'. Example: 'https://search.com?q={{value}}'
             ref={(comp) => {}}                   // Optional. Get reference to React component
             forwardRef={(el) => {}}              // Optional. Get reference to underlying DOM custom element
             onSuggestFilter={Function}           // See 'suggest.filter' event
             onSuggestSelect={Function}           // See 'suggest.select' event
             onSuggestAjax={Function}             // See 'suggest.ajax' event
             onSuggestAjaxError={Function}        // See 'suggest.ajax.error' event
             onSuggestAjaxBeforeSend={Function}>  // See 'suggest.ajax.beforeSend' event
  <ul>                    // Next element will be used for items. Accepts both elements and components
    <li><button>Item 1</button></li>                  // Interactive items must be <button> or <a>
    <li><button value="Suprise!">Item 2</button></li> // Alternative value can be defined
    <li><a href="https://www.nrk.no/">NRK.no</a></li> // Actual links are recommended when applicable
  </ul>
</CoreSuggest>
```

## Markup

### With list

Putting the input directly before the suggestion list is highly recommended, as this fulfills all accessibility requirements by default. There might be scenarios though, where styling makes this DOM structure impractical. In such cases, give the `<input>` a `list` attribute, and the `<core-suggest>` an `id` with corresponding value. Make sure there is no text between the input and the suggestion list, as this will break the experience for screen reader users:

```html
<label>
  <input list="my-list" type="text" placeholder="...">
</label>
<core-suggest id="my-list" hidden>
  ...
</core-suggest>
```


## Events

### suggest.filter
Fired before a default filtering occurs:

```js
document.addEventListener('suggest.filter', (event) => {
  event.target      // The core-suggest element
})
```

### suggest.select
Fired when an item is clicked/selected:

```js
document.addEventListener('suggest.select', (event) => {
  event.target        // The core-suggest element
  event.target.value  // The selected data
  event.detail        // The selected element
})
```

### suggest.ajax.beforeSend
Fired before sending debounced ajax requests. If you wish to alter the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), use `event.preventDefault()` and then execute [XHR methods](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Methods) on the `event.detail`. If not prevented, requests are sent using the `GET` method and the header `'X-Requested-With': 'XMLHttpRequest'`.

```js
document.addEventListener('suggest.ajax.beforeSend', (event) => {
  event.target  // The core-suggest element
  event.detail  // The XMLHttpRequest object
})
```

```js
// Example
document.addEventListener('suggest.ajax.beforeSend', (event) => {
  const xhr = event.detail
  event.preventDefault() // Stop default behaviour
  xhr.open('POST', 'https://example.com')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('my-custom-header', 'my-custom-value')
  xhr.send(JSON.stringify({query: event.target.input.value}))
})
```

### suggest.ajax
Fired when the input field receives data from ajax:

```js
document.addEventListener('suggest.ajax', (event) => {
  event.target  // The core-suggest element
  event.detail  // The XMLHttpRequest object
  event.detail.responseText  // The response body text
  event.detail.responseJSON  // The response json. Defaults to false if no valid JSON found
})
```

### suggest.ajax.error
Fired when the request fails either due to a bad request (bad URL, non-200 response), an network error or a JSON parse error. Inspect `xhr.status` and `xhr.statusText` for bad requests and `xhr.responseError` for other errors:

```js
document.addEventListener('suggest.ajax.error', (event) => {
  event.target  // The core-suggest element
  event.detail  // The XMLHttpRequest object
  event.detail.status         // The response status code
  event.detail.statusText     // The response status text
  event.detail.responseError  // The error message for ajax errors/json parse errors
})
```

```js
// Example
document.addEventListener('suggest.ajax.error', (event) => {
  const xhr = event.detail
  if (xhr.status !== 200) {
    if (xhr.responseError) {             // Network error / JSON parse error
      console.log(xhr.responseError)     // Log error message
    } else {                             // Bad request
      console.log(xhr.statusText)        // Log status text
      console.log(xhr.responseText)      // Log response text
    }
  }
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
.my-input-content mark {}             /* Target highlighted text (set `background: none;` to disable highlighting) */
```


## Notes

### Ajax

When using `@nrk/core-suggest` with the `ajax: https://search.com?q={{value}}` functionality, make sure to implement both a `Searching...` status (while fetching data from the server), and a `No hits` status (if server responds with no results). These status indicators are highly recommended, but not provided by default as the context of use will affect the optimal textual formulation. [See example implementation →](#example-ajax)

If you need to alter default headers, request method or post data, use the [`suggest.ajax.beforeSend` event  →](#input-ajax-beforesend)



## Example: Ajax

Ajax requests can be stopped by calling `event.preventDefault()` on `'suggest.filter'`. Remember to always escape html and debounce requests when fetching data from external sources. The http request sent by `@nrk/core-suggest` will have header `X-Requested-With: XMLHttpRequest` for easier [server side detection and CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

```html
<!--demo-->
<input id="my-input-ajax" placeholder="Country...">
<core-suggest ajax="https://restcountries.eu/rest/v2/name/{{value}}?fields=name" hidden></core-suggest>
<script>
  document.addEventListener('suggest.filter', (event) => {
    const suggest = event.target
    const input = suggest.input
    const value = input.value.trim()

    if (input.id !== 'my-input-ajax') return // Make sure we are on correct input
    suggest.innerHTML = value ? `<ul><li><button>Searching for ${value}...</button></li></ul>` : ''
  })
  document.addEventListener('suggest.ajax', (event) => {
    const suggest = event.target
    const input = suggest.input
    if (input.id !== 'my-input-ajax') return // Make sure we are on correct input
    const items = event.detail.responseJSON
    suggest.innerHTML = `<ul>${items.length ? items.slice(0, 10)
      .map((item) => { return `<li><button>${suggest.escapeHTML(item.name)}</button></li>` })           // Generate list
      .join('') : '<li><button>No results</button></li>'}</ul>`
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
      const suggest = event.target
      const value = suggest.input.value
      const items = value ? [{name: `Searching for ${value}...`}] : []

      this.setState({value, items}) // Store value for rendering
    }
    onAjax (event) {
      const items = event.detail.responseJSON
      this.setState({items: items.length ? items : [{name: 'No results'}]})
    }
    render () {
      return <div>
        <input type='text' placeholder='Country... (JSX)' />
        <CoreSuggest
         ajax="https://restcountries.eu/rest/v2/name/{{value}}?fields=name"
         onSuggestFilter={this.onFilter}
         onSuggestAjax={this.onAjax}>
          <ul>
            {this.state.items.slice(0, 10).map((item, key) =>
              <li key={key}>
                <button>{item.name}</button>
              </li>
            )}
          </ul>
        </CoreSuggest>
      </div>
    }
  }
  ReactDOM.render(<AjaxInput />, document.getElementById('jsx-input-ajax'))
</script>
```



## Example: Lazy
Hybrid solution; lazy load items, but let `core-suggest` still handle filtering:
```html
<!--demo-->
<input id="my-input-lazy" placeholder="Country...">
<core-suggest hidden></core-suggest>
<script>
  window.getCountries = (callback) => {
    const xhr = new XMLHttpRequest()
    const url = 'https://restcountries.eu/rest/v2/?fields=name'

    xhr.onload = () => callback(JSON.parse(xhr.responseText))
    xhr.open('GET', url, true)
    xhr.send()
  }

  document.addEventListener('focus', (event) => {
    if (event.target.id !== 'my-input-lazy') return // Make sure we are on correct input
    const input = event.target
    const suggest = input.nextElementSibling
    input.id = '' // Prevent double execution
    window.getCountries((items) => {
      suggest.innerHTML = `<ul>${items.map((item) =>
        '<li><button>' + suggest.escapeHTML(item.name) + '</button></li>'
      ).join('')}</ul>`
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
      return <div>
        <input type='text' placeholder='Country... (JSX)' onFocus={this.onFocus} />
        <CoreSuggest>
          <ul className='my-dropdown'>
            {this.state.items.map((item, key) =>
              <li key={key}><button>{item.name}</button></li>
            )}
          </ul>
        </CoreSuggest>
      </div>
    }
  }

  ReactDOM.render(<LazyInput />, document.getElementById('jsx-input-lazy'))
</script>
```



## Example: Dynamic
Synchronous operation; dynamically populating items based input value:
```html
<!--demo-->
<input id="my-input-dynamic" placeholder="Type your email...">
<core-suggest hidden></core-suggest>
<script>
  document.addEventListener('suggest.filter', (event) => {
    const suggest = event.target
    const input = suggest.input
    const value = input.value.trim()
    const mails = ['facebook.com', 'gmail.com', 'hotmail.com', 'mac.com', 'mail.com', 'msn.com', 'live.com']

    if (input.id !== 'my-input-dynamic') return // Make sure we are on correct input
    event.preventDefault()
    suggest.innerHTML = `<ul>${value ? mails.map((mail) => {
      return '<li><button>' + value.replace(/(@.*|$)/, '@' + mail) + '</button></li>'
    }).join('') : ''}</ul>`
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
      const suggest = event.target
      const value = suggest.input.value.trim()
      const items = value ? this.mails.map((mail) => value.replace(/(@.*|$)/, `@${mail}`)) : []

      event.preventDefault()
      this.setState({value, items})
    }
    render () {
      return <div>
        <input type='text' placeholder='Type your email... (JSX)' />
        <CoreSuggest onSuggestFilter={this.onFilter}>
          <ul className='my-dropdown'>
            {this.state.items.map((text, key) =>
              <li key={key}><button>{text}</button></li>
            )}
          </ul>
        </CoreSuggest>
      </div>
    }
  }

  ReactDOM.render(<DynamicInput />, document.getElementById('jsx-input-dynamic'))
</script>
```



## FAQ

### Why not use `<datalist>` instead?
Despite having a native [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element for autocomplete lists, there are several issues regarding [browser support](https://caniuse.com/#feat=details), varying [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/) support as well as no ability for custom styling or custom behavior.

### Why is there only a subset of aria attributes in use?
Despite well documented [examples in the aria 1.1 spesification](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html), "best practice" simply becomes unusable in several screen reader due to implementation differences. `core-suggest` aims to provide a equally good user experience regardless if a screen reader passes events to browser or not (events are often hijacked for quick-navigation). Several techniques and attributes have been thoroughly tested:

- `aria-activedescendant`/`aria-selected` - ignored in Android, lacks indication of list length in JAWS</li>
- `aria-owns` - full list is read for every keystroke in NVDA</li>
- `role="listbox"` - VoiceOver needs aria-selected to falsely announce "0 selected"</li>
- `role="option"` - falsely announces links and buttons as "text"</li>
- `aria-live="assertive"` - fails to correctly inform user if current target is link or button</li>
- `role="combobox"` - skipped in iOS as VoiceOver fails to inform current field is editable</li>

### How do I use core-suggest with multiple tags/output values?
Tagging and screen readers is a complex matter, requiring more than comma separated values. Currently, tagging is just a part of the wishlist for core-suggest. If tagging functionality is of interest for your project, please add a +1 to the [tagging task](https://github.com/nrkno/core-components/issues/9), describe your needs in a comment, and you'll be updated about progress.
