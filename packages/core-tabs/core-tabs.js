import {name, version} from './package.json'
import {queryAll, addEvent, getUUID} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {ENTER: 13, SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})
const ARIA = 'aria' // TODO IS_ANDROID, IS_ANDROID ? 'data' : Test Andriod

export default function tabs (tablists, open = {}) { // Open can be node, id or index or nothing
  const options = open.constructor === Object ? open : {open}

  return queryAll(tablists).map((tablist) => {
    const panels = tablist.nextElementSibling.children
    let open = options.open || false // Scoped so each tablist can have one open tab

    tablist.setAttribute(UUID, '')
    tablist.setAttribute('role', 'tablist')

    queryAll(tablist.children).forEach((tab, index) => {
      const panel = panels[index]
      const selected = index === open || tab.id === open ||
        (open.nodeName && tab.contains(open)) || // Open Element
        !(open || panel.hasAttribute('hidden')) // Open not set, read from DOM

      if (selected) open = true // Only one tab can be open at the time

      tab.setAttribute('role', 'tab')
      tab.setAttribute('tabindex', selected - 1) // TODO go though all and dispatchEvent before change
      tab.setAttribute('aria-selected', selected)
      tab.setAttribute('aria-controls', panel.id = panel.id || getUUID())
      panel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', 0)
      panel[selected ? 'removeAttribute' : 'setAttribute']('hidden', '')

      queryAll('a,button', tab).forEach((el) => { /* Hide all sub children */
        el.setAttribute('role', 'presentation')
        el.setAttribute('tabindex', -1)
      })
    })

    return tablist
  })
}

addEvent(UUID, 'click', (event) => {
  const target = closest(event.target)
  if (target) tabs(target.tablist, target.tab)
})

addEvent(UUID, 'keydown', (event) => {
  const target = CODE[event.keyCode] && closest(event.target)

  if (target) {
    const tabs = queryAll('[role="tab"]', target.tablist)
    const open = tabs.indexOf(target.tab)
    const key = event.keyCode
    let item = target.tab

    if (key === KEYS.SPACE || key === KEYS.ENTER) item.click()
    else if (key === KEYS.DOWN || key === KEYS.RIGHT) item = tabs[open + 1] || tabs[0]
    else if (key === KEYS.UP || key === KEYS.LEFT) item = tabs[open - 1] || tabs.pop()
    else if (key === KEYS.END) item = tabs.pop()
    else if (key === KEYS.HOME) item = tabs[0]

    event.preventDefault()
    if (item) item.focus()
  }
})

function closest (element) {
  for (let el = element, tab; el; el = el.parentElement) {
    if (tab && el.hasAttribute(UUID)) return {tablist: el, tab}
    else if (el.getAttribute('role') === 'tab') tab = el
  }
}
