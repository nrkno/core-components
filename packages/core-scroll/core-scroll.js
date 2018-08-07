import {name, version} from './package.json'
import {IS_BROWSER, addEvent, dispatchEvent, requestAnimFrame, throttle, queryAll} from '../utils'

const DRAG = {}
const ATTR = 'data-core-scroll'
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const MOVE = {up: {y: -1, prop: 'top'}, down: {y: 1, prop: 'bottom'}, left: {x: -1}, right: {x: 1}}
const FRICTION = 0.8
const VELOCITY = 20

// https://css-tricks.com/introduction-reduced-motion-media-query/
const requestJump = IS_BROWSER && window.matchMedia && window.matchMedia('(prefers-reduced-motion)').matches

export default function scroll (elements, move = '') {
  const options = typeof move === 'object' ? move : {move}
  const isChange = 'x' in options || 'y' in options || options.move

  return queryAll(elements).map((target) => {
    if (!target.hasAttribute(UUID)) { // Reduce read / write operations
      target.setAttribute(UUID, options.friction || '')
      target.style.overflow = 'scroll' // Ensure visible scrollbars
      target.style.willChange = 'scroll-position' // Enhance performace
      target.style.webkitOverflowScrolling = 'touch' // Momentum scoll on iOS

      // Must be after setting overflow scroll
      const scrollbarWidth = target.offsetWidth - target.clientWidth + 1 // Plus one fixes safari pixelbug
      const scrollbarHeight = target.offsetHeight - target.clientHeight + 1 // Plus one fixes safari pixelbug

      target.style.maxHeight = `calc(100% + ${scrollbarHeight}px)` // Consistent height
      target.style.marginRight = `-${scrollbarWidth}px`
      target.style.marginBottom = `-${scrollbarHeight}px`
    }
    if (isChange) scrollTo(target, parsePoint(target, options))
    else onChange(target) // Updates button states
    return target
  })
}

addEvent(UUID, 'mousedown', onMousedown)
addEvent(UUID, 'resize', throttle(onChange, 500)) // Update button states on resize
addEvent(UUID, 'scroll', throttle(onChange, 500), true) // useCapture to catch event without bubbling
addEvent(UUID, 'wheel', () => (DRAG.animate = false), {passive: true}) // Stop animation on wheel scroll
addEvent(UUID, 'load', onChange) // Update state when we are sure all CSS is loaded
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
  DRAG.target.style.pointerEvents = 'none' // Prevent links when we know there has been movement
}

function onMouseup (event) {
  const isMomentum = DRAG.diffX || DRAG.diffY // Click-drag-scrollbar will not create momentum
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('mouseup', onMouseup)
  document.body.style.cursor = ''
  onChange(DRAG.target)

  if (isMomentum) {
    scrollTo(DRAG.target, {
      x: DRAG.scrollX + DRAG.diffX * VELOCITY,
      y: DRAG.scrollY + DRAG.diffY * VELOCITY
    })
  }
  DRAG.target.style.pointerEvents = '' // Allow events again
  DRAG.target = null // Prevent memory leak
}

function onChange (event) {
  const target = event.target || event
  if (event.type === 'resize' || event.type === 'load') return queryAll(`[${UUID}]`).forEach(onChange) // Update all
  if (!target.hasAttribute || !target.hasAttribute(UUID)) return // target can be document

  const detail = {left: target.scrollLeft, up: target.scrollTop}
  detail.right = target.scrollWidth - target.clientWidth - detail.left
  detail.down = target.scrollHeight - target.clientHeight - detail.up
  const cursor = (detail.left || detail.right || detail.up || detail.down) ? 'grab' : ''

  dispatchEvent(target, 'scroll.change', detail)

  if (!event.type) { // Do not change cursor while dragging
    target.style.cursor = `-webkit-${cursor}`
    target.style.cursor = cursor
  }

  if (target.id) {
    queryAll(`[${ATTR}]`).forEach((el) => {
      if (el.getAttribute(ATTR) === target.id) el.disabled = !detail[el.value]
    })
  }
}

function onClick (event) {
  if (event.defaultPrevented) return
  for (let el = event.target; el; el = el.parentElement) {
    const target = document.getElementById(el.getAttribute(ATTR))
    if (target && dispatchEvent(target, 'scroll.click', {move: el.value})) {
      return scroll(target, el.value)
    }
  }
}

function scrollTo (target, {x, y}) {
  // Giving the animation an ID to workaround IE timeout issues
  const friction = Math.min(0.99, target.getAttribute(UUID)) || FRICTION // Avoid friction 1 (infinite)
  const uuid = DRAG.animate = Math.floor(Date.now() * Math.random()).toString(16)
  const endX = Math.max(0, Math.min(x, target.scrollWidth - target.clientWidth))
  const endY = Math.max(0, Math.min(y, target.scrollHeight - target.clientHeight))
  let moveX = requestJump ? 1 : endX - target.scrollLeft
  let moveY = requestJump ? 1 : endY - target.scrollTop

  const move = () => {
    if (DRAG.animate === uuid && (Math.round(moveX) || Math.round(moveY))) {
      target.scrollLeft = endX - Math.round(moveX *= friction)
      target.scrollTop = endY - Math.round(moveY *= friction)
      requestAnimFrame(move)
    }
  }
  move()
}

function parsePoint (target, {x, y, move}) {
  const point = {x, y, move: MOVE[move]}
  // {
  //   to: 'left|top|right|bottom|Element'
  //   x: 'left|top|right|bottom|px'
  //   y: 'left|top|right|bottom|px'
  // }
  if (typeof point.x !== 'number') point.x = target.scrollLeft
  if (typeof point.y !== 'number') point.y = target.scrollTop
  if (point.move) {
    const axis = point.move.x ? 'x' : 'y'
    const start = point.move.x ? 'left' : 'top'
    const bounds = target.getBoundingClientRect()
    const scroll = bounds[start] - target[point.move.x ? 'scrollLeft' : 'scrollTop']
    const edge = bounds[start] + bounds[point.move.x ? 'width' : 'height'] * point.move[axis]

    queryAll(target.children).every((el) => { // Use .every as this loop stops on return false
      const rect = el.getBoundingClientRect()
      const marg = el.ownerDocument.defaultView.getComputedStyle(el)[`margin-${start}`]

      point[axis] = rect[start] - parseInt(marg, 10) - scroll // Update point to child axis coordinate
      return rect[point.move.prop || move] < edge
    })
  }
  return point
}
