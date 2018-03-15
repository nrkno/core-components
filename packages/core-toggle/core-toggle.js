import {name, version} from './package.json'
import {addEvent, ariaExpand, ariaTarget, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-')         // Strip invalid attribute characters
const OPEN = 'aria-expanded'
const POPS = 'aria-haspopup'

const isBool = (val) => typeof val === 'boolean'

export default function toggle (selector, open) {
  const options = typeof open === 'object' ? open : {open}
  const buttons = queryAll(selector)

  buttons.forEach((button) => {
    const open = isBool(options.open) ? options.open : button.getAttribute(OPEN) === 'true'
    const pops = isBool(options.popup) ? options.popup : button.getAttribute(POPS) === 'true'

    button.setAttribute(UUID, '')
    button.setAttribute(POPS, pops)

    ariaTarget(button, 'controls')
    ariaExpand(button, open)
  })

  return buttons
}

addEvent(UUID, 'click', ({target}) => {
  queryAll(`[${UUID}]`).forEach((el) => {
    const open = el.getAttribute(OPEN) === 'true'
    const pops = el.getAttribute(POPS) === 'true'

    if (el.contains(target)) toggle(el, !open)                  // Click on toggle
    else if (pops) toggle(el, ariaTarget(el).contains(target))  // Click in target or outside
  })
})
