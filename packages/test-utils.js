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
