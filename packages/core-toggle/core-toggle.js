import { name, version } from './package.json'
import { IS_ANDROID, IS_IOS, addEvent, dispatchEvent, getUUID, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const OPEN = 'aria-expanded'
const KEYS = { ESC: 27 }

export default function toggle (toggles, open) {
  const options = typeof open === 'object' ? open : { open }
  if (IS_IOS) document.documentElement.style.cursor = 'pointer' // Fix iOS events for closing popups (https://stackoverflow.com/a/16006333/8819615)

  return queryAll(toggles).map((toggle) => {
    const content = getContentElement(toggle)
    const isOpen = toggle.getAttribute(OPEN) === 'true' || !content.hasAttribute('hidden')
    const open = typeof options.open === 'boolean' ? options.open : (options.open === 'toggle' ? !isOpen : isOpen)
    const popup = String((options.hasOwnProperty('popup') ? options.popup : toggle.getAttribute(UUID)) || false)

    if (options.value) toggle.innerHTML = options.value // Set innerHTML before updating aria-label
    if (popup !== 'false' && popup !== 'true') toggle.setAttribute('aria-label', `${toggle.textContent}, ${popup}`) // Only update aria-label if popup-mode

    toggle.setAttribute(UUID, popup) // aria-haspopup triggers forms mode in JAWS, therefore store in uuid
    toggle.setAttribute('aria-controls', content.id = content.id || getUUID())
    content.setAttribute(`${ARIA}-labelledby`, toggle.id = toggle.id || getUUID())
    setOpen(toggle, open)
    return toggle
  })
}

function getContentElement (toggle) {
  return document.getElementById(toggle.getAttribute('aria-controls')) || toggle.nextElementSibling
}

addEvent(UUID, 'keydown', (event) => {
  if (event.keyCode !== KEYS.ESC) return
  for (let el = event.target; el; el = el.parentElement) {
    const toggle = (el.id && document.querySelector(`[aria-controls="${el.id}"]`)) || el

    if (toggle.getAttribute(UUID) !== 'false' && toggle.getAttribute(OPEN) === 'true') {
      event.preventDefault() // Prevent leaving maximized window in Safari
      toggle.focus()
      return setOpen(toggle, false)
    }
  }
}, true) // Use capture to enable checking defaultPrevented (from ESC key) in parents

addEvent(UUID, 'click', ({ target, defaultPrevented }) => {
  if (defaultPrevented) return false // Do not toggle if someone run event.preventDefault()

  for (let el = target, item; el; el = el.parentElement) {
    const toggle = item && el.id && document.querySelector(`[${UUID}][aria-controls="${el.id}"]`)
    if ((el.nodeName === 'BUTTON' || el.nodeName === 'A') && !el.hasAttribute(UUID)) item = el // interactive element clicked
    if (toggle) {
      dispatchEvent(toggle, 'toggle.select', {
        relatedTarget: getContentElement(toggle),
        currentTarget: item,
        value: item.textContent.trim()
      })
      break
    }
  }

  queryAll(`[${UUID}]`).forEach((toggle) => {
    const open = toggle.getAttribute(OPEN) === 'true'
    const popup = toggle.getAttribute(UUID) !== 'false'
    const content = getContentElement(toggle)

    if (toggle.contains(target)) setOpen(toggle, !open) // Click on toggle
    else if (popup && open) setOpen(toggle, content.contains(target)) // Click in content or outside
  })
})

function setOpen (toggle, open) {
  const content = getContentElement(toggle)
  const isOpen = toggle.getAttribute(OPEN) === 'true'
  const willOpen = typeof open === 'boolean' ? open : (open === 'toggle' ? !isOpen : isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(toggle, 'toggle', { relatedTarget: content, isOpen, willOpen })
  const nextOpen = isUpdate ? willOpen : toggle.getAttribute(OPEN) === 'true' // dispatchEvent can change attributes
  const focus = !isOpen && nextOpen && content.querySelector('[autofocus]')

  if (focus) setTimeout(() => focus && focus.focus()) // Move focus on next render (if element stil exists)

  toggle.setAttribute(OPEN, nextOpen)
  content[nextOpen ? 'removeAttribute' : 'setAttribute']('hidden', '')
}
