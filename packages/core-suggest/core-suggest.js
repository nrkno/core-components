import { closest, dispatchEvent, escapeHTML, getUUID, IS_IE11, queryAll, toggleAttribute } from '../utils'

const KEY = {
  DOWN_IE: 'Down',
  DOWN: 'ArrowDown',
  UP_IE: 'Up',
  UP: 'ArrowUp',
  ENTER: 'Enter',
  ESC_IE: 'Esc',
  ESC: 'Escape',
  END: 'End',
  HOME: 'Home',
  PAGEDOWN: 'PageDown',
  PAGEUP: 'PageUp'
}
const AJAX_DEBOUNCE = 500
const ARIA_LIVE_DELAY = 300 // 300 ms established as sufficient, through testing, for messages to register properly in sr-queue and also support longer label/placeholder-combos.
const ARIA_LIVE_FILTERED = 'Ingen forslag vises'
const ARIA_LIVE_COUNT = '{{value}} forslag vises'

export default class CoreSuggest extends HTMLElement {
  static get observedAttributes () { return ['hidden', 'highlight'] }

  connectedCallback () {
    this._observer = new window.MutationObserver(() => onMutation(this))
    this._observer.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] })
    this._xhr = new window.XMLHttpRequest()
    this.id = this.id || getUUID()

    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-expanded', false)
    this.input.setAttribute('aria-controls', this.id)

    this._ariaLiveSpan = appendResultsNotificationSpan(this)

    document.addEventListener('click', this)
    document.addEventListener('input', this)
    document.addEventListener('keydown', this)
    document.addEventListener('focusin', this)
    setTimeout(() => onMutation(this)) // Ensure limit is respected
    if (document.activeElement === this.input) this.hidden = false // Open if active
  }

  disconnectedCallback () {
    document.removeEventListener('click', this)
    document.removeEventListener('input', this)
    document.removeEventListener('keydown', this)
    document.removeEventListener('focusin', this)
    // Clear internals to aid garbage collection
    this._observer.disconnect()
    clearTimeout(this._ariaLiveTimeout) // Clear existing timeout
    if (this._ariaLiveSpan.parentNode) this._ariaLiveSpan.parentNode.removeChild(this._ariaLiveSpan)
    this._observer = this._input = this._regex = this._xhr = this._xhrTime = this._ariaLiveDelay = this._ariaLiveTimeout = this._ariaLiveSpan = null
  }

  attributeChangedCallback (name) {
    if (!this._observer) return
    if (name === 'hidden') this.input.setAttribute('aria-expanded', !this.hidden)
    if (name === 'highlight') onMutation(this)
  }

  /**
   * Use `focusin` because it bubbles (`focus` does not)
   * @param {KeyboardEvent | FocusEvent | InputEvent | MouseEvent} event
   */
  handleEvent (event) {
    if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return
    if (event.type === 'focusin' || event.type === 'click') onClick(this, event)
    if (event.type === 'keydown') onKey(this, event)
    if (event.type === 'input') onInput(this, event)
  }

  escapeHTML (str) { return escapeHTML(str) }

  _clearLiveRegion () {
    clearTimeout(this._ariaLiveTimeout) // Clear existing timeout
    this._ariaLiveSpan.textContent = null
  }

  /**
   * @param {String} label
   * @returns {void}
   */
  pushToLiveRegion (label) {
    if (!this._observer || !this._ariaLiveSpan) return // Abort if disconnectedCallback has been called or no _ariaLiveSpan
    clearTimeout(this._ariaLiveDebounce) // Debounce multiple calls in the delay-interval

    // Delaying the update of textContent is necesary for consistent behavior in NVDA
    this._ariaLiveDebounce = setTimeout(() => {
      clearTimeout(this._ariaLiveTimeout) // Clear existing timeout
      this._ariaLiveSpan.textContent = label
      // Delay clearing to successfully register change in textContent with screen readers
      this._ariaLiveTimeout = setTimeout(() => (this._clearLiveRegion()), ARIA_LIVE_DELAY)
    }, ARIA_LIVE_DELAY)
  }

  /**
   * @returns {HTMLInputElement}
   */
  get input () {
    if (this._input && this._input.getAttribute('list') === this.id) return this._input // Speed up
    return (this._input = this.id && document.querySelector(`input[list=${this.id}]`)) || this.previousElementSibling
  }

  // Always return string consistent with .value or .className
  get ajax () { return this.getAttribute('ajax') || '' }

  set ajax (url) { this.setAttribute('ajax', url) }

  /**
   * @type {number}
   */

  get limit () { return Math.max(0, this.getAttribute('limit')) || Infinity }

  set limit (int) { this.setAttribute('limit', int) }

  /**
   * @returns {'on' | 'off' | 'keep'} defaults to `'on'`
   */
  get highlight () {
    return String(/^on|off|keep$/i.exec(this.getAttribute('highlight')) || 'on').toLowerCase()
  }

  set highlight (str) { this.setAttribute('highlight', str) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }

  set hidden (val) { toggleAttribute(this, 'hidden', val) }
}

