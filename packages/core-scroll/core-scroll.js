import {name, version} from './package.json'
import {IS_BROWSER, addEvent, queryAll} from '../utils'

const ATTR = `data-core-scroll`
const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters
const TICK = !IS_BROWSER || window.requestAnimationFrame || window.setTimeout
const DRAG = {friction: 0.95}

export default function scroll (elements) {
  return queryAll(elements).forEach((element) => {
    element.setAttribute(UUID, '')
    element.style.overflow = 'auto'
    element.style.webkitOverflowScrolling = 'touch'
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
      document.body.style.cursor = '-webkit-grabbing'
      document.body.style.cursor = 'grabbing'

      DRAG.isDragging = true
      onMousemove(event)
      animate()
      window.addEventListener('mousemove', onMousemove, false)
      window.addEventListener('mouseup', onMouseup, false)
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
    const target = attr && document.querySelector(attr.split('@')[0])

    if (target) {
      console.log(target)
    }
  }
}
