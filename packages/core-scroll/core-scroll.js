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
  const isChange = 'x' in options || 'y' in options || options.move

  return queryAll(elements).map((target) => {
    if (!target.hasAttribute(UUID)) { // Reduce read / write operations
      const scrollbarWidth = target.offsetWidth - target.clientWidth
      const scrollbarHeight = target.offsetHeight - target.clientHeight

      target.setAttribute(UUID, '')
      target.style.overflow = 'scroll' // Ensure visible scrollbars
      target.style.willChange = 'scroll-position' // Enhance performace
      target.style.webkitOverflowScrolling = 'touch' // Momentum scoll on iOS
      target.style.maxHeight = `calc(100% + ${scrollbarHeight}px)` // Consistent height
      target.style.marginRight = `-${scrollbarWidth}px`
      target.style.marginBottom = `-${scrollbarHeight}px`
      setCursor(target, 'grab')
      onScroll({target}) // Update state
    }
    if (isChange) scrollTo(target, parsePoint(target, options))
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

      setCursor(el, 'grabbing')
      setCursor(document.body, 'grabbing')
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
  setCursor(document.body, '')
  setCursor(DRAG.target, 'grab')
  scrollTo(DRAG.target, {
    x: DRAG.scrollX + DRAG.diffX * VELOCITY,
    y: DRAG.scrollY + DRAG.diffY * VELOCITY
  })
}

function onScroll ({type, target}) {
  if (!target.hasAttribute || !target.hasAttribute(UUID)) return // target can be document
  const move = {left: target.scrollLeft > 0, up: target.scrollTop > 0}
  move.right = target.scrollLeft < target.scrollWidth - target.clientWidth
  move.down = target.scrollTop < target.scrollHeight - target.clientHeight

  queryAll(`[${ATTR}]`).forEach((button) => {
    const isTarget = document.getElementById(button.getAttribute(ATTR)) === target
    if (isTarget) button.disabled = !move[button.value]
  })
  if (type) dispatchEvent(target, 'scroll.change', move) // Only dispatch if derrived from native event
}

function onClick (event) {
  for (let el = event.target; el; el = el.parentElement) {
    const target = document.getElementById(el.getAttribute(ATTR))
    if (target) return scroll(target, el.value)
  }
}

function setCursor (el, cursor) {
  el.style.cursor = `-webkit-${cursor}`
  el.style.cursor = cursor
}

function scrollTo (target, {x, y}) {
  // Giving the animation an ID to workaround IE timeout issues
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
    }
  }
  move()
}

function parsePoint (target, {x, y, move}) {
  const point = {x, y, move: MOVE[move]}
  if (typeof point.x !== 'number') point.x = target.scrollLeft
  if (typeof point.y !== 'number') point.y = target.scrollTop
  if (point.move) {
    const axis = point.move.x ? 'x' : 'y'
    const size = point.move.x ? 'width' : 'height'
    const start = point.move.x ? 'left' : 'top'
    const bound = target.getBoundingClientRect()
    const scroll = target[axis === 'x' ? 'scrollLeft' : 'scrollTop']

    queryAll(target.children).every((el) => { // Use .every as this loop stops on return false
      const rect = el.getBoundingClientRect()
      point[axis] = rect[start] - bound[start] + scroll // Update point to child axis coordinate
      return rect[point.move.prop || move] < bound[start] + bound[size] * point.move[axis]
    })
  }
  return point
}
