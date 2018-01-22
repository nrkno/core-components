import {name, version} from './package.json'
import {getElements, on} from '../utils'
import 'polyfill-custom-event'

const KEY = `${name}-${version}`                    // Unique id of component

export function expand (...args) {                  // Expose component
  return new Expand(...args)
}

class Expand {
  constructor (elements) {
    this.elements = getElements(elements, KEY)
  }
  open (open = true) {
    this.toggle(open)
  }
  close (open = false) {
    this.toggle(open)
  }
  toggle (open = null) {
    this.elements.forEach((el, index) => {
      const isExpanded = el.getAttribute('aria-expanded') !== 'false'
      const willExpand = open === null ? isExpanded : (typeof open === 'function' ? open(el, index) : open)
      const event = new window.CustomEvent('toggle', {bubbles: true, cancelable: true})

      if (el.dispatchEvent(event)) el.setAttribute('aria-expanded', Boolean(willExpand)) // Expand if not preventDefault
    })
  }
}

on(KEY, 'click', (el) => expand(el).toggle())
