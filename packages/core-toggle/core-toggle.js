import {name, version} from './package.json'
import {addElements, addEvent, CustomEvent} from '../utils'

const KEY = `${name}-${version}`                    // Unique id of component
const ATTR = 'aria-expanded'

/**
* toggle
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @param {Boolean} [open] Optional open argument. True will open, false will close
* @return {Array} Array of elements
*/
export function toggle (elements, open) {
  const action = typeof open

  return addElements(KEY, elements).map((el, index) => {
    const prevState = el.getAttribute(ATTR) === 'true'
    const nextState = action === 'undefined' ? prevState : Boolean(action === 'function' ? open(el, index) : open)
    const canUpdate = prevState === nextState || el.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      cancelable: true,
      detail: nextState
    }))

    if (canUpdate) el.setAttribute(ATTR, Boolean(open))
    return el
  })
}

addEvent(KEY, 'click', (el) => {
  toggle(el, el.getAttribute(ATTR) !== 'true')
})
