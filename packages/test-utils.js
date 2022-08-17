export function prop (selector, name) {
  return browser.executeScript((selector, name) => {
    return String((document.querySelector(selector) || {})[name])
  }, selector, name)
}

export function attr (selector, name) {
  return browser.executeScript((selector, name) => {
    return String(document.querySelector(selector).getAttribute(name))
  }, selector, name)
}

export function getElementFromShadowRoot (shadowRootId, selector) {
  return browser.executeScript((shadowRootId, selector) => {
    const rootContainer = document.getElementById(shadowRootId)
    return rootContainer.shadowRoot.querySelector(selector)
  }, shadowRootId, selector)
}
