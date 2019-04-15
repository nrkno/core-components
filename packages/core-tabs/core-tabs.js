import { name, version } from './package.json'
import {
  IS_ANDROID,
  dispatchEvent,
  getUUID,
  queryAll,
  closest
} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ARIA = IS_ANDROID ? 'data' : 'aria' // Andriod has a bug and reads only label instead of content
const KEYS = { SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }

export default class CoreToggle extends HTMLElement {

  connectedCallback () {
    this.setAttribute('role', 'tablist')
    this.addEventListener('click', this)
    this.addEventListener('keydown', this)
    setTimeout(() => (this.tab = this.tab)) // setup selected tab after children is parsed
  }

  disconnectedCallback() {
    this.removeEventListener('click', this)
    this.removeEventListener('keydown', this)
  }

  handleEvent (event) {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return
    if (event.type === 'click') this.tab = closest(event.target, '[role="tab"]')
    if (event.type === 'keydown') {
      let tab = event.target
      const key = event.keyCode
      const tabs = this.tabs
      const open = tabs.indexOf(tab)

      if (key === KEYS.SPACE) tab.click() // Forward action to click event
      else if (key === KEYS.DOWN || key === KEYS.RIGHT) tab = tabs[open + 1] || tabs[0]
      else if (key === KEYS.UP || key === KEYS.LEFT) tab = tabs[open - 1] || tabs.pop()
      else if (key === KEYS.END) tab = tabs.pop()
      else if (key === KEYS.HOME) tab = tabs[0]
      else return // Do not hijack other keys

      event.preventDefault()
      tab.focus()
    }
  }

  get tab () {
    return this.tabs[this.panels.indexOf(this.panel)] || this.tabs[0]
  }
  set tab (value) {
    if (!value) return
    const panels = this.panels
    const prevIndex = this.tabs.indexOf(this.tab)
    const nextIndex = this.tabs.reduce((acc, tab, i) => {
      return (i === value || tab === value || tab.id === value) ? i : acc
    }, this.tab)

    this.tabs.forEach((tab, index) => {
      const panel = panels[index]
      const openTab = index === nextIndex
      const openPanel = panel === panels[nextIndex]

      tab.setAttribute('role', 'tab')
      tab.setAttribute('tabindex', Number(openTab) - 1)
      tab.setAttribute('aria-selected', openTab)
      tab.setAttribute('aria-controls', panel.id = panel.id || getUUID())
      panel.setAttribute(`${ARIA}-labelledby`, tab.id = tab.id || getUUID())
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('tabindex', '0')
      panel.hidden = !openPanel
    })

    if (prevIndex !== nextIndex) dispatchEvent(this, 'core-tabs.toggle')
  }

  get tabs () { return queryAll(this.children) }
  get panel () { return this.panels.filter((panel) => !panel.hidden)[0] }
  get panels () {
    let next = this
    return this.tabs.map((tab) => {
      next = next.nextElementSibling || next
      return document.getElementById(tab.getAttribute('aria-controls')) || next
    })
  }
}
