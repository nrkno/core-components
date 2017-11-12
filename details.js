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
    summary::before{content:'\\25BC';font-size:.8em;padding-right:.5em}
    summary::-webkit-details-marker{display:none}
    summary[aria-expanded="false"]~*{display:none}
    summary[aria-expanded="false"]::before{content:'\\25BA'}
  `
}
