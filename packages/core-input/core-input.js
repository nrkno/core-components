import {name, version} from './package.json'
import {IS_IOS, addEvent, escapeHTML, dispatchEvent, requestAnimFrame, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, ESC: 27, PAGEUP: 33, PAGEDOWN: 34, END: 35, HOME: 36, UP: 38, DOWN: 40}
const ITEM = '[tabindex="-1"]'
const AJAX_DEBOUNCE = 500

export default function input (elements, value = {}) {
  const options = typeof value === 'object' ? value : {value}
  const repaintValue = typeof options.value === 'string'
  const repaintList = typeof options.list === 'string'

  return queryAll(elements).map((input) => {
    const list = input.nextElementSibling
    const ajax = options.hasOwnProperty('ajax') ? options.ajax : input.getAttribute(UUID)
    const multiple = options.hasOwnProperty('multiple') ? options.multiple : input.multiple

    input.setAttribute(UUID, ajax || '')
    input.setAttribute(IS_IOS ? 'data-role' : 'role', 'combobox') // iOS does not inform user area is editable if combobox
    input.setAttribute('aria-autocomplete', 'list')
    input.setAttribute('autocomplete', 'off')
    input.multiple = multiple

    if (multiple) onRenderValue (input) // repaintValue
    if (repaintList) list.innerHTML = options.list
    queryAll('a,button', list).forEach(setupListItem)
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
addEvent(UUID, 'input', ({target}) => target.hasAttribute(UUID) && onRenderList(target))
addEvent(UUID, 'keydown', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  if (event.target.hasAttribute(UUID)) return onKey(event.target, event) // Quick check
  for (let el = event.target, prev; el; el = el.parentElement) { // Check if inside list
    if ((prev = el.previousElementSibling) && prev.hasAttribute(UUID)) return onKey(prev, event)
  }
})

function onClickOrFocus (event) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.defaultPrevented) return

  queryAll(`[${UUID}]`).forEach((input) => {
    const list = input.nextElementSibling
    const open = input.contains(event.target) || list.contains(event.target)
    const item = event.type === 'click' && open && queryAll(ITEM, list).filter((item) => item.contains(event.target))[0]

    if (item) onSelect(input, item)
    else setupExpand(input, open)
  })
}

function onKey (input, event) {
  const {target, keyCode} = event
  const list = input.nextElementSibling
  const focus = queryAll(`${ITEM}:not([hidden])`, list)
  const index = focus.indexOf(document.activeElement)
  let item = false

  if (keyCode === KEYS.ENTER && target === input && input.multiple) onSelect(input, input, event.preventDefault())
  else if (keyCode === KEYS.DOWN) item = focus[index + 1] || focus[0]
  else if (keyCode === KEYS.UP) item = focus[index - 1] || focus.pop()
  else if (list.contains(target)) { // Aditional shortcuts if focus is inside list
    if (keyCode === KEYS.END || keyCode === KEYS.PAGEDOWN) item = focus.pop()
    else if (keyCode === KEYS.HOME || keyCode === KEYS.PAGEUP) item = focus[0]
    else if (keyCode !== KEYS.ENTER) input.focus()
  }

  if (!list.hasAttribute('hidden') && keyCode === KEYS.ESC) event.preventDefault()
  setupExpand(input, keyCode !== KEYS.ESC)
  if (item !== false) event.preventDefault() // event.preventDefault even if empty list
  if (item) item.focus()
}

function onSelect (input, currentTarget) {
  const relatedTarget = input.nextElementSibling
  const value = (currentTarget.value || currentTarget.textContent).trim();
  const detail = {relatedTarget, currentTarget, value, multiple: input.multiple}

  if (dispatchEvent(input, 'input.select', detail)) {
    if (input.multiple) {
      if (value) {
        input.previousElementSibling.insertAdjacentHTML('beforeend', `
          <li><label role="text" tabindex="0">
            <input type="hidden" name="${input.name}" value="${value}">
            &nbsp;${value}&nbsp;
          </label></li>
        `)
      }
      input.value = ''
    } else {
      input.value = value
    }
    input.focus()
    setupExpand(input, false)
  }
}

function onRenderList (input) {
  const list = input.nextElementSibling
  if (dispatchEvent(input, 'input.render.list', {relatedTarget: list}) && !ajax(input)) {
    queryAll(ITEM, list).reduce((acc, item) => {
      const show = item.textContent.toLowerCase().indexOf(input.value.toLowerCase()) !== -1
      item[show ? 'removeAttribute' : 'setAttribute']('hidden', '')
      return show ? acc.concat(item) : acc
    }, []).forEach(setupListItem)
  }
}

function onRenderTags (input) {
  if (dispatchEvent(input, 'input.value', {})) {
    input.insertAdjacentHTML('beforebegin', `<ul class="nrk-grid">${input.value.split(/\s*,\s*/).map((value) => `
      <li><label role="text" tabindex="0"> <!-- TODO role text? -->
        <input type="hidden" name="${input.name}" value="${value}">
        &nbsp;${value}&nbsp;
      </label></li>
    `).join('')}</ul>`)
    input.value = ''
  }
}

function setupExpand (input, open = input.getAttribute('aria-expanded') === 'true') {
  requestAnimFrame(() => { // Fixes VoiceOver Safari focus jumping to parentElement
    input.nextElementSibling[open ? 'removeAttribute' : 'setAttribute']('hidden', '')
    input.setAttribute('aria-expanded', open)
  })
}

function addValue () {

}

function removeValue () {

}

function setupListItem (item, index, items) {
  if (item.nodeName === 'BUTTON') item.type = 'button'
  item.setAttribute('aria-label', `${item.textContent.trim()}, ${index + 1} av ${items.length}`)
  item.setAttribute('tabindex', '-1')
}

function ajax (input) {
  const url = input.getAttribute(UUID)
  const req = ajax.req = ajax.req || new window.XMLHttpRequest()
  if (!url) return false

  clearTimeout(ajax.timer) // Clear previous search
  req.abort() // Abort previous request
  req.onload = () => {
    try { req.responseJSON = JSON.parse(req.responseText) } catch (err) { req.responseJSON = false }
    dispatchEvent(input, 'input.ajax', req)
  }
  ajax.timer = setTimeout(() => { // Debounce next request 500 milliseconds
    if (!input.value) return // Abort if input is empty
    req.open('GET', url.replace('{{value}}', window.encodeURIComponent(input.value)), true)
    req.send()
  }, AJAX_DEBOUNCE)
}
