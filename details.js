function onKey (event) {
  if (event.keyCode === 13 || event.keyCode === 32) onClick(event)
}

function onClick (event) {
  for (var el = event.target; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === 'summary') break      //  Travese DOM tree and find closest summary
  }

  if (el) {
    const details = el.parentElement
    const hasToggle = 'ontoggle' in details                 // Snitt support since toggle event and details element is independent
    const hasDetails = 'open' in details                    // Sniff support since preventDefault does not stop expand in Firefox
    const isOpen = details.hasAttribute('open')

    el.setAttribute('aria-expanded', !isOpen)

    hasDetails || event.preventDefault()                    // Prevent scroll on keydown
    hasDetails || details[`${isOpen ? 'remove' : 'set'}Attribute`]('open', '')
    hasToggle || details.dispatchEvent(new window.CustomEvent('toggle'))
  }
}

// Make sure we are in a browser and have not allready loaded the polyfill
if (typeof document !== 'undefined' && !document.getElementById('details-polyfill')) {
  require('custom-event-polyfill')                          // Polyfill CustomEvent
  document.createElement('details')                         // HTML5 shiv details for IE
  document.createElement('summary')                         // HTML5 shiv summary for IE
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
  const style = document.createElement('style')
  style.id = 'details-polyfill'
  style.textContent = `
    summary{display:block;cursor:pointer;touch-action:manipulation}
    summary::-webkit-details-marker{display:none}
    summary::before{content:'';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0h10L5 10'/%3E%3C/svg%3E") 0 45%/50% no-repeat}
    summary[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath d='M0 0l10 5-10 5'/%3E%3C/svg%3E")}
    summary[aria-expanded="false"]~* { display: none }
  `
  document.head.appendChild(style)
}
