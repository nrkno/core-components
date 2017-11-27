function onKey (event) {
  if (event.keyCode === 13 || event.keyCode === 32) onClick(event)
}

function onClick (event) {
  for (var el = event.target; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === 'summary') break
  }

  if (el) {
    const details = el.parentElement
    const isOpen = details.hasAttribute('open')
    const isSupported = 'open' in details

    el.setAttribute('aria-expanded', !isOpen)
    isSupported || details[`${isOpen ? 'remove' : 'set'}Attribute`]('open', '')
    isSupported || event.preventDefault()   // Prevents scroll on keydown
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
  document.head.appendChild(document.createElement('style')).textContent = `
    summary{display:block;cursor:pointer;touch-action:manipulation}
    summary::-webkit-details-marker{display:none}
    summary::before{content:'';padding-right:1em;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath d='M0 0h10L5 10'/%3E%3C/svg%3E") 0 45%/50% no-repeat}
    summary[aria-expanded="false"]::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath d='M0 0l10 5-10 5'/%3E%3C/svg%3E")}
    summary[aria-expanded="false"]~*{display:none}
  `
}
