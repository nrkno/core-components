---
name: Input
category: Components
---

> `@nrk/core-input` enhances `<input>` fields with keyboard accessible functionality for autocomplete suggestions, search results and smart select box abilities. The default filtering behavior can easily be altered through the `'input.select'` and `'input.filter'` [events](#events).
[Check out advanced examples →](#advanced-examples)

## Default filtering

Typing toggles the [hidden attribute](https://developer.mozilla.org/en/docs/Web/HTML/Global_attributes/hidden) on items of type `<button>` and `<a>`, based on matching [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent):

```input.html
<input type="text" class="my-input" placeholder="Type &quot;C&quot;...">
<ul class="my-dropdown" hidden>
  <li><button>Chrome</button></li>
  <li><button>Firefox</button></li>
  <li><button>Opera</button></li>
  <li><button>Safari</button></li>
  <li><button>Microsoft Edge</button></li>
</ul>
```
```input.js
coreInput('.my-input')
```
```input.jsx
<Input>
  <input type='text' placeholder='Type "C"... (JSX)' />
  <ul className='my-dropdown'>
    <li><button>Chrome</button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
</Input>
```

## Usage

**Important:** Use `coreInput.escapeHTML(String)` to safely render data from API or user.

```html
<input type="text" class="my-input">                  <!-- Input element must be a <input> -->
<ul hidden>                                           <!-- Can be any tag, but items should be inside <li> -->
  <li><button>Item 1</button></li>                    <!-- Items must be <button> or <a> -->
  <li><button value="Suprise!">Item 2</button></li>   <!-- Alternative value can be defined -->
  <li><a href="https://www.nrk.no/">NRK.no</a></li>   <!-- Actual links are recommended when applicable -->
</ul>
```
```js
import coreInput from '@nrk/core-input'

coreInput(String|Element|Elements, {        // Accepts a selector string, NodeList, Element or array of Elements
  open: null,                               // Defaults to value of aria-expanded. Use true|false to force open state
  content: null                             // Set String of HTML content. HTML is used for full flexibility on markup
})

// Helpers:
coreInput('.my-input', '<li><a href="?q=' + coreInput.escapeHTML(input.value) + '">More results</a></li>') // escape html
coreInput('.my-input', '<li><button>' + coreInput.highlight(item.text, input.value) + '</button></li>') // highlight match
```
```jsx
import Input from '@nrk/core-input/jsx'

// All props are optional, and defaults are shown below
// Props like className, style, etc. will be applied as actual attributes
// <Input> will handle state itself unless you call event.preventDefault() in onFilter or onSelect

<Input open={false} onFilter={(event) => {}} onSelect={(event) => {}}>
  <input type="text" />   // First element must result in a input-tag. Accepts both elements and components
  <ul>                    // Next element will be used for items. Accepts both elements and components
    <li><button>Item 1</button></li>                  // Interactive items must be <button> or <a>
    <li><button value="Suprise!">Item 2</button></li> // Alternative value can be defined
    <li><a href="https://www.nrk.no/">NRK.no</a></li> // Actual links are recommended when applicable
  </ul>
</Input>
```

## Events
`'input.filter'` is fired before a default filtering (both for VanillaJS and React/Preact components). The `input.filter` event is cancelable, meaning you can use `event.preventDefault()` to cancel default filtering and respond to users typing yourself. The event also bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):


```js
document.addEventListener('input.filter', (event) => {
  event.target                // The core-input element triggering input.filter event
  event.detail.relatedTarget  // The content element controlled by input
})
```

`'input.select'` event is fired when the user clicks/selects a item (both for VanillaJS and React/Preact components). The `input.select` event is cancelable, meaning you can use `event.preventDefault()` to cancel replacing the input value and handle select-action yourself. The event also bubbles, and can therefore be detected both from button element itself, or any parent element (read event delegation):

```js
document.addEventListener('input.select', (event) => {
  event.target                // The core-input element triggering input.filter event
  event.detail.relatedTarget  // The content element controlled by input
  event.detail.currentTarget  // The item clicked/selected
  event.detail.value          // The item value
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

## Advanced examples

## Input with ajax results
You can stop default filtering by calling `event.preventDefault()` on `'input.filter'`. Remember to always escape html and debounce requests when fetching data from external sources.

```input-ajax.html
<input class="my-input-ajax" placeholder="Country...">
<ul class="my-dropdown" hidden></ul>
```
```input-ajax.js
// Always debounce and abort requests avoid spamming APIs. Example:
window.getCountries = function (query, callback) {
  var self = window.getCountries
  var xhr = self.xhr = self.xhr || new XMLHttpRequest()
  var url = 'https://restcountries.eu/rest/v2/name/' +  encodeURIComponent(query) + '?fields=name'

  clearTimeout(self.timer) // Clear previous search
  xhr.abort() // Abort previous request
  xhr.onload = function () { callback(JSON.parse(xhr.responseText)) }
  self.timer = setTimeout(function () { // Debounce next request 500 milliseconds
    xhr.open('GET', url, true)
    xhr.send()
  }, 500)
}

coreInput('.my-input-ajax') // Initialize

document.addEventListener('input.filter', function (event) {
  if (event.target.className.indexOf('my-input-ajax') === -1) return // Make sure we are on correct input
  event.preventDefault()  // Stop coreInput from default filtering

  var input = event.target
  var value = input.value.trim()
  if (!value) return coreInput(input, '') // Prevent empty searches

  coreInput(input, '<li><a>Searching for ' + coreInput.highlight(value, value) + '...</a></li>')
  window.getCountries(value, function (items) {
    coreInput(input, items.length ? items.slice(0, 10)
      .map(function (item) { return coreInput.highlight(item.name, value) })    // Hightlight items
      .map(function (html) { return '<li><button>' + html + '</button></li>' }) // Generate list
      .join('') : '<li><a>No results</a></li>')
  })
})
```
```input-ajax.jsx
class AjaxInput extends React.Component {
  constructor (props) {
    super(props)
    this.onFilter = this.onFilter.bind(this)
    this.state = { items: [], value: '' }
  }
  onFilter (event) {
    event.preventDefault() // Stop coreInput from default filtering

    const value = event.target.value.trim()
    if (!value) return this.setState({items: []}) // Prevent empty searches

    this.setState({
      value: value, // Store value for highlighting
      items: [{name: `Searching for ${value}...`}]
    })
    window.getCountries(value, (data) => { // getCountries defined in JS
      this.setState({items: data.length ? data : [{name: 'No results'}]})
    })
  }
  render () {
    return <Input onFilter={this.onFilter}>
      <input type='text' placeholder='Country... (JSX)' />
      <ul className='my-dropdown'>
        {this.state.items.slice(0, 10).map((item, key) =>
          <li key={key}>
            <button>
              <Input.Highlight text={item.name} query={this.state.value} />
            </button>
          </li>
        )}
      </ul>
    </Input>
  }
}
<AjaxInput />
```

## Input with lazy results
You can also do a hybrid; lazy load items, but let `core-input` still handle filtering:
```input-lazy.html
<input class="my-input-lazy" placeholder="Country...">
<ul class="my-dropdown" hidden></ul>
```
```input-lazy.js
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
```
```input-lazy.jsx
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
    return <Input onFocus={this.onFocus}>
      <input type='text' placeholder='Country... (JSX)' />
      <ul className='my-dropdown'>
        {this.state.items.map((item, key) =>
          <li key={key}><button>{item.name}</button></li>
        )}
      </ul>
    </Input>
  }
}

