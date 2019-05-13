/* globals HTMLElement */
import { IS_IOS, closest, escapeHTML, dispatchEvent, queryAll } from '../utils'

const KEYS = { ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40 }
const AJAX_DEBOUNCE = 500

export default class CoreSuggest extends HTMLElement {
  static get observedAttributes () { return ['hidden'] }

  connectedCallback () {
    this._observer = new window.MutationObserver(() => onMutation(this)) // Enhance <a> and <button> markup
    this._observer.observe(this, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden'] })

    if (IS_IOS) this.input.setAttribute('role', 'combobox') // iOS does not inform about editability if combobox
    this.input.setAttribute('autocomplete', 'off')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('aria-expanded', false)

    document.addEventListener('click', this)
    document.addEventListener('input', this)
    document.addEventListener('keydown', this)
    document.addEventListener('focusin', this)

    if (document.activeElement === this.input) this.hidden = false // Open if active
  }
  disconnectedCallback () {
    this._input = this._regex = null
    this._observer.disconnect()
    document.removeEventListener('click', this)
    document.removeEventListener('input', this)
    document.removeEventListener('keydown', this)
    document.removeEventListener('focusin', this)
  }
  attributeChangedCallback (name, prev, next) {
    if (this._observer) this.input.setAttribute('aria-expanded', !this.hidden)
  }
  handleEvent (event) {
    if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return
    if (event.type === 'focusin' || event.type === 'click') onClick(this, event)
    if (event.type === 'keydown') onKey(this, event)
    if (event.type === 'input') onInput(this, event)
  }
  escapeHTML (str) { return escapeHTML(str) }

  get input () {
    if (this._input && this._input.getAttribute('list') === this.id) return this._input // Speed up
    return (this._input = this.id && document.querySelector(`input[list=${this.id}]`)) || this.previousElementSibling
  }

  get ajax () { return this.getAttribute('ajax') || '' } // Always return string consistent with .value or .className
  set ajax (url) { this.setAttribute('ajax', url) }

  get limit () { return Number(this.getAttribute('limit')) || Infinity }
  set limit (int) { this.setAttribute('limit', int) }

  // Must set attribute for IE11
  get hidden () { return this.hasAttribute('hidden') }
  set hidden (val) { this.toggleAttribute('hidden', val) }
}

// This can happen quite frequently so make it fast
function onMutation (self) {
  const needle = self.input.value.toLowerCase().trim()

  // Remove old highlights
  const marks = self.getElementsByTagName('mark')
  while (marks[0]) {
    const parent = marks[0].parentNode
    parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0])
    parent.normalize && parent.normalize()
  }

  for (let els = self.querySelectorAll('a:not([hidden]),button:not([hidden])'), i = 0, l = els.length; i < l; ++i) {
    els[i].setAttribute('aria-label', `${els[i].textContent}, ${i + 1} av ${l}`)
    els[i].setAttribute('tabindex', '-1') // setAttribute a bit faster than tabIndex prop
    els[i].setAttribute('type', 'button') // Ensure <button> does not submit forms
  }

  if (needle) {
    const range = document.createRange()
    const iterator = document.createNodeIterator(self, window.NodeFilter.SHOW_TEXT)
    const haystack = self.textContent.toLowerCase()
    const length = needle.length
    const hits = []

    for (let start = 0; ~(start = haystack.indexOf(needle, start)); start += length) hits.push(start)
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
  self._observer.takeRecords() // Empty mutation queue to skip mutations done by highlighting
}

function onInput (self, event) {
  if (event.target !== self.input || !dispatchEvent(self, 'suggest.filter') || onAjax(self)) return
  const value = self.input.value.toLowerCase()
  const limit = self.limit
  let index = 0

  queryAll('a,button', self).forEach((item) => {
    const hide = (item.value || item.textContent).toLowerCase().indexOf(value) === -1 || ++index > limit
    const elem = item.parentElement.nodeName === 'LI' ? item.parentElement : item
    elem.toggleAttribute('hidden', hide) // JAWS requires hiding of <li> (if existing)
    item.toggleAttribute('hidden', hide)
  })
  onMutation(self)
}

function onKey (self, event) {
  if (!self.contains(event.target) && self.input !== event.target) return
  const items = [self.input].concat(queryAll('[tabindex="-1"]:not([hidden])', self))
  let { keyCode, target, item = false } = event

  if (keyCode === KEYS.DOWN) item = items[items.indexOf(target) + 1] || items[0]
  else if (keyCode === KEYS.UP) item = items[items.indexOf(target) - 1] || items.pop()
  else if (self.contains(target)) { // Aditional shortcuts if focus is inside list
    if (keyCode === KEYS.END || keyCode === KEYS.PAGEDOWN) item = items.pop()
    else if (keyCode === KEYS.HOME || keyCode === KEYS.PAGEUP) item = items[1]
    else if (keyCode !== KEYS.ENTER) items[0].focus()
  }

  setTimeout(() => (self.hidden = keyCode === KEYS.ESC)) // Let focus buble first
  if (item || keyCode === KEYS.ESC) event.preventDefault() // Prevent leaving maximized safari
  if (item) item.focus()
}

function onClick (self, event) {
  const item = event.type === 'click' && self.contains(event.target) && closest(event.target, 'a,button')
  const show = !item && (self.contains(event.target) || self.input === event.target)

  if (item && dispatchEvent(self, 'suggest.select', item)) {
    self.input.value = item.value || item.textContent.trim()
    self.input.focus()
  }

  // setTimeout: fix VoiceOver Safari moving focus to parentElement and let focus bubbe first
  setTimeout(() => (self.hidden = !show))
}

function onAjax (self) {
  if (!self.ajax) return
  clearTimeout(onAjax.time) // Clear previous search
  onAjax.ajax = onAjax.ajax || new window.XMLHttpRequest()
  onAjax.ajax.abort() // Abort previous request
  onAjax.time = setTimeout(onAjaxSend, AJAX_DEBOUNCE, self, onAjax.ajax) // Debounce
  return true
}

function onAjaxSend (self, ajax) {
  if (!self.input.value) return // Abort if input is empty
  if (dispatchEvent(self, 'suggest.ajax.beforeSend', ajax)) {
    ajax.onload = () => {
      try { ajax.responseJSON = JSON.parse(ajax.responseText) } catch (err) { ajax.responseJSON = false }
      dispatchEvent(self, 'suggest.ajax', ajax)
      // onMutation(self)
    }
    ajax.open('GET', self.ajax.replace('{{value}}', window.encodeURIComponent(self.input.value)), true)
    ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest') // https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Requested-With
    ajax.send()
  }
}
