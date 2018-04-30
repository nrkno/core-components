import {name, version} from './package.json'
import {IS_BROWSER, addEvent, queryAll} from '../utils'

const ATTR = `data-core-scroll`
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const TICK = !IS_BROWSER || window.requestAnimationFrame || window.setTimeout
const DRAG = {friction: 0.95}

// https://css-tricks.com/introducing-css-scroll-snap-points/ align, padding
export default function scroll (elements, options = {}) {
  return queryAll(elements).forEach((element) => {
    element.setAttribute(UUID, JSON.stringify(options))
    element.style.webkitOverflowScrolling = 'touch' // Momentum scoll on iPhone
    element.style.overflow = 'auto' // Ensure scrollability
    return element
  })
}

addEvent(UUID, 'mousedown', onMousedown)
addEvent(UUID, 'wheel', onWheel, {passive: true})
addEvent(UUID, 'click', onClick)

function animate () {
  if (DRAG.isDragging) {
    DRAG.velocityX = DRAG.prevX - (DRAG.prevX = DRAG.nextX)
    DRAG.velocityY = DRAG.prevY - (DRAG.prevY = DRAG.nextY)
  } else {
    DRAG.velocityX *= DRAG.friction
    DRAG.velocityY *= DRAG.friction
  }

  const x = Math.round(Math.max(0, Math.min(DRAG.scrollX + DRAG.velocityX, DRAG.maxX)))
  const y = Math.round(Math.max(0, Math.min(DRAG.scrollY + DRAG.velocityY, DRAG.maxY)))
  const change = DRAG.isDragging || x !== DRAG.scrollX || y !== DRAG.scrollY

  if (change) {
    DRAG.node.scrollLeft = DRAG.scrollX = x
    DRAG.node.scrollTop = DRAG.scrollY = y
    TICK(animate)
  }
}

function onMousedown (event) {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      event.preventDefault() // Prevent text selection

      DRAG.node = el
      DRAG.maxX = el.scrollWidth - el.clientWidth
      DRAG.maxY = el.scrollHeight - el.clientHeight
      DRAG.prevX = DRAG.nextX = event.pageX
      DRAG.prevY = DRAG.nextY = event.pageY
      DRAG.scrollX = el.scrollLeft
      DRAG.scrollY = el.scrollTop
      DRAG.isDragging = true

      document.body.style.cursor = '-webkit-grabbing'
      document.body.style.cursor = 'grabbing'
      window.addEventListener('mousemove', onMousemove, false)
      window.addEventListener('mouseup', onMouseup, false)
      animate()
    }
  }
}

function onMouseup () {
  DRAG.isDragging = false
  document.body.style.cursor = ''
  window.removeEventListener('mousemove', onMousemove, false)
  window.removeEventListener('mouseup', onMouseup, false)
}

function onMousemove (event) {
  DRAG.nextX = event.pageX
  DRAG.nextY = event.pageY
}

function onWheel () {
  DRAG.velocityX = 0
  DRAG.velocityY = 0
}

function onClick (event) {
  for (let el = event.target; el; el = el.parentElement) {
    const attr = el.getAttribute(ATTR)
    el = attr && document.querySelector(attr.split('@')[0])

    if (el) {
      DRAG.node = el
      DRAG.maxX = el.scrollWidth - el.clientWidth
      DRAG.maxY = el.scrollHeight - el.clientHeight
      DRAG.prevX = DRAG.nextX = 0
      DRAG.prevY = DRAG.nextY = 0
      DRAG.velocityX = 10
      DRAG.velocityY = 0
      DRAG.scrollX = el.scrollLeft
      DRAG.scrollY = el.scrollTop
      console.log(el, DRAG)
      tween(el.scrollLeft, 200, 500)
    }
    break
  }
}

/**
 * Constructor for the tween
 * @param {number} startValue What value does the tween start at
 * @param {number} distance How far does the tween's value advance from the startValue?
 * @param {number} duration Amount of time in milliseconds the tween runs for
 * @param {string} animationType What easing function should be used from the easing library?
 * See _easingLibrary for a list of potential easing equations.
 * @param {string} loop Can be left blank, set to loop, or repeat. Loop repeats repeats the animation
 * in reverse every time. Repeat will run the original tween from the beginning
 * @returns {self}
 */
const TWEEN = {}
function tween (startValue, distance, duration) {
  TWEEN.startTime = Date.now()
  TWEEN.startValue = startValue
  TWEEN.distance = distance
  TWEEN.duration = duration
  update()
}

function update () {
  const expired = TWEEN.startTime + TWEEN.duration < Date.now()
  let total

  if (expired) total = TWEEN.startValue + TWEEN.distance
  else {
    total = linear(Date.now() - TWEEN.startTime, TWEEN.startValue, TWEEN.distance, TWEEN.duration)
    TICK(update)
  }

  console.log(total)

  return total
}

/**
 * @param {number} t Current time in millseconds
 * @param {number} b Start value
 * @param {number} c Distance traveled relative to the start value
 * @param {number} d Duration in milliseconds
 */
function linear (t, b, c, d) {
  t /= d
  return -c * t * (t - 2) + b
}

/**
* Set the tween's properties for the beginning value, distance, duration, and animation type
* @param {number} startValue What value does the tween start at
* @param {number} distance How far does the tween's value advance from the startValue?
* @param {number} duration Amount of time in milliseconds the tween runs for
* @param {string} animationType What easing function should be used from the easing library?
* @param {string} loop Can be left blank, set to loop, or repeat. Loop repeats repeats the animation
* in reverse every time. Repeat will run the original tween from the beginning
* @returns {self}
window.Tween.prototype.set = function (startValue, distance, duration, animationType, loop) {
  this.startValue = typeof startValue === 'number' ? startValue : this.startValue
  this.distance = typeof distance === 'number' ? distance : this.distance
  this.duration = typeof duration === 'number' ? duration : this.duration
  return this
}
*/

/**
* Resets the tween and runs it relative to the current time
* @returns {self}
window.Tween.prototype.reset = function () {
  this.startTime = Date.now()
  return this
}
*/
