import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const KEYS = {SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}

/**
 * Initialize core-tabs
 *
 * @param {String|NodeList|Element[]|Element} tablists A CSS selector string, nodeList, element array, or single element
 * @param {Number|String|Element} open index, id or tab-element of the open tab
 */
export default function tabs (tablists, open) { // open can be Number, String or Element
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
    const tablist = el.parentElement
    if (el.getAttribute('role') === 'tab' && tablist.hasAttribute(UUID)) {
      return setOpen(tablist, el) || event.preventDefault() // Also prevent links
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

function getOpenTabIndex (tabs) {
  const open = tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true')[0]
  return Math.max(0, tabs.indexOf(open))
}

/**
 * @param {Element} tablist
 * @param {Number|String|Element} open
 */
function setOpen (tablist, open) { // open can be Number, String or Element
  const next = tablist.nextElementSibling ? tablist.nextElementSibling.children : []
  const tabs = queryAll(tablist.children).filter((tab) => tab.nodeName === 'A' || tab.nodeName === 'BUTTON')
  const panels = tabs.map((tab, i) => document.getElementById(tab.getAttribute('aria-controls')) || next[i] || next[0])
  const isOpen = getOpenTabIndex(tabs)
  const willOpen = tabs.reduce((acc, tab, i) => (i === open || tab === open || tab.id === open) ? i : acc, isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(tablist, 'tabs.toggle', {isOpen, willOpen, tabs, panels})
  const nextOpen = isUpdate ? willOpen : getOpenTabIndex(tabs) // dispatchEvent can change attributes, so check getOpenPanel again

  tabs.forEach((tab, index) => {
    const panel = panels[index]
    const selectedTab = index === nextOpen
    const selectedPanel = panel === panels[nextOpen]

    tab.setAttribute('role', 'tab')
    tab.setAttribute('tabindex', selectedTab - 1)
    tab.setAttribute('aria-selected', selectedTab)
    tab.setAttribute('aria-controls', panel.id = panel.id || getUUID())
    panel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
    panel.setAttribute('role', 'tabpanel')
    panel[selectedPanel ? 'removeAttribute' : 'setAttribute']('hidden', '')
  })

  // Setup after loop as we now know all tabs have IDs
  panels[nextOpen].setAttribute(`${ARIA}-labelledby`, tabs[nextOpen].id)

  return !isUpdate
}
