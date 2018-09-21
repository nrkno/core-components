import { name, version } from './package.json'
import { IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const OPEN = 'aria-expanded'
const POPS = 'data-haspopup' // aria-haspopup triggers forms mode in JAWS, therefore data-
const KEYS = { ESC: 27 }

export default function toggle (buttons, open) {
  const options = typeof open === 'object' ? open : { open }

  return queryAll(buttons).map((button) => {
    const open = typeof options.open === 'boolean' ? options.open : button.getAttribute(OPEN) === 'true'
    const pops = typeof options.popup === 'boolean' ? options.popup : button.getAttribute(POPS) === 'true'
    const content = getContentElement(button)

    button.setAttribute(UUID, '')
    button.setAttribute(POPS, pops)
    button.setAttribute('aria-controls', content.id = content.id || getUUID())
    content.setAttribute(`${ARIA}-labelledby`, button.id = button.id || getUUID())
    setOpen(button, open)
    return button
  })
}

function getContentElement (button) {
  return document.getElementById(button.getAttribute('aria-controls')) || button.nextElementSibling
}

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode !== KEYS.ESC) return
  for (let el = event.target; el; el = el.parentElement) {
    const button = (el.id && document.querySelector(`[aria-controls="${el.id}"]`)) || el

    if (button.hasAttribute(UUID) && button.getAttribute(POPS) === 'true' && button.getAttribute(OPEN) === 'true') {
      event.preventDefault() // Prevent leaving maximized window in Safari
      button.focus()
      return setOpen(button, false)
    }
  }
}, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents

addEvent(UUID, 'click', ({ target, defaultPrevented }) => {
  if (defaultPrevented) return false // Do not toggle if someone run event.preventDefault()
  queryAll(`[${UUID}]`).forEach((el) => {
    const open = el.getAttribute(OPEN) === 'true'
    const pops = el.getAttribute(POPS) === 'true'
    const content = getContentElement(el)

    if (el.contains(target)) setOpen(el, !open) // Click on toggle
    else if (pops && open) setOpen(el, content.contains(target)) // Click in content or outside
  })
})

function setOpen (button, open) {
  const content = getContentElement(button)
  const isOpen = button.getAttribute(OPEN) === 'true'
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(button, 'toggle', { relatedTarget: content, isOpen, willOpen })
  const nextOpen = isUpdate ? willOpen : button.getAttribute(OPEN) === 'true' // dispatchEvent can change attributes
  const focus = nextOpen && content.querySelector('[autofocus]')

  if (focus) setTimeout(() => focus && focus.focus()) // Move focus on next render (if element stil exists)

  button.setAttribute(OPEN, nextOpen)
  content[nextOpen ? 'removeAttribute' : 'setAttribute']('hidden', '')
}
