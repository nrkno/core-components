import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const KEYS = {SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}

export default function tabs (tablists, open) { // open can be Number or String or Element
  return queryAll(tablists).map((tablist) => {
    tablist.setAttribute(UUID, '')
    tablist.setAttribute('role', 'tablist')
    setOpen(tablist, open)
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
    const els = queryAll(tablist.children)
    const open = els.indexOf(tab)
    const key = event.keyCode

    if (key === KEYS.SPACE) tab.click() // Forward action to click event
    else if (key === KEYS.DOWN || key === KEYS.RIGHT) tab = els[open + 1] || els[0]
    else if (key === KEYS.UP || key === KEYS.LEFT) tab = els[open - 1] || els.pop()
    else if (key === KEYS.END) tab = els.pop()
    else if (key === KEYS.HOME) tab = els[0]
    else return // Do not hijack other keys

    event.preventDefault()
    tab.focus()
  }
})

function setOpen (tablist, open) { // open can be Number or String or Element
  const tabs = queryAll(tablist.children)
  const pans = tablist.nextElementSibling.children
  const isOpen = tabs.reduce((acc, tab, i) => pans[i].hasAttribute('hidden') ? acc : i, 0)
  const willOpen = tabs.reduce((acc, tab, i) => (i === open || tab === open || tab.id === open) ? i : acc, isOpen)
  const isRender = isOpen === willOpen || dispatchEvent(tablist, 'tabs.toggle', {
    isOpen,
    willOpen,
    relatedTarget: tabs[isOpen],
    currentTarget: tabs[willOpen]
  })

  if (isRender) {
    tabs.forEach((tab, index) => {
      const selected = index === willOpen
      const panel = pans[index]

      tab.setAttribute('role', 'tab')
      tab.setAttribute('tabindex', selected - 1)
      tab.setAttribute('aria-selected', selected)
      tab.setAttribute('aria-controls', panel.id = panel.id || getUUID())
      panel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', 0)
      panel[selected ? 'removeAttribute' : 'setAttribute']('hidden', '')
    })
  }
  return isRender
}
