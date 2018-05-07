import {name, version} from './package.json'
import {IS_IOS, addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const ITEM = '[tabindex="-1"]'

export default function input (elements, content) {
  const options = typeof content === 'object' ? content : {content}
  const repaint = typeof options.content === 'string'

  return queryAll(elements).map((input) => {
    const list = input.nextElementSibling

    input.setAttribute(UUID, '')
    input.setAttribute(IS_IOS ? 'data-role' : 'role', 'combobox') // iOS does not inform user area is editable if combobox
    input.setAttribute('aria-autocomplete', 'list')
    input.setAttribute('autocomplete', 'off')

    if (repaint) list.innerHTML = options.content
    queryAll('a,button', list).forEach(setupItem)
    setupExpand(input, options.open)
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
    const item = event.type === 'click' && open && queryAll(ITEM, list).filter((item) => item.contains(event.target))[0]

    if (item) onSelect(input, {relatedTarget: list, currentTarget: item, value: item.value || item.textContent.trim()})
    else setupExpand(input, open)
  })
}

addEvent(UUID, 'input', ({target: input}) => {
  if (input.hasAttribute(UUID)) onFilter(input, {relatedTarget: input.nextElementSibling})
})

addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  if (event.target.hasAttribute(UUID)) return onKey(event.target, event) // Quick check
  for (let el = event.target, prev; el; el = el.parentElement) { // Check if inside list
    if ((prev = el.previousElementSibling) && prev.hasAttribute(UUID)) return onKey(prev, event)
  }
})

function onKey (input, event) {
  const list = input.nextElementSibling
  const focus = queryAll(`${ITEM}:not([hidden])`, list)
  const index = focus.indexOf(document.activeElement)
  let item = false

  if (event.keyCode === KEYS.DOWN) item = focus[index + 1] || focus[0]
  else if (event.keyCode === KEYS.UP) item = focus[index - 1] || focus.pop()
  else if (list.contains(event.target)) { // Aditional shortcuts if focus is inside list
    if (event.keyCode === KEYS.END || event.keyCode === KEYS.PAGEDOWN) item = focus.pop()
    else if (event.keyCode === KEYS.HOME || event.keyCode === KEYS.PAGEUP) item = focus[0]
    else if (event.keyCode !== KEYS.ENTER) input.focus()
  }

  if (!list.hasAttribute('hidden') && event.keyCode === KEYS.ESC) event.preventDefault()
  setupExpand(input, event.keyCode !== KEYS.ESC)
  if (item !== false) event.preventDefault() // event.preventDefault even if empty list
  if (item) item.focus()
}

function onSelect (input, detail) {
  if (dispatchEvent(input, 'input.select', detail)) {
    input.value = detail.value
    input.focus()
    setupExpand(input, false)
  }
}

function onFilter (input, detail) {
  if (dispatchEvent(input, 'input.filter', detail)) {
    queryAll(ITEM, input.nextElementSibling).reduce((acc, item) => {
      const show = item.textContent.toLowerCase().indexOf(input.value.toLowerCase()) !== -1
      item[show ? 'removeAttribute' : 'setAttribute']('hidden', '')
      return show ? acc.concat(item) : acc
    }, []).forEach(setupItem)
  }
}

function setupExpand (input, open = input.getAttribute('aria-expanded') === 'true') {
  input.nextElementSibling[open ? 'removeAttribute' : 'setAttribute']('hidden', '')
  input.setAttribute('aria-expanded', open)
}

function setupItem (item, index, items) {
  item.setAttribute('aria-label', `${item.textContent.trim()}, ${index + 1} av ${items.length}`)
  item.setAttribute('tabindex', '-1')
}