<LazyInput />
```

## Input with dynamic results
You can also do synchronous operations, like dynamically populating items based input value:
```input-dynamic.html
<input class="my-input-dynamic" placeholder="Type your email...">
<ul class="my-dropdown" hidden></ul>
```
```input-dynamic.js
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
```
```input-dynamic.jsx
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
    return <Input onFilter={this.onFilter}>
      <input type='text' placeholder='Type your email... (JSX)' />
      <ul className='my-dropdown'>
        {this.state.items.map((text, key) =>
          <li key={key}><button><Input.Highlight text={text} query={this.state.value} /></button></li>
        )}
      </ul>
    </Input>
  }
}

<DynamicInput />
```

## FAQ
<details>
<summary>Why not use `<datalist>` instead?</summary>
Despite having a native [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element for autocomplete lists, there are several issues regarding [browser support](https://caniuse.com/#feat=details), varying [accessibility](http://accessibleculture.org/articles/2012/03/screen-readers-and-details-summary/) support as well as no ability for custom styling or custom behavior.
</details>
<details>
<summary>Why is there only a subset of aria attributes in use?</summary>
Despite well documented [examples in the aria 1.1 spesification](https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html), "best practice" simply becomes unusable in several screen reader due to implementation differences. `core-input` aims to provide a equally good user experience regardless if a screen reader passes events to browser or not (events are often hijacked for quick-navigation). Several techniques and attributes have been thoroughly tested:
<br><br>
<ul>
<li>`aria-activedescendant`/`aria-selected` - ignored in Android, lacks indication of list length in JAWS</li>
<li>`aria-owns` - full list is read for every keystroke in NVDA</li>
<li>`role="listbox"` - VoiceOver needs aria-selected to falsely announce "0 selected"</li>
<li>`role="option"` - falsely announces links and buttons as "text"</li>
<li>`aria-live="assertive"` - fails to correctly inform user if current target is link or button</li>
<li>`role="combobox"` - skipped in iOS as VoiceOver fails to inform current field is editable</li>
</ul>
</details>

<details>
<summary>How do I use core-input with multiple tags/output values?</summary>
Tagging and screen readers is a complex matter, requiring more than comma separated values. Currently, tagging is just a part of the wishlist for core-input. If tagging functionality is of interest for your project, please add a +1 to the [tagging task](https://github.com/nrkno/core-components/issues/9), describe your needs in a comment, and you'll be updated about progress.
</details>
