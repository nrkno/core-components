/* eslint no-self-assign: 0 */

import { closest, dispatchEvent, getUUID, IS_ANDROID, queryAll, toggleAttribute } from '../utils'

/** @typedef {HTMLButtonElement | HTMLAnchorElement} TabElement */

const FROM = IS_ANDROID ? 'data-labelledby' : 'aria-labelledby' // Android has a bug and reads only label instead of content
const KEYS = { SPACE: 32, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }

export default class CoreTabs extends HTMLElement {
  static get observedAttributes () { return ['tab'] }

  connectedCallback () {
    this.setAttribute('role', 'tablist')
    this.addEventListener('click', this)
    this.addEventListener('keydown', this)
    if (!this._childObserver) this._childObserver = window.MutationObserver && new window.MutationObserver(augmentDOM.bind(null, this))
    if (this._childObserver) this._childObserver.observe(this, { childList: true })
    setTimeout(() => augmentDOM(this))
  }

  disconnectedCallback () {
    if (this._childObserver) this._childObserver.disconnect()
    this.removeEventListener('click', this)
    this.removeEventListener('keydown', this)
    this._childObserver = null
  }

  attributeChangedCallback (attr, prev, next) {
    if (attr === 'tab' && prev !== next) {
      this.tab = next
    }
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

  get panels () { return this.tabs.map(getPanelFromTab) }

  get panel () { return getPanelFromTab(this.tab) }

  /**
   * @returns {[TabElement]}
   */
  get tabs () { return queryAll('button,a', this) }

  /**
   * @returns {TabElement}
   */
  get tab () {
    const tabAttr = this.getAttribute('tab')
    const allTabs = this.tabs

    // First tab with aria-selected="true"
    let tab = allTabs.filter(tab => tab.getAttribute('aria-selected') === 'true')[0]

    // No tab is set, check for match in index or id
    if (!tab) tab = allTabs[Number(tabAttr || NaN)] || document.getElementById(tabAttr)

    // No tab is set, check for first tab with visible panel
    if (!tab) {
      tab = allTabs.filter(tab => {
        const tabPanel = getPanelFromTab(tab)
        return tabPanel && !tabPanel.hasAttribute('hidden')
      })[0]
    }

    // Fallback to first tab
    return tab || allTabs[0]
  }

  /**
   * @param {string | number | TabElement} value
   * @returns {void}
   */
  set tab (value) {
    if (!value && value !== 0) return
    const allTabs = this.tabs
    const prevTab = this.tab
    const nextTab = allTabs.filter((tab, i) => {
      return i === Number(value) || tab === value || tab.id === value
    })[0] || prevTab
    const nextPanel = getPanelFromTab(nextTab)

    allTabs.forEach((tab) => {
      const tabPanel = getPanelFromTab(tab)
      const isOpenTab = tab === nextTab

      tab.setAttribute('aria-selected', isOpenTab)
      tab.setAttribute('tabindex', Number(isOpenTab) - 1)

      // Core-tabs does not own the panels and will only update them if found
      if (tabPanel) {
        toggleAttribute(tabPanel, 'hidden', tabPanel !== nextPanel)
        if (isOpenTab) tabPanel.setAttribute(FROM, tab.id)
      }
    })

    this.setAttribute('tab', allTabs.indexOf(nextTab))

    // Dispatch toggle-event when the referenced tab is changed, and not just updating tab-attribute to index from id
    if (prevTab !== nextTab) {
      dispatchEvent(this, 'tabs.toggle')
    }
  }
}

/**
 * Get matching panel for tab through aria-controls
 * NB! Assumes that augmentDOM has run successfully
 * @param {TabElement} tab
 * @returns {HTMLElement | null} panel
 */
function getPanelFromTab (tab) {
  return document.getElementById(tab.getAttribute('data-for') || tab.getAttribute('for') || tab.getAttribute('aria-controls'))
}

/**
 * Augments the DOM surrounding the CoreTabs element with the following
 *  - Assigns a panel to each tab with aria-controls
 *  - Handles accessibility concerns through role and tabindices
 *  - Finally assigns tab-value to CoreTabs, running both getter and setter in the process for additional attribute setup
 * @param {CoreTabs} self CoreTabs element
 * @returns {void}
 */
function augmentDOM (self) {
  if (!self.parentNode) return // Abort if removed from DOM

  // Store tabPanel to reference in case no further siblings are found
  let tabPanel
  self.tabs.forEach((tab) => {
    tabPanel = getPanelFromTab(tab) || (tabPanel || self).nextElementSibling || tabPanel
    tab.id = tab.id || getUUID()
    tab.setAttribute('role', 'tab')

    if (tabPanel) {
      tab.setAttribute('aria-controls', tabPanel.id = tabPanel.id || getUUID())
      tabPanel.setAttribute('role', 'tabpanel')
      tabPanel.setAttribute('tabindex', '0')
    }
  })
  // Setup tab-specific attributes after above iterator has established matching panels and set necessary attributes
  self.tab = self.tab
}
