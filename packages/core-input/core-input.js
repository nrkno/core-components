import {name, version} from './package.json'
import {IS_IOS, addEvent, escapeHTML, dispatchEvent, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, SHIFT: 16, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const ROLE = IS_IOS ? 'data-role' : 'role'                  // iOS does not inform user area is editable if combobox
const ITEM = '[tabindex="-1"]'

export default function input (elements, items) {
  const options = typeof items === 'object' ? items : {items}
  const repaint = typeof options.items === 'string'

  return queryAll(elements).forEach((input) => {
    const list = input.nextElementSibling

    input.setAttribute(UUID, '')
    input.setAttribute(ROLE, 'combobox')
    input.setAttribute('autocomplete', 'off')
    input.setAttribute('aria-autocomplete', 'list')

    if (repaint) list.innerHTML = options.items
    queryAll('a,button', list).forEach(setupItem)
    setupExpand(input, options.open)
    return input
  })
}

addEvent(UUID, 'click', onClickOrFocus)
addEvent(UUID, 'focus', onClickOrFocus)
function onClickOrFocus (event) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return

  queryAll(`[${UUID}]`).forEach((input) => {
    const list = input.nextElementSibling
    const open = input === event.target || list.contains(event.target)
    const item = open && event.type === 'click' && queryAll(ITEM, list).filter((item) => item.contains(event.target))[0]

    if (item) onSelect(input, {relatedTarget: list, currentTarget: item})
    else setupExpand(input, open)
  })
}

addEvent(UUID, 'input', ({target}) => {
  if (!target.hasAttribute(UUID)) return
  const match = target.value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') || '.^'  // From lodash
  const regex = new RegExp(match, 'gi')

  onFilter(target, {
    relatedTarget: target.nextElementSibling,
    render: (items) => input(target, {items}),
    highlight: (val) => escapeHTML(val).replace(regex, '<mark>$&</mark>'),
    escapeHTML,
    regex
  })
})

addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return                    // Let browser do it's thing
  if (event.target.hasAttribute(UUID)) return onKey(event.target, event)        // Quick check
  for (let el = event.target, prev; el; el = el.parentElement) {                // Check if inside list
    if ((prev = el.previousElementSibling) && prev.hasAttribute(UUID)) return onKey(prev, event)
  }
})

function onKey (input, event) {
  const list = input.nextElementSibling
  const focus = queryAll(`${ITEM}:not([hidden])`, list)
  const index = focus.indexOf(document.activeElement)
  let item = false

  if (event.keyCode === KEYS.END || event.keyCode === KEYS.PAGEDOWN) item = focus.pop()
  else if (event.keyCode === KEYS.HOME || event.keyCode === KEYS.PAGEUP) item = focus[0]
  else if (event.keyCode === KEYS.DOWN) item = focus[index + 1] || focus[0]
  else if (event.keyCode === KEYS.UP) item = focus[index - 1] || focus.pop()
  else if (event.keyCode !== KEYS.SHIFT && event.keyCode !== KEYS.ENTER) input.focus()

  setupExpand(input, event.keyCode !== KEYS.ESC)
  if (item !== false) event.preventDefault()  // preventDefault even if empty list
  if (item) item.focus()
}

function onSelect (input, detail) {
  if (dispatchEvent(input, 'input.select', detail)) {
    const item = detail.currentTarget
    input.value = item.value || item.textContent.trim()
    input.focus()
    setupExpand(input, false)
  }
}

function onFilter (input, detail) {
  if (dispatchEvent(input, 'input.type', detail)) {
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
  item.hasAttribute('aria-label') || item.setAttribute('aria-label', `${item.textContent.trim()}, ${index+1} av ${items.length}`)
  item.setAttribute('tabindex', '-1')
}
