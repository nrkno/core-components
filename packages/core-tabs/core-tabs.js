import {name, version} from './package.json'
import {IS_ANDROID, addEvent, dispatchEvent, getUUID, queryAll} from '../utils'

/**
 * Options
 *
 * By setting dangerouslyPromiseToHandle**Panels** you promise:
 *
 * * setting tab[aria-controls] correctly
 * * setting panel[id] correctly
 * * using set**Panel**Attributes to update properties on the panel element
 *
 * By setting dangerouslyPromiseToHandle**Tabs** you promise:
 *
 * * setting tab[aria-controls] correctly
 * * setting panel[id] correctly
 * * using set**Tab**Attributes to update properties on the panel element
 *
 * @typedef {Object} Options
 * @property {boolean} [dangerouslyPromiseToHandlePanels] I promise to handle panel attributes setTabAttributes.
 * @property {boolean} [dangerouslyPromiseToHandleTabs] I promise to handle tab attributes by using setTabAttributes.
 */

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const OPTIONS = `${UUID}-options`
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const KEYS = {SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}

/**
 * Initialize core-tabs
 *
 * @param {String|NodeList|Element[]|Element} tablists A CSS selector string, nodeList, element array, or single element
 * @param {Number|String|Element} open index, id or tab-element of the open tab
 * @param {Options} [options]
 */
export default function coreTabs (tablists, open, options = {}) { // open can be Number, String or Element
  return queryAll(tablists).map((tablist) => {
    tablist.setAttribute(UUID, '')
    tablist.setAttribute(OPTIONS, JSON.stringify(options))
    tablist.setAttribute('role', 'tablist')
    setOpen(tablist, open, options)
    return tablist
  })
}

/**
 * Updates a panel element with correct a11y attributes.
 *
 * @param {Element} panel the panel to update
 * @param {Element} tab the tab this panel belongs to
 * @param {boolean} selected tab is selected
 */
export function setPanelAttributes (panel, tab, selected) {
  panel.setAttribute(`${ARIA}-labelledby`, tab.id)
  panel.setAttribute('role', 'tabpanel')
  panel.setAttribute('tabindex', 0)
  panel[selected ? 'removeAttribute' : 'setAttribute']('hidden', '')
}

/**
 * Updates a tab element with correct a11y attributes
 *
 * @param {Element} tab the tab to update
 * @param {boolean} selected tab is selected
 */
export function setTabAttributes (tab, selected) {
  tab.setAttribute('role', 'tab')
  tab.setAttribute('tabindex', selected - 1)
  tab.setAttribute('aria-selected', selected)
}

addEvent(UUID, 'click', (event) => {
  if (event.ctrlKey || event.altKey || event.metaKey) return
  for (let el = event.target; el; el = el.parentElement) {
    if (el.getAttribute('role') === 'tab' && el.parentElement.hasAttribute(UUID)) {
      const tablist = el.parentElement
      return setOpen(tablist, el, JSON.parse(tablist.getAttribute(OPTIONS))) || event.preventDefault() // Also prevent links
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
  return Math.max(0, tabs.indexOf(tabs.filter(tab => tab.getAttribute('aria-selected') === true)))
}

/**
 * @param {Element} tablist
 * @param {Number|String|Element} open
 * @param {Options} [options]
 */
function setOpen (tablist, open, options = {}) { // open can be Number, String or Element
  const next = tablist.nextElementSibling ? tablist.nextElementSibling.children : []
  const tabs = queryAll(tablist.children).filter((tab) => tab.nodeName === 'A' || tab.nodeName === 'BUTTON')
  const panels = tabs.map((tab, i) => document.getElementById(tab.getAttribute('aria-controls')) || next[i])
  const isOpen = getOpenTabIndex(tabs)
  const willOpen = tabs.reduce((acc, tab, i) => (i === open || tab === open || tab.id === open) ? i : acc, isOpen)
  const isUpdate = isOpen === willOpen || dispatchEvent(tablist, 'tabs.toggle', {isOpen, willOpen, tabs, panels})
  const nextOpen = isUpdate ? willOpen : getOpenTabIndex(tabs) // dispatchEvent can change attributes, so check getOpenPanel again

  tabs.forEach((tab, index) => {
    const selected = index === nextOpen
    const panel = panels[index]

    // Set correct ids, if they are not already defined
    panel.id = panel.id || getUUID()
    tab.id = tab.id || getUUID()
    tab.setAttribute('aria-controls', panel.id)

    if (!options.dangerouslyPromiseToHandleTabs) {
      setTabAttributes(tab, selected)
    }
    if (!options.dangerouslyPromiseToHandlePanels) {
      setPanelAttributes(panel, tab, selected)
    }
  })

  return nextOpen
}
