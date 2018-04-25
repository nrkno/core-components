import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const KEYS = {SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}

export default function tabs (tablists, open = {}) { // open can be Number, String or Element
  const options = typeof open === 'object' ? open : {open}
  return queryAll(tablists).map((tablist) => {
    const panels = queryAll(options.target || tablist.nextElementSibling.children) // Default target to children og next element

    tablist.setAttribute(UUID, '')
    tablist.setAttribute('role', 'tablist')
    setOpen(tablist, options.open, target)

    if (tablist.children.length !== panels.length) throw new Error('Not matching number of tabs and panels')
    return tablist
  })
}

addEvent(UUID, 'click', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  for (let el = event.target; el; el = el.parentElement) {
    if (el.getAttribute('role') === 'tab' && el.parentElement.hasAttribute(UUID)) {
      return setOpen(el.parentElement, el) || event.preventDefault() // Also prevent links
    }
  }
})

addEvent(UUID, 'keydown', (event) => {
  let tab = event.target
  const tablist = tab.parentElement

  if (event.ctrlKey || event.altKey || event.metaKey) return
  if (tab.getAttribute('role') === 'tab' && tablist.hasAttribute(UUID)) {
    const tabs = queryAll(tablist.children)
    const open = tabs.indexOf(tab)
    const key = event.keyCode

    if (key === KEYS.SPACE) tab.click() // Forward action to click event
    else if (key === KEYS.DOWN || key === KEYS.RIGHT) tab = tabs[open + 1] || tabs[0]
    else if (key === KEYS.UP || key === KEYS.LEFT) tab = tabs[open - 1] || tabs.pop()
    else if (key === KEYS.END) tab = tabs.pop()
    else if (key === KEYS.HOME) tab = tabs[0]
    else return // Do not hijack other keys

    event.preventDefault()
    tab.focus()
  }
})

function getOpenPanel (panels) {
  return Math.max(0, panels.indexOf(panels.filter((pan) => !pan.hasAttribute('hidden'))[0]))
}

function setOpen (tablist, open, panels = []) { // open can be Number, String or Element
  const tabs = queryAll(tablist.children).filter((tab) => tab.nodeName === 'A' || tab.nodeName === 'BUTTON')
  const panels = tabs.map((tab, i) => document.getElementById(tab.getAttribute('aria-controls')) || panels[i])
  const isOpen = getOpenPanel(panels)
  const willOpen = tabs.reduce((acc, tab, i) => (i === open || tab === open || tab.id === open) ? i : acc, isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(tablist, 'tabs.toggle', {isOpen, willOpen})
  const nextOpen = isUpdate ? willOpen : getOpenPanel(panels) // dispatchEvent can change attributes, so check getOpenPanel again

  tabs.forEach((tab, index) => {
    const selected = index === nextOpen
    const panel = panels[index]

    tab.setAttribute('role', 'tab')
    tab.setAttribute('tabindex', selected - 1)
    tab.setAttribute('aria-selected', selected)
    tab.setAttribute('aria-controls', panel.id = panel.id || getUUID())
    panel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
    panel.setAttribute('role', 'tabpanel')
    panel.setAttribute('tabindex', 0)
    panel[selected ? 'removeAttribute' : 'setAttribute']('hidden', '')
  })

  return nextOpen
}
