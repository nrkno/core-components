import {attr, closest, getElements, queryAll} from './utils'

const DETAILS = 'details'
const SUMMARY = 'summary'
const STYLE_ID = `${DETAILS}-polyfill`
const ENTER_KEY = 13
const SPACE_KEY = 32

export class details {
  constructor (elements) {
    this.elements = getElements(elements)
    this.elements.forEach((el, i) => toggle(el, i, el.getAttribute('open')))
    return this
  }
  open (fn = true) {
    this.elements.forEach((el, i) => toggle(el, i, fn))
    return this
  }
  close (fn = false) {
    this.elements.forEach((el, i) => toggle(el, i, fn))
    return this
  }
}

function toggle (el, index, fn) {
  const open = typeof fn === 'function' ? fn(el, index) : Boolean(fn)
  const hasToggleSupport = 'ontoggle' in details
  // const hasOpenSupport = 'open' in details
  const summaryAttribute = {
    tabindex: 0,
    role: 'button',
    'aria-expanded': Boolean(open)
  }

  queryAll(SUMMARY, details).forEach((summary) => attr(summary, summaryAttribute))
  attr(details, {open: open ? '' : null})

  // hasOpenSupport || details.
  hasToggleSupport || details.dispatchEvent(new window.CustomEvent('toggle'))
}

function onKey (event) {
  if (event.keyCode === ENTER_KEY || event.keyCode === SPACE_KEY) onClick(event)
}

function onClick (event) {
  const summary = closest(event.target, SUMMARY)
  const details = summary && summary.parentElement

  if (details) {
    event.preventDefault()     // Prevent scroll
    toggle(details, !details.hasAttribute('open'))
  }
}

// Make sure we are in a browser and have not already loaded the component
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  require('custom-event-polyfill')                          // Polyfill CustomEvent
  document.createElement(DETAILS)                           // HTML5 shiv <details> for IE
  document.createElement(SUMMARY)                           // HTML5 shiv <summary> for IE
  document.addEventListener('keydown', onKey)               // Make role="button" behave like <button>
  document.addEventListener('click', onClick)               // Polyfill click to toggle
  document.head.insertAdjacentHTML('afterbegin',            // Insert css in top for easy overwriting
    `<style id="${STYLE_ID}">
      ${SUMMARY}{display:block;cursor:pointer;touch-action:manipulation}
      ${SUMMARY}::-webkit-details-marker{display:none}
      ${SUMMARY}::before{content:'';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0h10L5 10'/%3E%3C/svg%3E") 0 45%/50% no-repeat}
      ${SUMMARY}[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0l10 5-10 5'/%3E%3C/svg%3E")}
      ${SUMMARY}[aria-expanded="false"]~*{display:none}
    </style>`)
}
