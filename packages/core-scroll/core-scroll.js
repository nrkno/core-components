import {name, version} from './package.json'
import {IS_BROWSER, addEvent, dispatchEvent, throttle, queryAll} from '../utils'

const DRAG = {}
const ATTR = 'data-core-scroll'
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const MOVE = {up: {y: -1, prop: 'top'}, down: {y: 1, prop: 'bottom'}, left: {x: -1}, right: {x: 1}}
const FRICTION = 0.95
const VELOCITY = 20

// https://css-tricks.com/introduction-reduced-motion-media-query/
const requestJump = IS_BROWSER && window.matchMedia && window.matchMedia('(prefers-reduced-motion)').matches
const requestAnim = !IS_BROWSER || window.requestAnimationFrame || window.setTimeout

export default function scroll (elements, move = '') {
  const options = typeof move === 'object' ? move : {move}

  return queryAll(elements).map((target) => {
    target.setAttribute(UUID, '')
    target.style.webkitOverflowScrolling = 'touch' // Momentum scoll on iPhone
    target.style.overflow = 'scroll' // Ensure visible scrollbars
    target.style.cursor = '-webkit-grab'
    target.style.cursor = 'grab'

    if (options.hideScrollbars) hideScrollbars(target)
    scrollTo(target, parseCoordinates(target, options))

    return target
  })
}

addEvent(UUID, 'mousedown', onMousedown)
addEvent(UUID, 'scroll', throttle(onScroll, 500), true) // useCapture to catch event without bubbling
addEvent(UUID, 'wheel', () => (DRAG.animate = false), {passive: true}) // Stop animation on wheel scroll
addEvent(UUID, 'click', onClick)

function onMousedown (event) {
  for (let el = event.target; el; el = el.parentElement) {
    if (!event.defaultPrevented && el.hasAttribute(UUID)) {
      event.preventDefault() // Prevent text selection and enable nesting

      DRAG.pageX = event.pageX
      DRAG.pageY = event.pageY
      DRAG.scrollX = el.scrollLeft
      DRAG.scrollY = el.scrollTop
      DRAG.animate = DRAG.diffX = DRAG.diffY = 0 // Reset
      DRAG.target = el

      document.body.style.cursor = el.style.cursor = '-webkit-grabbing'
      document.body.style.cursor = el.style.cursor = 'grabbing'
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)
    }
  }
}

function onMousemove (event) {
  DRAG.diffX = DRAG.pageX - (DRAG.pageX = event.pageX)
  DRAG.diffY = DRAG.pageY - (DRAG.pageY = event.pageY)
  DRAG.target.scrollLeft = DRAG.scrollX += DRAG.diffX
  DRAG.target.scrollTop = DRAG.scrollY += DRAG.diffY
}

function onMouseup (event) {
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('mouseup', onMouseup)
  document.body.style.cursor = ''
  scroll(DRAG.target, {
    x: DRAG.scrollX + DRAG.diffX * VELOCITY,
    y: DRAG.scrollY + DRAG.diffY * VELOCITY
  })
}

function onScroll ({target}) {
  if (!target.hasAttribute || !target.hasAttribute(UUID)) return // target can be document
  const pos = {left: target.scrollLeft, up: target.scrollTop}
  pos.right = target.scrollWidth - target.clientWidth - pos.left
  pos.down = target.scrollHeight - target.clientHeight - pos.up

  queryAll(`[${ATTR}]`).forEach((button) => {
    const isTarget = document.getElementById(button.getAttribute(ATTR)) === target
    if (isTarget) button.disabled = !pos[button.value]
  })
  dispatchEvent(target, 'scroll.throttled', pos)
}

function onClick (event) {
  for (let el = event.target; el; el = el.parentElement) {
    const target = document.getElementById(el.getAttribute(ATTR))
    if (target) return scroll(target, el.value)
  }
}

function hideScrollbars (target) {
  const scrollbarWidth = target.offsetWidth - target.clientWidth
  const scrollbarHeight = target.offsetHeight - target.clientHeight
  const parentHeight = target.parentElement.offsetHeight

  target.style.height = `${parentHeight + scrollbarHeight}px` // Consistent height as scrollbars are subtracted
  target.style.marginRight = `-${scrollbarWidth}px`
  target.style.marginBottom = `-${scrollbarHeight}px`
}

function scrollTo (target, {x, y}) {
  // Giving the animation an ID works around IE timeout issues
  const uuid = DRAG.animate = Math.floor(Date.now() * Math.random()).toString(16)
  const endX = Math.max(0, Math.min(x, target.scrollWidth - target.clientWidth))
  const endY = Math.max(0, Math.min(y, target.scrollHeight - target.clientHeight))
  let moveX = requestJump ? 1 : endX - target.scrollLeft
  let moveY = requestJump ? 1 : endY - target.scrollTop

  const move = () => {
    if (DRAG.animate === uuid && (Math.round(moveX) || Math.round(moveY))) {
      target.scrollLeft = endX - Math.round(moveX *= FRICTION)
      target.scrollTop = endY - Math.round(moveY *= FRICTION)
      requestAnim(move)
    } else onScroll({target}) // Update state
  }
  move()
}

function parseCoordinates (target, options) {
  const move = MOVE[options.move]
  if (typeof options.x !== 'number') options.x = target.scrollLeft
  if (typeof options.y !== 'number') options.y = target.scrollTop
  if (move) {
    const axis = move.x ? 'x' : 'y'
    const size = move.x ? 'width' : 'height'
    const start = move.x ? 'left' : 'top'
    const bound = target.getBoundingClientRect()
    const scroll = target[axis === 'x' ? 'scrollLeft' : 'scrollTop']

    queryAll(target.children).every((el) => { // Use .every as this loop stops on return false
      const rect = el.getBoundingClientRect()
      options[axis] = rect[start] - bound[start] + scroll
      return rect[move.prop || options.move] < bound[start] + bound[size] * move[axis]
    })
  }
  return options
}
