require('./a11y.js')

const DETAILS = 'detail'
const SUMMARY = 'summar'
const IS_BROWSER = typeof document !== 'undefined'
const HAS_OPEN = IS_BROWSER && ('open' in document.createElement(DETAILS))

function onClick (event) {
  let el = event.target
  for (; el; el = el.parentElement) {
    if (el.nodeName.toLowerCase() === SUMMARY) break
  }
  if (el) {
    console.log(el.parentElement.open)
    el.parentElement.open = !el.parentElement.open
  }
}

if (IS_BROWSER && !HAS_OPEN) {
  document.addEventListener('click', onClick)
  document.documentElement.appendChild(document.createElement('style')).textContent = `
    ${DETAILS}{display:block}
    ${SUMMARY}{display:block;cursor:pointer;touch-action:manipulation}
    ${SUMMARY}::-webkit-details-marker{display:none}
    ${SUMMARY}::before{content:'\\25BC';padding-right:.5em;font-size:.8em}
    ${SUMMARY}[aria-expanded="false"]::before{content:'\\25B6'}
    ${SUMMARY}[aria-expanded="false"]~*{display:none}
  `

  Object.defineProperty(window.Element.prototype, 'open', {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.nodeName.toLowerCase() === DETAILS && this.hasAttribute('open')
    },
    set: function (open) {
      if (this.nodeName.toLowerCase() !== DETAILS) return void 0;
      (this[open ? 'setAttribute' : 'removeAttribute'])('open', '')
      return open
    }
  })
}