/**
 * @param {CoreSuggest} self Core suggest element
 * @returns {HTMLSpanElement}
 */
function appendResultsNotificationSpan (self) {
  if (!self._observer || self._ariaLiveSpan) return // Abort if disconnectedCallback has been called
  document.body.insertAdjacentHTML('beforeend', '<span aria-live="polite" style="position: absolute !important; overflow: hidden !important; width: 1px !important; height: 1px !important; clip: rect(0, 0, 0, 0) !important"></span>')
  return document.body.lastElementChild
}

/**
 * Send textContent to be read by screen readers only if attribute to opt-in is present
 * Uses attribute `'data-sr-read-text-content'`
 *
 * @param {CoreSuggest} self Core suggest element
 * @param {String} textContent label to be read
 * @returns {void}
 */
function notifyTextContent (self, textContent) {
  if (!self.hasAttribute('data-sr-read-text-content')) return // Abort if not present
  self.pushToLiveRegion(textContent)
}

/**
 * Notify screen readers how many results are visible
 * textContent uses attribute `'data-sr-count-message'`
 * Replaces `{{value}}` with number of visible items
 *
 * @param {CoreSuggest} self Core suggest element
 * @param {Number} items Number of visible items
 * @returns {void}
 */
function notifyResultCount (self, items) {
  const label = self.getAttribute('data-sr-count-message')
  if (label === '') return // Abort if label is set to explicit empty string
  self.pushToLiveRegion((label || ARIA_LIVE_COUNT).replace('{{value}}', items))
}

/**
 * Notify screen readers when all results are hidden by filter
 * textContent uses attribute `'data-sr-empty-message'`
 *
 * @param {CoreSuggest} self Core suggest element
 * @returns {void}
 */
function notifyResultsEmpty (self) {
  const label = self.getAttribute('data-sr-empty-message')
  if (label === '') return // Abort if label is set to explicit empty string
  self.pushToLiveRegion(label || ARIA_LIVE_FILTERED)
}

/**
 * @param {Element} item
 * @param {Boolean} show
 */
function toggleItem (item, show) {
  const li = item.parentElement // JAWS requires hiding parent <li> (if existing)
  if (li.nodeName === 'LI') toggleAttribute(li, 'hidden', show)
  toggleAttribute(item, 'hidden', show)
}

/**
 * Callback for mutationObserver
 * Enhances items with aria-label, tabindex and type="button"
 * Respects limit attribute
 * Updates <mark> tags for highlighting according to attribute
 * Trigger messages for screen readers
 * This can happen quite frequently so make it fast
 * @param {CoreSuggest} self Core suggest element
 * @returns {void}
 */
