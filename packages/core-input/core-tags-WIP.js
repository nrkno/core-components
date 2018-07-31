import {name, version} from './package.json'
import {addEvent, dispatchEvent, requestAnimFrame, queryAll} from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const ATTR = 'data-core-tags'
const KEYS = {BACKSPACE: 8, ENTER: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40}
const LIVE = document.createElement('span')
LIVE.style.cssText = 'position:fixed;clip:rect(0,0,0,0)'
LIVE.setAttribute('aria-live', 'polite')

// TODO: Submit data and name?
// TODO: Hide duplicates?
// TODO: Autoshow coreInput?
// TODO: Languages?
// TODO: Custom markup?
// TODO: readonly

export default function tags (elements, content) {
  const options = typeof content === 'object' ? content : {content}
  document.body.appendChild(LIVE)

  return queryAll(elements).map((el) => {
    const list = el.nextElementSibling
    const uuid = el.getAttribute(UUID) || Math.round(Date.now() * Math.random()).toString(36)

    el.setAttribute(UUID, uuid)
    queryAll(options.input).forEach((el) => el.setAttribute(ATTR, uuid)) // Setup relation tags/input
    queryAll('button', list).forEach(setupTag)
    return el
  })
}

addEvent(UUID, 'input.select', ({target, detail}) => {
  const el = getElementFromInput(target)
  if (el) addTag(el, detail.value, event.preventDefault())
})

addEvent(UUID, 'click', (event) => {
  for (let el = event.target, tag, del; el; el = el.parentElement) {
    if (!tag && el.nodeName === 'BUTTON') tag = el
    if (tag && el.hasAttribute(UUID)) {
      const isEdit = el.nodeName !== 'DEL'
      removeTag(el, tag, isEdit)
      if (isEdit) {
        getInputFromElement(el).forEach((el) => {
          el.value = tag.value
          el.focus()
        })
      }
    }
  }
})

addEvent(UUID, 'keydown', (event) => {
  const {target, keyCode} = event
  const el = getElementFromInput(target) || getClosestElement(target)

  if (el) {
    const end = target.selectionEnd
    const max = target.nodeName === 'INPUT' ? target.value.length : undefined
    const input = getInputFromElement(el)
    const focus = queryAll('button', el).concat(input)
    const index = focus.indexOf(target)
    let item = false

    if (keyCode === KEYS.ENTER && target.nodeName === 'INPUT') addTag(el, target.value)
    else if (target.selectionStart !== end) return
    else if (keyCode === KEYS.RIGHT && end === max) item = focus[index + 1] || focus[0]
    else if (keyCode === KEYS.DOWN || keyCode === KEYS.UP) item = null
    else if (keyCode === KEYS.LEFT && !end) item = focus[index - 1] || focus.pop()
    else if (keyCode === KEYS.BACKSPACE && target.nodeName === 'BUTTON') {
      removeTag(el, target)
      item = focus[index - 1] || focus.pop()
    }

    if (item !== false) event.preventDefault()
    if (item) item.focus()
    return
  }
})

function setupTag (btn) {
  if (btn.nodeName !== 'BUTTON') return
  const del = btn.querySelector('del') || btn.appendChild(document.createElement('del'))
  del.setAttribute('aria-hidden', true)
  del.tabindex = -1
  btn.value = btn.value || btn.textContent
  btn.title = `Trykk for å redigere ${btn.textContent}`
  // btn.name = 'my-tags'
  btn.type = 'button'
}

function addTag (el, value) {
  if (!value) return
  const li = document.createElement('li')
  const tag = li.appendChild(document.createElement('button'))
  tag.value = tag.textContent = value
  setupTag(tag)
  el.appendChild(li)
  getInputFromElement(el).forEach((input) => {
    LIVE.textContent = `${tag.textContent} lagt til`
    const span = document.createElement('span')
    input.parentElement.replaceChild(span, input).value = ''
    span.parentElement.replaceChild(input, span)
    requestAnimFrame(() => input.focus())
  })
}

function removeTag (element, tag, isEdit) {
  queryAll(element.children).forEach((li) => {
    if (li.contains(tag)) {
      element.removeChild(li)
      if (!isEdit) LIVE.textContent = `${tag.textContent} fjernet`
    }
  })
}

function getClosestElement (button) {
  for (let el = button; el; el = el.parentElement) if (el.hasAttribute(UUID)) return el
}

function getElementFromInput (input) {
  const uuid = input.getAttribute(ATTR)
  return uuid && document.querySelector(`[${UUID}="${uuid}"]`)
}

function getInputFromElement (element) {
  return queryAll(`[${ATTR}="${element.getAttribute(UUID)}"]`)
}
