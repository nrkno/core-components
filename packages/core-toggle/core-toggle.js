import {name, version} from './package.json'
import {addElements, addEvent, CustomEvent} from '../utils'

const KEY = `${name}-${version}`                    // Unique id of component
const ATTR = 'aria-expanded'

export function toggle (elems, open = null) {       // Toggle component
  return addElements(KEY, elems).map((el) => {
    const isExpand = el.getAttribute(ATTR) === 'true'
    const doExpand = open === null ? isExpand : Boolean(open)
    const canSetup = isExpand === doExpand || el.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      cancelable: true
    }))

    if (canSetup) el.setAttribute(ATTR, doExpand)
    return el
  })
}

addEvent(KEY, 'click', (el) => {
  toggle(el, el.getAttribute(ATTR) === 'false')
})
