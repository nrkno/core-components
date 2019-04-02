import { name, version } from './package.json'
import { IS_IOS, addEvent, escapeHTML, dispatchEvent, requestAnimFrame, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-')
const KEYS = { ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40 }
const AJAX_DEBOUNCE = 500

export default function input (elements, content) {
  const options = typeof content === 'object' ? content : { content }
  const repaint = typeof options.content === 'string'

  return queryAll(elements).map((input) => {
    const list = input.nextElementSibling
    const ajax = typeof options.ajax === 'undefined' ? input.getAttribute(UUID) : options.ajax
    const limit = typeof options.limit === 'undefined' ? input.getAttribute(`${UUID}-limit`) : Math.max(options.limit || 0, 0)
    const open = typeof options.open === 'undefined' ? input === document.activeElement : options.open

    console.log('limit:', limit);

    input.setAttribute(UUID, ajax || '')
    input.setAttribute(`${UUID}-limit`, limit || 0)
    input.setAttribute(IS_IOS ? 'data-role' : 'role', 'combobox') // iOS does not inform user area is editable if combobox
    input.setAttribute('aria-autocomplete', 'list')
    input.setAttribute('autocomplete', 'off')

    if (repaint) list.innerHTML = options.content
    queryAll('a,button', list).forEach((...args) => setupItem(limit, ...args))
    setupExpand(input, open)

    return input
  })
}

// Expose helper functions
input.escapeHTML = escapeHTML
input.highlight = (haystack, needle) => {
  const escapedRegExp = needle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') // From lodash
  return escapeHTML(haystack).replace(new RegExp(escapedRegExp || '.^', 'gi'), '<mark>$&</mark>')
}

addEvent(UUID, 'click', onClickOrFocus)
addEvent(UUID, 'focus', onClickOrFocus, true) // Use focus with capturing instead of focusin for old Firefox
function onClickOrFocus (event) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return

  queryAll(`[${UUID}]`).forEach((input) => {
    const list = input.nextElementSibling
    const open = input === event.target || list.contains(event.target)
    const item = event.type === 'click' && open && queryAll('[tabindex="-1"]', list).filter((item) => item.contains(event.target))[0]

    if (item) onSelect(input, { relatedTarget: list, currentTarget: item, value: item.value || item.textContent.trim() })
    else setupExpand(input, open)
  })
}

addEvent(UUID, 'input', ({ target: input }) => {
  if (input.hasAttribute(UUID)) onFilter(input, { relatedTarget: input.nextElementSibling })
})

addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  if (event.target.hasAttribute && event.target.hasAttribute(UUID)) return onKey(event.target, event) // Quick check
  for (let el = event.target, prev; el; el = el.parentElement) { // Check if inside list
    if ((prev = el.previousElementSibling) && prev.hasAttribute(UUID)) return onKey(prev, event)
  }
}, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents

function onKey (input, event) {
  const list = input.nextElementSibling
  const focusable = [input].concat(queryAll(`[tabindex="-1"]:not([hidden])`, list))
  const isClosing = event.keyCode === KEYS.ESC && input.getAttribute('aria-expanded') === 'true'
  const index = focusable.indexOf(document.activeElement)
  let item = false

  if (event.keyCode === KEYS.DOWN) item = focusable[index + 1] || focusable[0]
  else if (event.keyCode === KEYS.UP) item = focusable[index - 1] || focusable.pop()
  else if (list.contains(event.target)) { // Aditional shortcuts if focus is inside list
    if (event.keyCode === KEYS.END || event.keyCode === KEYS.PAGEDOWN) item = focusable.pop()
    else if (event.keyCode === KEYS.HOME || event.keyCode === KEYS.PAGEUP) item = focusable[1]
    else if (event.keyCode !== KEYS.ENTER) input.focus()
  }

  // Prevent leaving maximized safari and event.preventDefault even if undefined item (empty list)
  setupExpand(input, event.keyCode !== KEYS.ESC)
  if (item !== false || isClosing) event.preventDefault()
  if (item) item.focus()
}

function onSelect (input, detail) {
  if (dispatchEvent(input, 'input.select', detail)) {
    input.value = detail.value
    input.focus()
    requestAnimFrame(() => setupExpand(input, false)) // Let IE11 finish focus event bubbling
  }
}

function onFilter (input, detail) {
  if (dispatchEvent(input, 'input.filter', detail) && ajax(input) === false) {
    queryAll('[tabindex="-1"]', input.nextElementSibling).reduce((acc, item, index) => {
      const list = item.parentElement.nodeName === 'LI' && item.parentElement
      const show = item.textContent.toLowerCase().indexOf(input.value.toLowerCase()) !== -1
      const attr = show ? 'removeAttribute' : 'setAttribute'
      if (list) list[attr]('hidden', '') // JAWS requires hiding of <li> too (if they exist)
      item[attr]('hidden', '')
      return show ? acc.concat(item) : acc
    }, []).forEach((...args) => setupItem(input.getAttribute(`${UUID}-limit`), ...args))
  }
}

function setupExpand (input, open = input.getAttribute('aria-expanded') === 'true') {
  requestAnimFrame(() => { // Fixes VoiceOver Safari focus jumping to parentElement
    input.nextElementSibling[open ? 'removeAttribute' : 'setAttribute']('hidden', '')
    input.setAttribute('aria-expanded', open)
  })
}

function setupItem (limit, item, index, items) {
  item.setAttribute('aria-label', `${item.textContent.trim()}, ${index + 1} av ${items.length}`)
  item.setAttribute('tabindex', '-1')
  item.setAttribute('type', 'button')
  limit = Number(limit) || Infinity
  if (limit && (index >= limit)) item.parentElement.setAttribute('hidden', '')
}

function ajax (input) {
  const url = input.getAttribute(UUID)
  const xhr = ajax.xhr = ajax.xhr || new window.XMLHttpRequest()
  if (!url) return false

  clearTimeout(ajax.timer) // Clear previous search
  xhr.abort() // Abort previous request
  xhr.onload = () => {
    try { xhr.responseJSON = JSON.parse(xhr.responseText) } catch (err) { xhr.responseJSON = false }
    dispatchEvent(input, 'input.ajax', xhr)
  }
  ajax.timer = setTimeout(() => {
    if (!input.value) return // Abort if input is empty
    if (dispatchEvent(input, 'input.ajax.beforeSend', xhr)) {
      xhr.open('GET', url.replace('{{value}}', window.encodeURIComponent(input.value)), true)
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest') // https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Requested-With
      xhr.send()
    }
  }, AJAX_DEBOUNCE) // Debounce request
}
