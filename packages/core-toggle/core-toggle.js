import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const OPEN = 'aria-expanded'
const POPS = 'aria-haspopup'
const KEYS = {ESC: 27}

export default function toggle (buttons, open) {
  const options = typeof open === 'object' ? open : {open}

  return queryAll(buttons).map((button) => {
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

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode === KEYS.ESC) {
    for (let el = event.target; el; el = el.parentElement) {
      const prev = el.previousElementSibling
      const inPopup = prev && prev.hasAttribute(UUID) && (el = prev)
      if (inPopup || el.hasAttribute(UUID)) {
        const open = el.getAttribute(OPEN) === 'true'
        const pops = el.getAttribute(POPS) === 'true'
        if (open && pops) return setOpen(el, false, el.focus())
      }
    }
  }
})

addEvent(UUID, 'click', ({target}) => {
  queryAll(`[${UUID}]`).forEach((el) => {
    const open = el.getAttribute(OPEN) === 'true'
    const pops = el.getAttribute(POPS) === 'true'
    const next = el.nextElementSibling

    if (el.contains(target)) setOpen(el, !open) // Click on toggle
    else if (pops && open) setOpen(el, next.contains(target)) // Click in target or outside
  })
})

function setOpen (button, open) {
  const relatedTarget = button.nextElementSibling
  const isOpen = button.getAttribute(OPEN) === 'true'
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(button, 'toggle', {relatedTarget, isOpen, willOpen})
  const nextOpen = isUpdate ? willOpen : button.getAttribute(OPEN) === 'true' // dispatchEvent can change attributes

  button.setAttribute(OPEN, nextOpen)
  button.nextElementSibling[nextOpen ? 'removeAttribute' : 'setAttribute']('hidden', '')
}