function onMutation (self) {
  if (!self._observer) return // Abort if disconnectedCallback has been called (this/self._observer is null)

  const needle = (self.input && self.input.value) ? self.input.value.toLowerCase().trim() : null
  const items = self.querySelectorAll('a:not([hidden]),button:not([hidden])')
  const limit = Math.min(items.length, self.limit)

  // Remove old highlights only when highlight-mode is not 'keep'
  if (self.highlight !== 'keep') {
    const marks = self.getElementsByTagName('mark')
    while (marks[0]) {
      const parent = marks[0].parentNode
      parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0])
      parent.normalize && parent.normalize()
    }
  }

  self._empty = items.length === 0

  for (let i = 0, l = items.length; i < l; ++i) {
    items[i].setAttribute('aria-label', `${items[i].textContent}, ${i + 1} av ${limit}`)
    items[i].setAttribute('tabindex', '-1') // setAttribute a bit faster than tabIndex prop
    items[i].setAttribute('type', 'button') // Ensure <button> does not submit forms
    toggleItem(items[i], i >= limit)
  }

  // Highlights disabled for IE11 due to bugs in range calculation
  if (needle && self.highlight === 'on' && !IS_IE11) {
    const range = document.createRange()
    const iterator = document.createNodeIterator(self, window.NodeFilter.SHOW_TEXT, null, false)
    const haystack = self.textContent.toLowerCase()
    const length = needle.length
    const hits = []

    for (let start = 0; (start = haystack.indexOf(needle, start)) !== -1; start += length) hits.push(start)
    for (let start = 0, hitsLength = hits.length, node; (node = iterator.nextNode());) {
      const nodeStart = start
      const nodeEnd = start += node.textContent.length

      for (let i = 0; i < hitsLength; ++i) {
        const hitStart = Math.max(hits[i] - nodeStart, 0) // Avoid splitting at minus index
        const hitEnd = Math.min(nodeEnd, hits[i] + length) - nodeStart // Avoid splitting after content end
        if (hitStart < hitEnd) {
          range.setStart(node, hitStart)
          range.setEnd(node, hitEnd)
          range.surroundContents(document.createElement('mark'))
          start = nodeStart + hitEnd // Reset start to character after <mark>
          iterator.nextNode() // skip newly created node next
          break
        }
      }
    }
  }

  // Send messages for screen readers
  const hasNoItems = !self.querySelector('a,button') // Accounts for hidden as well
  const hasNotSearchedYet = hasNoItems && !self.input.value
  const textContent = hasNoItems && self.textContent.trim()

  if (self.hidden || hasNotSearchedYet) self._clearLiveRegion()
  else if (textContent) notifyTextContent(self, textContent)
  else if (items.length) notifyResultCount(self, items.length)
  else notifyResultsEmpty(self)

  self._observer.takeRecords() // Empty mutation queue to skip mutations done by highlighting
}

/**
 * Handle input event in connected input
 * Triggers built-in ajax functionality if `ajax`-attribute is set
 *  * Suggestions will not be filtered by input if this is the case
 * @param {CoreSuggest} self Core suggest element
 * @param {InputEvent} event
 * @returns {void}
 */
function onInput (self, event) {
  if (event.target !== self.input || onAjax(self)) return
  filterItemsByInput(self)
}

/**
 * Performs filtering of core-suggest items
 * Dispatches event
 *  * `suggest.filter`
 * Filtering is aborted if
 *  * event.preventDefault() is called on on `suggest.filter` event
 *  * input has no value
 * @param {CoreSuggest} self Core suggest element
 * @fires `suggest.filter`
 */
function filterItemsByInput (self) {
  if (!dispatchEvent(self, 'suggest.filter') || !(self.input && self.input.value)) return
  const value = self.input.value.toLowerCase()
  const items = self.querySelectorAll('a,button')

  for (let i = 0, l = items.length; i < l; ++i) {
    toggleItem(items[i], (items[i].value || items[i].textContent).toLowerCase().indexOf(value) === -1)
  }
}

