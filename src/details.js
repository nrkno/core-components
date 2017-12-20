import {attr, closest, dispatchEvent, getElements} from './utils'

const KEY = 'details-@VERSION'
const DETAILS = 'detail'
const SUMMARY = 'summar'
const ENTER_KEY = 13
const SPACE_KEY = 32

export function details (elements) {
  if(!(this instanceof details)) return new details(elements) //eslint-disable-line
  this.elements = getElements(elements)
  this.elements.forEach((details) => toggle(details, details.hasAttribute('open')))
}

details.prototype.open = function (fn = true) {
  this.elements.forEach((el, i) => toggle(el, fn, i))
  return this
}
details.prototype.close = function (fn = true) {
  this.elements.forEach((el, i) => toggle(el, !fn, i))
  return this
}

function toggle (details, fn, index) {
  const isOpen = Boolean(typeof fn === 'function' ? fn(details, index) : fn)
  const slient = details.open === isOpen || 'ontoggle' in details

  details[KEY] = true                           // Register polyfill
  attr(details.querySelectorAll(SUMMARY), {
    tabindex: 0,
    role: 'button',
    'aria-expanded': isOpen
  })

  // console.log(details.open, isOpen, details.hasAttribute('open'))
  if (isOpen !== details.open) details.open = isOpen
  if (isOpen !== details.hasAttribute('open')) attr(details, {open: isOpen || null})

  slient || dispatchEvent(details, 'toggle')
}

function onKey (event) {
  if (event.keyCode === ENTER_KEY || event.keyCode === SPACE_KEY) onClick(event)
}

function onClick (event) {
  const summary = closest(event.target, SUMMARY)
  const details = closest(event.target, DETAILS)

  if (summary && details && KEY in details) {               // Only handle polyfilled elements
    if (event.keyCode === SPACE_KEY) event.preventDefault() // Prevent scroll
    toggle(details, !details.open)
  }
}

// Make sure we are in a browser and have not already loaded the component
if (typeof document !== 'undefined' && !document.getElementById(KEY)) {
  document.createElement(DETAILS)                           // Shim <details> for IE and
  document.createElement(SUMMARY)                           // Shim <summary> for IE
  document.addEventListener('click', onClick)               // Polyfill click to toggle
  document.addEventListener('keydown', onKey)               // Make <summary role="button"> behave like <button>
  document.head.insertAdjacentHTML('afterbegin',            // Insert css in top for easy overwriting
    `<style id="${KEY}">
      ${SUMMARY}{display:block;cursor:pointer;touch-action:manipulation}
      ${SUMMARY}::-webkit-details-marker{display:none}
      ${SUMMARY}::before{content:'';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0h10L5 10'/%3E%3C/svg%3E") 0 45%/50% no-repeat}
      ${SUMMARY}[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0l10 5-10 5'/%3E%3C/svg%3E")}
      ${SUMMARY}[aria-expanded="false"]~*{display:none}
    </style>`)
}
