const DETAILS = 'details'
const SUMMARY = 'summary'

function closest (elem, tagName) {
  for (let el = elem; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === tagName) return el
  }
}

function onKey (event) {
  if (event.keyCode === 13 || event.keyCode === 32) onClick(event)
}

function onClick (event) {
  const summary = closest(event.target, SUMMARY)
  const details = closest(summary, DETAILS)

  if (details) {
    const isOpen = details.hasAttribute('open')
    const isSupported = 'open' in details

    summary.setAttribute('aria-expanded', !isOpen)
    isSupported || details[`${isOpen ? 'remove' : 'set'}Attribute`]('open', '')
    isSupported || event.preventDefault()   // Prevents scroll on keydown
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
  document.head.appendChild(document.createElement('style')).textContent = `
    ${SUMMARY}{display:block;cursor:pointer;touch-action:manipulation}
    ${SUMMARY}::before{content:'\\25BC';font-size:.8em;padding-right:.5em}
    ${SUMMARY}::-webkit-details-marker{display:none}
    ${SUMMARY}[aria-expanded="false"]~*{display:none}
    ${SUMMARY}[aria-expanded="false"]::before{content:'\\25BA'}
  `
}