/**
 *
 * @param {CoreSuggest} self Core suggest element
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function onKey (self, event) {
  if (!self.contains(event.target) && self.input !== event.target) return
  const items = [self.input].concat(queryAll('[tabindex="-1"]:not([hidden])', self))
  let { key, target, item = false } = event

  if (key === KEY.DOWN || key === KEY.DOWN_IE) {
    item = items[items.indexOf(target) + 1] || items[0]
  } else if (key === KEY.UP || key === KEY.UP_IE) {
    item = items[items.indexOf(target) - 1] || items.pop()
  } else if (self.contains(target)) {
    // Aditional shortcuts if focus is inside list
    if (key === KEY.END || key === KEY.PAGEDOWN) {
      item = items.pop()
    } else if (key === KEY.HOME || key === KEY.PAGEUP) {
      item = items[1]
    } else if (key !== KEY.ENTER) {
      items[0].focus()
    }
  }

  setTimeout(() => (self.hidden = (key === KEY.ESC || key === KEY.ESC_IE))) // Let focus buble first
  if (item || (key === KEY.ESC || key === KEY.ESC_IE)) event.preventDefault() // Prevent leaving maximized safari
  if (item) item.focus()
}

/**
 * Handle focus or click events
 * Dispatches `suggest.select`
 * @param {CoreSuggest} self Core suggest element
 * @param {FocusEvent | MouseEvent} event
 * @returns {void}
 */
function onClick (self, event) {
  const item = event.type === 'click' && self.contains(event.target) && closest(event.target, 'a,button')
  const show = !item && (self.contains(event.target) || (self.input === event.target && !self.input.disabled))

  let delayedFilter = false
  if (item && dispatchEvent(self, 'suggest.select', item)) {
    self.input.value = item.value || item.textContent.trim()
    self.input.focus()
    delayedFilter = true
  }

  // setTimeout: fix VoiceOver Safari moving focus to parentElement and let focus bubbe first
  setTimeout(() => {
    self.hidden = !show
    // Filter after hidden to avoid announcing to liveRegion in mutationObserver
    if (delayedFilter) filterItemsByInput(self)
  })
}

/**
 * Handle ajax event using ajax attribute
 * @param {CoreSuggest} self Core suggest element
 * @returns {Boolean} Returns true if Core Suggest element has `ajax` attribute value, false if not
 */
function onAjax (self) {
  if (!self.ajax) return
  clearTimeout(self._xhrTime) // Clear previous search
  self._xhr.abort() // Abort previous request
  self._xhr.responseError = null
  self._xhrTime = setTimeout(onAjaxSend, AJAX_DEBOUNCE, self) // Debounce
  return true
}

/**
 * Handle ajax request, replacing `{{value}}` in ajax-attribute with URIEncoded value from input
 * Dispatches the following events
 *  * suggest.ajax.beforeSend
 *  * suggest.ajax.error
 *  * suggest.ajax
 * @param {CoreSuggest} self Core suggest element
 * @returns {void}
 */
function onAjaxSend (self) {
  if (!self._observer || !self.input.value) return // Abort if disconnectedCallback has completed or input is empty
  if (dispatchEvent(self, 'suggest.ajax.beforeSend', self._xhr)) {
    self._xhr.onerror = () => {
      self._xhr.responseError = 'Error: Network request failed'
      dispatchEvent(self, 'suggest.ajax.error', self._xhr)
    }
    self._xhr.onload = () => {
      if (self._xhr.status !== 200) return dispatchEvent(self, 'suggest.ajax.error', self._xhr)
      try {
        self._xhr.responseJSON = JSON.parse(self._xhr.responseText)
      } catch (error) {
        self._xhr.responseJSON = false
        self._xhr.responseError = error.toString()
        dispatchEvent(self, 'suggest.ajax.error', self._xhr)
      }
      // Data successfully received
      dispatchEvent(self, 'suggest.ajax', self._xhr)
    }
    self._xhr.open('GET', self.ajax.replace('{{value}}', window.encodeURIComponent(self.input.value)), true)
    self._xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest') // https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Requested-With
    self._xhr.send()
  }
}
