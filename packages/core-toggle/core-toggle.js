import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const OPEN = 'aria-expanded'
const POPS = 'aria-haspopup'

export default function toggle (buttons, open) {
  const options = typeof open === 'object' ? open : {open}

  return queryAll(buttons).forEach((button) => {
    const open = typeof options.open === 'boolean' ? options.open : button.getAttribute(OPEN) === 'true'
    const pops = typeof options.popup === 'boolean' ? options.popup : button.getAttribute(POPS) === 'true'
    const next = button.nextElementSibling

    button.setAttribute(UUID, '')
    button.setAttribute(POPS, pops)
    button.setAttribute('aria-controls', next.id = next.id || getUUID())
    next.setAttribute(`${ARIA}-labelledby`, button.id = button.id || getUUID())
    setOpen(button, open)
    return button
  })
}

addEvent(UUID, 'click', ({target}) => {
  queryAll(`[${UUID}]`).forEach((el) => {
    const open = el.getAttribute(OPEN) === 'true'
    const pops = el.getAttribute(POPS) === 'true'
    const next = el.nextElementSibling

    if (el.contains(target)) setOpen(el, !open) // Click on toggle
    else if (pops) setOpen(el, next.contains(target)) // Click in target or outside
  })
})

function setOpen (button, open) {
  const relatedTarget = button.nextElementSibling
  const isOpen = button.getAttribute(OPEN) === 'true'
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isRender = isOpen === willOpen || dispatchEvent(button, 'toggle', {relatedTarget, isOpen, willOpen})

  if (isRender) {
    button.setAttribute(OPEN, open)
    button.nextElementSibling[open ? 'removeAttribute' :  'setAttribute']('hidden', '')
  }
}
