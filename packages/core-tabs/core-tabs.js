import {name, version} from './package.json'
import {IS_ANDROID, queryAll, addEvent, getUUID} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const KEYS = {SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}
const CODE = Object.keys(KEYS).reduce((all, key) => (all[KEYS[key]] = key) && all, {})
const ARIA = IS_ANDROID ? 'data' : 'aria' // TODO Test Andriod

export default function tabs (tablists, open = {}) { // Open can be node, id or index or nothing
  const options = open.constructor === Object ? open : {open}

  return queryAll(tablists).map((tablist) => {
    let open = options.open || false // Scoped so each tablist can have one open tab
    tablist.setAttribute(UUID, '')
    tablist.setAttribute('role', 'tablist')

    queryAll('a,button', tablist).forEach((tab, index) => {
      const tabpanel = tablist.nextElementSibling.children[index]
      const selected = index === open || tab.id === open ||
        (open.nodeName && tab.contains(open)) || // Open Element
        !(open || tabpanel.hasAttribute('hidden')) // Open not set, read from DOM

      if (selected) open = true // Only one tab can be open at the time

      tab.setAttribute('role', 'tab')
      tab.setAttribute('tabindex', selected - 1)
      tab.setAttribute('aria-selected', selected)
      tab.setAttribute('aria-controls', tabpanel.id = tabpanel.id || getUUID())
      tabpanel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
      tabpanel.setAttribute('role', 'tabpanel')
      tabpanel.setAttribute('tabindex', 0)
      tabpanel[selected ? 'removeAttribute' : 'setAttribute']('hidden', '')
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

    if (key === KEYS.DOWN || key === KEYS.RIGHT) item = tabs[open + 1] || tabs[0]
    else if (key === KEYS.UP || key === KEYS.LEFT) item = tabs[open - 1] || tabs.pop()
    else if (key === KEYS.END) item = tabs.pop()
    else if (key === KEYS.HOME) item = tabs[0]
    else if (key === KEYS.SPACE) item.click()

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
