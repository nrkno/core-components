import {name, version} from './package.json'
import {IS_BROWSER, addEvent, debounce, queryAll} from '../utils'

const DRAG = {}
const ATTR = 'data-core-scroll'
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const REDUCED_MOTION = IS_BROWSER && window.matchMedia && window.matchMedia('(prefers-reduced-motion)') // https://css-tricks.com/introduction-reduced-motion-media-query/
const requestAnimFrame = !IS_BROWSER || window.requestAnimationFrame || window.setTimeout

export default function scroll (elements, options = {}) {
  return queryAll(elements).map((element) => {
    element.setAttribute(UUID, '')
    element.style.overflow = 'scroll' // Ensure visible scrollbars
    element.style.webkitOverflowScrolling = 'touch' // Momentum scoll on iPhone

    if (options.hideScrollbars) {
      const barX = element.offsetWidth - element.clientWidth
      const barY = element.offsetHeight - element.clientHeight

      element.style.height = `${element.parentElement.offsetHeight + barY}px` // Consistent height
      element.style.marginRight = `-${barX}px`
      element.style.marginBottom = `-${barY}px`
    }

    if (options.hasOwnProperty('x') || options.hasOwnProperty('y')) {
      const to = getScrollEnd(element, options.x, options.y)
      smoothScroll(element, to.x, to.y)
    }

    return element
  })
}

addEvent(UUID, 'mousedown', onMousedown)
addEvent(UUID, 'scroll', debounce(onScroll, 100), true) // useCapture to catch event without bubbling
addEvent(UUID, 'wheel', () => (DRAG.move = false), {passive: true}) // Stop animation on wheel scroll
addEvent(UUID, 'click', onClick)

function onMousedown (event) {
  for (let el = event.target; el; el = el.parentElement) {
    if (el.hasAttribute(UUID)) {
      event.preventDefault() // Prevent text selection

      DRAG.move = DRAG.diffX = DRAG.diffY = 0
      DRAG.pageX = event.pageX
      DRAG.pageY = event.pageY
      DRAG.scrollX = el.scrollLeft
      DRAG.scrollY = el.scrollTop
      DRAG.node = el

      document.body.style.cursor = '-webkit-grabbing'
      document.body.style.cursor = 'grabbing'
      document.addEventListener('mousemove', onMousemove)
      document.addEventListener('mouseup', onMouseup)
    }
  }
}

function onMousemove (event) {
  DRAG.diffX = DRAG.pageX - (DRAG.pageX = event.pageX)
  DRAG.diffY = DRAG.pageY - (DRAG.pageY = event.pageY)
  DRAG.node.scrollLeft = DRAG.scrollX += DRAG.diffX
  DRAG.node.scrollTop = DRAG.scrollY += DRAG.diffY
}

function onMouseup (event) {
  document.body.style.cursor = ''
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('mouseup', onMouseup)
  if (!REDUCED_MOTION.matches) {
    smoothScroll(
      DRAG.node,
      DRAG.scrollX + DRAG.diffX * 20,
      DRAG.scrollY + DRAG.diffY * 20
    )
  }
}

function onClick (event) {
  for (let el = event.target; el; el = el.parentElement) {
    const target = el.getAttribute(ATTR)
    if (target) {
      scroll(target, {
        x: el.getAttribute(`${ATTR}-x`),
        y: el.getAttribute(`${ATTR}-y`)
      })
    }
  }
}

function onScroll ({target}) {
  if (!target.hasAttribute || !target.hasAttribute(UUID)) return // target can be document
  const btns = getControls(target)
  const nowX = target.scrollLeft

  // btns.forEach((el) => (el.disabled = Number(el.value) === nowX))
}

function getControls (target) {
  return queryAll(`[${ATTR}]`).filter((el) => document.querySelector(el.getAttribute(ATTR)) === target)
}

function smoothScroll (element, x = 0, y = 0) {
  const friction = 0.95
  const nowX = element.scrollLeft
  const nowY = element.scrollTop
  const endX = Math.max(0, Math.min(x, element.scrollWidth - element.clientWidth))
  const endY = Math.max(0, Math.min(y, element.scrollHeight - element.clientHeight))
  let moveX = endX - nowX
  let moveY = endY - nowY
  DRAG.move = true

  if (REDUCED_MOTION.matches) moveX = moveY = 1

  const move = () => {
    if (DRAG.move && (Math.abs(Math.round(moveX)) || Math.abs(Math.round(moveY)))) {
      element.scrollLeft = endX - Math.round(moveX *= friction)
      element.scrollTop = endY - Math.round(moveY *= friction)
      requestAnimFrame(move)
    }
  }
  move()
}

function getItemFromPosition (element, atX = 0, atY = 0) {
  const nowX = element.scrollLeft
  const nowY = element.scrollTop
  const rect = element.getBoundingClientRect()
  const stops = queryAll(element.children).reduce((acc, el, x, y) => {
    const pos = el.getBoundingClientRect()
    const isVisible = pos.width && pos.height
    return isVisible ? acc.concat({
      el,
      x: x = pos.left - rect.left + nowX,
      y: y = pos.top - rect.top + nowY,
      cx: x + (pos.width / 2),
      cy: y + (pos.height / 2)
    }) : acc
  }, [])

  return stops.sort((a, b) => {
    return Math.abs(a.cx - atX) - Math.abs(b.cx - atX) + Math.abs(a.cy - atY) - Math.abs(b.cy - atY)
  })[0] || false
}

function getScrollEnd (element, moveX, moveY) {
  const [, mathX = '', floatX, unitX] = String(moveX || 0).match(/([+-])?\s*([\d.]+)(px|%)?/) || []
  const [, mathY = '', floatY, unitY] = String(moveY || 0).match(/([+-])?\s*([\d.]+)(px|%)?/) || []
  const toX = (mathX ? element.scrollLeft : 0) + Number(`${mathX}${floatX}`) * (unitX === '%' ? element.clientWidth / 100 : 1)
  const toY = (mathY ? element.scrollTop : 0) + Number(`${mathY}${floatY}`) * (unitY === '%' ? element.clientHeight / 100 : 1)

  return getItemFromPosition(element, toX, toY)
}
