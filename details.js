require('a11y.js')

const HAS_OPEN = 'open' in document.createElement('details')

function closest (el, tag) {
  for (; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === tag) {
      return el
    }
  }
}

function toggleOpen (details, open) {
  if (!HAS_OPEN) {
    open ? details.removeAttribute('open') : details.setAttribute('open', '')
  }
}

function onClick (event) {
  const summary = closest(event.target, 'summary')
  if (summary) {
    const open = summary.getAttribute('aria-expanded') === 'false'
    const details = closest(summary, 'details')

    summary.setAttribute('role', 'button')
    summary.setAttribute('aria-expanded', open)
    toggleOpen(details, open)
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', onClick)
  document.documentElement.appendChild(document.createElement('style')).textContent = `
    details{display:block}
    summary{display:block;cursor:pointer;touch-action:manipulation}
    summary[aria-expanded="false"]~*{display:none}
  `
}
