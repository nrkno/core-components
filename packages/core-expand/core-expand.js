import {name, version} from './package.json'
import {getElements} from '../utils'
import 'polyfill-custom-event'

const KEY = `${name}-${version}`

export function expand (...args) {
  return new Expand(...args)
}

class Expand {
  constructor (elements) {
    this.elements = getElements(elements)
    this.elements.forEach((el) => (el[KEY] = 1))   // Register polyfill
  }
  open (open = true) { this.toggle(open) }
  close (open = false) { this.toggle(open) }
  toggle (open) {
    const type = typeof open

    this.elements.forEach((element, index) => {
      // const shouldExpand = type === 'function' ? open(element, index) : (type === 'undefined' ? el.getAttribute('aria-expanded') === 'false') : open
      const toggleEvent = new window.CustomEvent('toggle', {bubbles: true, cancelable: true})
      el.dispatchEvent(toggleEvent)

      // Only toggle if not event.preventDefault()
      // toggleEvent.defaultPrevented || el.setAttribute('aria-expanded', Boolean(shouldExpand))
    })
  }
}

// Click to toggle (only bind if unbound)
if (typeof window !== 'undefined' && !window[KEY] && (window[KEY] = 1)) {
  document.addEventListener('click', function (event) {
    for (let el = event.target; el; el = el.parentElement) {
      if (el[KEY]) expand(el).toggle()  // Only handle polyfilled elements
    }
  })
}
