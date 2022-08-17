# Core Suggest

<!-- <script src="https://unpkg.com/preact"></script>
<script src="https://unpkg.com/preact-compat"></script>
<script type="text/javascript">
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
.table-wrapper { overflow-x: auto; margin-bottom: 1.5rem; width: 100%; }
.table-wrapper table { border-collapse: collapse; }
.table-wrapper table caption { text-align: left; font-weight: bold; }
.table-wrapper table th { padding: .5em .5em; font-weight: 600; text-align: center; border: 1px solid #0f0f0f; }
.table-wrapper table td { padding: .5em .5em; text-align: center; border: 1px solid #0f0f0f; }
</style>
demo-->

> `@nrk/core-suggest` enhances an input, providing keyboard accessible functionality for autocompletion,
> search results and smart select box abilities and automatic highlighting. Results can be with fetched directly from markup
> or from a custom endpoint with AJAX.

## Examples (Plain JS)

#### Static content

Use core-suggest to filter static markup

```html
<!--demo-->
<label for="my-input">Search</label>
<input
  id="my-input"
  type="text"
  placeholder="Type something..."
/>
<core-suggest hidden>
  <ul>
    <li>
      <button>Chro<b>me</b></button>
    </li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
</core-suggest>
```

You can modify the default notifications announced to screen readers when suggestions are visible, empty and filtered using the `data-sr`-attributes

```html
<!--demo-->

<label for="my-live-region-input">Search with english screen reader-messages</label>
<input id="my-live-region-input" type="text" placeholder="Type to filter" />
<core-suggest
  data-sr-empty-message="No suggestions shown"
  data-sr-count-message="{{value}} suggestions shown"
  hidden
>
  <ul>
    <li><button>Chrome</button></li>
    <li><button>Firefox</button></li>
    <li><button>Opera</button></li>
    <li><button>Safari</button></li>
    <li><button>Microsoft Edge</button></li>
  </ul>
</core-suggest>
```

#### Ajax

Ajax requests can be stopped by calling `event.preventDefault()` on the [`suggest.filter` event](#suggest-filter).

If you need to alter default headers, request method or post data, use the [`suggest.ajax.beforeSend` event](#input-ajax-beforesend)

Always [escape html](#security) and debounce requests when fetching data from external sources. The http request sent by `@nrk/core-suggest` will have header `X-Requested-With: XMLHttpRequest` for easier [server side detection and CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

When using `@nrk/core-suggest` with the `ajax` functionality, make sure to implement both a "pending" (e.g. `Searching...`) and "nothing found" (e.g. `No results`) status. Use `data-sr-read-text-content` and wrap the message with `span tabindex="-1"` instead of `button`/`a` for users to be able to interact using keyboard, but not be announced as a result to screen readers

Note: These status indicators are highly recommended, but are not provided by default as the context will affect the optimal textual formulation.

```html
<!--demo-->
<label for="my-input-ajax">Search with remotesuggestions</label>
<input id="my-input-ajax" placeholder="Country..." />
<core-suggest
  ajax="https://restcountries.com/v2/name/{{value}}?fields=name"
  data-sr-read-text-content
  hidden
></core-suggest>
<script type="text/javascript">
  document.addEventListener("suggest.filter", (event) => {
    const suggest = event.target;
    const input = suggest.input;
    const value = input.value.trim();

    if (input.id !== "my-input-ajax") return; // Make sure we are on correct input
    // Use tabindex for users to be able to reach with keyboard, but not be announced as a result to screen readers
    suggest.innerHTML = value
      ? `<ul><li><span tabindex="-1">Searching for ${value}...</span></li></ul>`
      : "";
  });
  document.addEventListener("suggest.ajax", (event) => {
    const suggest = event.target;
    const input = suggest.input;

    if (input.id !== "my-input-ajax") return; // Make sure we are on correct input
    const items = event.detail.responseJSON;
    suggest.innerHTML = `<ul>${
      items.length
        ? items
            .slice(0, 10)
            .map((item) => {
              return `<li><button>${suggest.escapeHTML(
                item.name
              )}</button></li>`;
            }) // Generate list
            .join("")
        : '<li><span tabindex="-1">No results</span></li>'
    }</ul>`;
  });
  document.addEventListener("suggest.ajax.error", (event) => {
    const suggest = event.target;
    const input = suggest.input;

    if (input.id !== "my-input-ajax") return; // Make sure we are on correct input

    const items = event.detail.responseJSON;
    suggest.innerHTML = '<ul><li><span tabindex="-1">No results</span></li></ul>';
  });
</script>
```

#### Lazy

Hybrid solution; lazy load items, use `core-suggest` to handle filtering:

```html
<!--demo-->
<label for="my-input-lazy">Search with lazy suggestions</label>
<input id="my-input-lazy" placeholder="Filter lazy-loaded content" />
<core-suggest hidden></core-suggest>
<script type="text/javascript">
  window.getCountries = (callback) => {
    const xhr = new XMLHttpRequest();
    const url = "https://restcountries.com/v3.1/all?fields=name";

    xhr.onload = () => callback(JSON.parse(xhr.responseText));
    xhr.open("GET", url, true);
    xhr.send();
  };

  document.addEventListener(
    "focus",
    (event) => {
      if (event.target.id !== "my-input-lazy") return; // Make sure we are on correct input
      const input = event.target;
      const suggest = input.nextElementSibling;

      input.id = ""; // Prevent double execution
      window.getCountries((items) => {
        suggest.innerHTML = `<ul>${items
          .map(
            (item) =>
              "<li><button>" +
              suggest.escapeHTML(item.name?.common) +
              "</button></li>"
          )
          .join("")}</ul>`;
      });
    },
    true
  );
</script>
```

#### Dynamic

Synchronous operation; dynamically populate items based on input value:

```html
<!--demo-->
<label for="my-input-dynamic">Search with generated suggestions</label>
<input id="my-input-dynamic" placeholder="Type to generate suggestions" />
<core-suggest hidden></core-suggest>
<script type="text/javascript">
  document.addEventListener("suggest.filter", (event) => {
    const suggest = event.target;
    const input = suggest.input;
    const value = input.value.trim();
    const mails = [
      "facebook.com",
      "gmail.com",
      "hotmail.com",
      "mac.com",
      "mail.com",
      "msn.com",
      "live.com",
    ];

    if (input.id !== "my-input-dynamic") return; // Make sure we are on correct input
    event.preventDefault();
    suggest.innerHTML = `<ul>${
      value
        ? mails
            .map((mail) => {
              return (
                '<li><button type="button">' +
                value.replace(/(@.*|$)/, "@" + mail) +
                "</button></li>"
              );
            })
            .join("")
        : ""
    }</ul>`;
  });
</script>
```

#### Events within shadow root

It also handles events within shadow root

```html
<!--demo-->
<script type="text/javascript">
  class ShadowComponent extends HTMLElement {
    connectedCallback() {
      const children = this.children;
      const shadowRoot = this.attachShadow({ mode: "open" });

      while (children.length > 0) {
        shadowRoot.appendChild(children[0]);
      }
    }
  }

  window.customElements.define("shadow-component", ShadowComponent);
</script>
<shadow-component>
  <label for="my-input">Search</label>
  <input id="my-input" type="text" placeholder="Type something..." />
  <core-suggest hidden>
    <ul>
      <li>
        <button>Chro<b>me</b></button>
      </li>
      <li><button>Firefox</button></li>
      <li><button>Opera</button></li>
      <li><button>Safari</button></li>
      <li><button>Microsoft Edge</button></li>
    </ul>
  </core-suggest>
</shadow-component>
```

## Examples (React)

#### Static content

```html
<!--demo-->
<div id="jsx-input"></div>
<script type="text/javascript">
  ReactDOM.render(<div>
    <label for="my-input-jsx">Search med lang label</label>
    <input id='my-input-jsx' type='text' placeholder='Type something...' />
    <CoreSuggest
      className='my-dropdown'
      hidden
    >
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

#### Ajax

Ajax requests can be stopped by calling `event.preventDefault()` on the [`onSuggestFilter` event](#suggest-filter).

If you need to alter default headers, request method or post data, use the [`onSuggestAjaxBeforeSend` event](#input-ajax-beforesend)

Always [escape html](#security) and debounce requests when fetching data from external sources. The http request sent by `@nrk/core-suggest` will have header `X-Requested-With: XMLHttpRequest` for easier [server side detection and CSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

When using `@nrk/core-suggest` with the `ajax` functionality, make sure to implement both a "pending" (e.g. `Searching...`) and "nothing found" (e.g. `No results`) status. Use `data-sr-read-text-content={true}` and wrap the message with `span tabindex="-1"` instead of `button`/`a` for users to be able to interact using keyboard, but not be announced as a result to screen readers

Note: These status indicators are highly recommended, but are not provided by default as the context will affect the optimal textual formulation.

```html
<!--demo-->
<div id="jsx-input-ajax"></div>
<script type="text/javascript">
  const CoreSuggestAjax = () => {
    const suggestEl = React.useRef(null)
    const [loadingValue, setLoadingValue] = React.useState('')
    const [errorValue, setErrorValue] = React.useState('')
    const [items, setItems] = React.useState([])

    const handleAjax = (event) => {
      setLoadingValue('') // Clear loading-state
      const serverItems = event.detail.responseJSON
      setItems(serverItems.length ? serverItems : [])
    }
    const handleAjaxError = (event) => {
      setLoadingValue('') // Clear loading-state
      setErrorValue('Ingen resultat')
    }
    const handleFilter = (event) => {
      setErrorValue('') // Clear error
      setItems([]) // Clear items
      const suggest = event.target
      const value = suggest.input.value
      setLoadingValue(value ? `Searching for ${value}...` : '') // Clear to avoid dangling load-state when clearing input
    }

    const isLoading = !items.length && loadingValue
    const hasError = !items.length && errorValue
    return (
      <>
        <input type='text' placeholder='Country...' />
        <CoreSuggest
          forwardRef={suggestEl}
          ajax="https://restcountries.com/v3.1/name/{{value}}?fields=name"
          onSuggestFilter={handleFilter}
          onSuggestAjax={handleAjax}
          onSuggestAjaxError={handleAjaxError}
          data-sr-read-text-content={true}
        >
          <ul>
            {isLoading && (<span tabIndex="-1">{loadingValue}</span>)}
            {hasError && (<span tabIndex="-1">{errorValue}</span>)}
            {items.slice(0, 10).map((item) =>
              <li key={suggestEl.current.escapeHTML(item.name.official)}>
                <button>{suggestEl.current.escapeHTML(item.name.common)}</button>
              </li>
            )}
          </ul>
        </CoreSuggest>
      </>
    )
  }
  ReactDOM.render(<CoreSuggestAjax />, document.getElementById('jsx-input-ajax'))
</script>
```

#### Lazy

Hybrid solution; lazy load items, but let `core-suggest` still handle filtering:

```html
<!--demo-->
<div id="jsx-input-lazy"></div>
<script type="text/javascript">
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
        <input type='text' placeholder='Filter by typing' onFocus={this.onFocus} />
        <CoreSuggest>
          <ul className='my-dropdown'>
            {this.state.items.map((item) =>
              <li key={item.name.official}><button>{item.name.common}</button></li>
            )}
          </ul>
        </CoreSuggest>
      </div>
    }
  }

  ReactDOM.render(<LazyInput />, document.getElementById('jsx-input-lazy'))
</script>
```

#### Dynamic

Synchronous operation; dynamically populate items based on input value:

```html
<!--demo-->
<div id="jsx-input-dynamic"></div>
<script type="text/javascript">
  class DynamicInput extends React.Component {
    constructor(props) {
      super(props);
      this.onFilter = this.onFilter.bind(this);
      this.mails = [
        "facebook.com",
        "gmail.com",
        "hotmail.com",
        "mac.com",
        "mail.com",
        "msn.com",
        "live.com",
      ];
      this.state = { items: [] };
    }
    onFilter(event) {
      const suggest = event.target;
      const value = suggest.input.value.trim();
      const items = value
        ? this.mails.map((mail) => value.replace(/(@.*|$)/, `@${mail}`))
        : [];

      event.preventDefault();
      this.setState({ value, items });
    }
    render() {
      return (
        <div>
          <input type="text" placeholder="Type to generate suggestions" />
          <CoreSuggest onSuggestFilter={this.onFilter}>
            <ul className="my-dropdown">
              {this.state.items.map((text) => (
                <li key={text}>
                  <button>{text}</button>
                </li>
              ))}
            </ul>
          </CoreSuggest>
        </div>
      );
    }
  }

  ReactDOM.render(
    <DynamicInput />,
    document.getElementById("jsx-input-dynamic")
  );
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
<script src="https://static.nrk.no/core-components/major/10/core-suggest/core-suggest.min.js"></script>
<!-- Using static -->
```

Remember to [polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements) custom elements if needed.

## Usage

Typing into the input toggles the [hidden attribute](https://developer.mozilla.org/en/docs/Web/HTML/Global_attributes/hidden) on items of type `<button>` and `<a>`, based on matching [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) inside `<core-suggest>`. Focusing the input unhides the following element. The default filtering behavior can easily be altered through the `'suggest.select'`, `'suggest.filter'`, `'suggest.ajax'` and `'suggest.ajax.beforeSend'` [events](#events).

### Security

Results will be rendered in the element inside `<core-suggest>`.
Always use `coreSuggest.escapeHTML(String)` to safely render data from API or user.

### Highlights

The `highlight`-attribute accepts `'on', 'off', 'keep'`, defaults to `'on'`.
Optional attribute to override how core-suggest handles `<mark>`-tags in results.
Highlighting is disabled for IE11 due to errant behavior.

| VALUE            | BEHAVIOUR                                                                                        |
| :--------------- | :----------------------------------------------------------------------------------------------- |
| `'on'` (default) | Strips existing `<mark>`-tags and wraps new matches in `<mark>`-tags                             |
| `'off'`          | Strips existing `<mark>`-tags, but does not wrap matches                                         |
| `'keep'`         | Does not noting with `<mark>`-tags - existing tags are not stripped and no new matches are added |

### Aria-live

Core-suggest notifies screen readers using a polite aria-live region when suggestions are shown and status of filter changes; number of suggestions and when there are no suggestions, by default.

To do this, we append a `<span>` with `aria-live="polite"` to the document body and hide it from view. When something is notified, we set and subsequently clear the `textContent` of this span.

Text sent to screen readers can be adjusted by setting the following attributes on the `core-suggest` element:

- `data-sr-empty-message="Ingen forslag vises"`
- `data-sr-count-message="{{value}} forslag vises"`
- `data-sr-read-text-content`

### HTML / JavaScript

```jsx
<input
 type="text" <!-- Must be a textual input element -->
 list="{String}" <!-- Optional. Specify id of suggest element -->
/>
<core-suggest
  limit="{Number}" <!-- Optional. Limit maxium number of result items. Defaults to Infinity -->
  ajax="{String}" <!-- Optional. Fetches external data. See event 'suggest.ajax'. Example: 'https://search.com?q={{value}}' -->
  highlight="{'on' | 'off' | 'keep'}" <!-- Optional. Override highlighting matches in results. Defaults to 'on'. -->
  data-sr-empty-message="Ingen forslag vises" <!-- Optional. Override text sent to aria-live region when suggestions are empty due to filter -->
  data-sr-count-message="{{value}} forslag vises" <!-- Optional. Override text sent to aria-live region when (the number of) suggestions changes -->
  data-sr-read-text-content <!-- Optional. When present, `textContent` will be sent to screen reader when no buttons or links are present -->
  hidden <!-- Use hidden to toggle visibility -->
>
  <ul>  <!-- Can be any tag, but items should be inside <li> -->
    <li><button>Item 1</button></li>  <!-- Items must be <button> or <a> -->
    <li><button value="Suprise!">Item 2</button></li> <!-- Alternative value can be defined -->
    <li><a href="https://www.nrk.no/">NRK.no</a></li> <!-- Actual links are recommended when applicable -->
  </ul>
</core-suggest>
```

```js
import CoreSuggest from "@nrk/core-suggest"; // Using NPM
window.customElements.define("core-suggest", CoreSuggest); // Using NPM. Replace 'core-suggest' with e.g 'my-suggest' to namespace

const mySuggest = document.querySelector("core-suggest");

// Getters
mySuggest.ajax; // Get ajax URL value
mySuggest.limit; // Get limit
mySuggest.highlight; // Get highlight
mySuggest.hidden; // Get hidden
mySuggest.input; // Get input for suggest
// Setters
mySuggest.ajax = "https://search.com?q={{value}}"; // Set ajax endpoint URL for fetching external data.
mySuggest.limit = 5; // Set limit for results
mySuggest.highlight = "on" | "off" | "keep"; // Set highlight strategy
mySuggest.hidden = false; // Set hidden value
// Methods
mySuggest.escapeHTML("<span>...</span>"); // Utility function for escaping HTML string
mySuggest.pushToLiveRegion("Message to be read"); // Sends string content to aria-live region to notify screen readers
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

Putting the input directly before the suggestion list is highly recommended, as this fulfills all accessibility requirements by default. There may be scenarios, where styling makes this DOM structure impractical. In such cases, give the `<input>` a `list` attribute, and the `<core-suggest>` an `id` with corresponding value. Make sure there is no text between the input and the suggestion list, as this will break the experience for screen reader users.


## Events

### suggest.filter

Fired before a default filtering occurs. If you wish to handle filtering yourself, e.g fuzzy search or similar, use `event.preventDefault()` to disable the default filtering.

```js
document.addEventListener("suggest.filter", (event) => {
  event.target; // The core-suggest element
});
```

### suggest.select

Fired when an item is clicked/selected:

```js
document.addEventListener("suggest.select", (event) => {
  event.target; // The core-suggest element
  event.target.value; // The selected data
  event.detail; // The selected element
});
```

### suggest.ajax.beforeSend

Fired before sending debounced ajax requests. If you wish to alter the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), use `event.preventDefault()` and then execute [XHR methods](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Methods) on the `event.detail`. If not prevented, requests are sent using the `GET` method and the header `'X-Requested-With': 'XMLHttpRequest'`.

```js
document.addEventListener("suggest.ajax.beforeSend", (event) => {
  event.target; // The core-suggest element
  event.detail; // The XMLHttpRequest object
});
```

```js
// Example
document.addEventListener("suggest.ajax.beforeSend", (event) => {
  const xhr = event.detail;
  event.preventDefault(); // Stop default behaviour
  xhr.open("POST", "https://example.com");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("my-custom-header", "my-custom-value");
  xhr.send(JSON.stringify({ query: event.target.input.value }));
});
```

### suggest.ajax

Fired when the input field receives data from ajax:

```js
document.addEventListener("suggest.ajax", (event) => {
  event.target; // The core-suggest element
  event.detail; // The XMLHttpRequest object
  event.detail.responseText; // The response body text
  event.detail.responseJSON; // The response json. Defaults to false if no valid JSON found
});
```

### suggest.ajax.error

Fired when the request fails either due to a bad request (bad URL, non-200 response), an network error or a JSON parse error. Inspect `xhr.status` and `xhr.statusText` for bad requests and `xhr.responseError` for other errors:

```js
document.addEventListener("suggest.ajax.error", (event) => {
  event.target; // The core-suggest element
  event.detail; // The XMLHttpRequest object
  event.detail.status; // The response status code
  event.detail.statusText; // The response status text
  event.detail.responseError; // The error message for ajax errors/json parse errors
});
```

```js
// Example
document.addEventListener("suggest.ajax.error", (event) => {
  const xhr = event.detail;
  if (xhr.status !== 200) {
    if (xhr.responseError) {
      // Network error / JSON parse error
      console.log(xhr.responseError); // Log error message
    } else {
      // Bad request
      console.log(xhr.statusText); // Log status text
      console.log(xhr.responseText); // Log response text
    }
  }
});
```

## Styling

All styling in documentation is example only. Both the `<button>` and content element receive attributes reflecting the current toggle state:

```css
.my-input {} // Target input in any state
.my-input[aria-expanded="true"] {} // Target only open button
.my-input[aria-expanded="false"] {} // Target only closed button

.my-input-content {} // Target content element in any state
.my-input-content:not([hidden]) {} // Target only open content
.my-input-content[hidden] {} // Target only closed content

.my-input-content :focus {} // Target focused item
.my-input-content mark {} // Target highlighted text (use `highlight='off'` to disable highlighting)
```

## Notes on accessibility

### Screen reader notifications

Release 1.3.0 introduced screen reader notifications for the following scenarios:

- Suggestions become visible to the user, e.g. input is focused or selected input receives lazy-loaded items. Message defaults to `{{value}} Forslag vises`.
- The number of suggestions are announced when it changes, e.g. when filtering or async update. Message defaults to `{{value}} forslag vises`.
- When no suggestions remain due to filtering. Message defaults to `Ingen forslag vises`.
- `textContent` is displayed, e.g. load/error state in [ajax example](#examples-plain-js--ajax). `textContent` within core-suggest element is trimmed and sent to screen reader when `data-sr-read-text-content`-attribute is present

Norwegian language is used by default, but the content can be changed by setting the appropriate [attributes](#aria-live)

These notifications have been added to improve the user experience when using screen readers and to comply with [WCAG 2.1 4.1.3](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html), in-depth information available from [uutilsynet](https://www.uutilsynet.no/wcag-standarden/413-statusbeskjeder-niva-aa/152)

As part of verifying compatibility with various screen-readers we made the following observations:

- We found it necessary to apply a delay when sending messages to the screen reader. Without it, messages sometimes failed to register properly or were ignored completely where the length of label was more than one word.
- When using NVDA, JAWS or Narrator on Windows, notification when visible (`n Forslag vises`) is superfluous as `aria-expanded` conveyes that the content is expanded. It is kept in for broader support across platforms.

Using JAWS version 2022-04 on windows 10, NVDA version 2021.3.5 on windows 10, Narrator on windows 10, Orca 3.36.2, TalkBack on EMUI 12 and Android 9, VoiceOver on iOS 15.4.1 and macOS Big Sur and Monterey.

<div class="table-wrapper" tabindex="0">
<table>
  <caption>Screen reader testing results as of <date>2022-05-25</date></caption>
  <colgroup span="1"></colgroup>
  <colgroup span="3"></colgroup>
  <colgroup span="3"></colgroup>
  <colgroup span="3"></colgroup>
  <colgroup span="1"></colgroup>
  <colgroup span="2"></colgroup>
  <colgroup span="2"></colgroup>
  <colgroup span="2"></colgroup>
  <thead>
    <tr>
      <th colspan="1" scope="colgroup">Situation</th>
      <th colspan="3" scope="colgroup"><a href="https://www.freedomscientific.com/products/software/jaws/">JAWS</a></th>
      <th colspan="3" scope="colgroup"><a href="https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1">Narrator</a></th>
      <th colspan="3" scope="colgroup"><a href="https://www.nvaccess.org/">NVDA</a></th>
      <th colspan="1" scope="colgroup"><a href="https://help.gnome.org/users/orca/stable/">Orca</a></th>
      <th colspan="2" scope="colgroup"><a href="https://support.google.com/accessibility/android/answer/6283677?hl=en">TalkBack</a></th>
      <th colspan="2" scope="colgroup"><a href="https://support.apple.com/en-gb/guide/iphone/iph3e2e415f/ios">VoiceOver (iOS)</a></th>
      <th colspan="2" scope="colgroup"><a href="https://support.apple.com/en-gb/guide/voiceover/welcome/mac">VoiceOver (macOS)</a></th>
    </tr>
    <tr>
      <th scope="col"></th>
      <th scope="col">Chrome</th>
      <th scope="col">Edge</th>
      <th scope="col">Firefox</th>
      <th scope="col">Chrome</th>
      <th scope="col">Edge</th>
      <th scope="col">Firefox</th>
      <th scope="col">Chrome</th>
      <th scope="col">Edge</th>
      <th scope="col">Firefox</th>
      <th scope="col">Firefox</th>
      <th scope="col">Chrome</th>
      <th scope="col">Samsung Internet</th>
      <th scope="col">Safari</th>
      <th scope="col">Chrome</th>
      <th scope="col">Safari</th>
      <th scope="col">Chrome</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Suggestions visible on focus or lazy load</th>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Not supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
    </tr>
    <tr>
      <th>Suggestions visible on reopen after close</th>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Not supported</td>
      <td>Not supported</td>
      <td>Not supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
    </tr>
    <tr>
      <th>Suggestions visible on filter by input</th>
      <td>Supported</td>
      <td>Supported</td>
      <td>Partial: first letter entered does not always trigger</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Not supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
    </tr>
    <tr>
      <th>All suggestions are hidden by filter</th>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Not supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
    </tr>
    <tr>
      <th><pre>textContent</pre> is displayed</th>
      <td>Supported</td>
      <td>Supported</td>
      <td>Partial: first letter entered does not always trigger load-state</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Not supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
      <td>Supported</td>
    </tr>
  </tbody>
</table>
</div>

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

- `aria-controls` - Reads 'tilgjengelig forslag' on windows Narrator on focus

### How do I use core-suggest with multiple tags/output values?

Tagging and screen readers is a complex matter, requiring more than comma separated values. Currently, tagging is just a part of the wishlist for core-suggest. If tagging functionality is of interest for your project, please add a +1 to the [tagging task](https://github.com/nrkno/core-components/issues/9), describe your needs in a comment, and you'll be updated about progress.
