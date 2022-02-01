import { IS_BROWSER, addStyle, closest, dispatchEvent, throttle, getUUID, queryAll } from '../utils'

/**
 * @typedef {{ x: number, y: number }} scrollCoords
 */

/**
 * @typedef {object} scrollPoint
 * @property {Number} x
 * @property {Number} y
 * @property {'top' | 'bottom'} prop
 */

/**
 * @typedef {'up'| 'down' | 'left' | 'right'} scrollDirection
 */

/**
 * @typedef {scrollDirection | scrollPoint | Element} scrollTarget
 */

/**
 * @typedef {Object} dragType
 * @property {String} animate Id of element to animate
 * @property {Number} diffSumX
 * @property {Number} diffSumY
 * @property {Number} diffX
 * @property {Number} diffY
 * @property {Number} pageX
 * @property {Number} pageY
 * @property {Number} scrollX
 * @property {Number} scrollY
 * @property {HTMLElement} target
 */

/**
 * @type {dragType}
 */
const DRAG = {}
const MOVE = { up: { y: -1, prop: 'top' }, down: { y: 1, prop: 'bottom' }, left: { x: -1 }, right: { x: 1 } }
const MOVE_SIGNIFICANT = 10
const NEEDS_MOUSEDOWN = '[contenteditable="true"],input,select,textarea'
const EVENT_PASSIVE = ((has = false) => {
  try { window.addEventListener('test', null, { get passive () { has = { passive: true } } }) } catch (e) {}
  return has
})()

// https://css-tricks.com/introduction-reduced-motion-media-query/
const requestJumps = IS_BROWSER && window.matchMedia && window.matchMedia('(prefers-reduced-motion)').matches
const requestFrame = IS_BROWSER && (window.requestAnimationFrame || window.setTimeout)

export default class CoreScroll extends HTMLElement {
  connectedCallback () {
    // Hide scrollbar in WebKit and default to display block
    addStyle(this.nodeName, `
      ${this.nodeName}{display:block}
      ${this.nodeName}::-webkit-scrollbar{display:none}
    `)

    this.style.overflow = 'scroll' // Ensure visible scrollbars
    this.style.webkitOverflowScrolling = 'touch' // Momentum scroll on iOS

    // Calculate sizes for hiding, must be after setting overflow:scroll
    const barWidth = this.offsetWidth - this.clientWidth
    const barHeight = this.offsetHeight - this.clientHeight

    // Also ensure height does not grow higher than parent element
    this.style.marginRight = `-${barWidth}px`
    this.style.marginBottom = `-${barHeight}px`
    this.style.maxHeight = `calc(100% + ${barHeight}px)`
    this._throttledEvent = throttle(this.handleEvent.bind(this), 500)

    this.addEventListener('mousedown', this)
    this.addEventListener('wheel', this, EVENT_PASSIVE)
    this.addEventListener('scroll', this._throttledEvent, EVENT_PASSIVE)
    window.addEventListener('resize', this._throttledEvent, EVENT_PASSIVE)
    window.addEventListener('load', this) // Update state when we are sure all CSS is loaded
    document.addEventListener('click', this)
    setTimeout(() => this.handleEvent()) // Initialize buttons after children is parsed
  }

  disconnectedCallback () {
    this._throttledEvent = null // Garbage collection
    this.removeEventListener('mousedown', this)
    this.removeEventListener('wheel', this, EVENT_PASSIVE)
    this.removeEventListener('scroll', this._throttledEvent, EVENT_PASSIVE)
    window.removeEventListener('resize', this._throttledEvent, EVENT_PASSIVE)
    window.removeEventListener('load', this)
    document.removeEventListener('click', this)
  }

  /**
   *
   * @param {Event} event
   */
  handleEvent (event = {}) {
    if (!this.parentNode || event.defaultPrevented) return // Abort if removed from DOM or event is prevented
    if (event.type === 'wheel') DRAG.animate = false // Stop momentum animation onWheel
    else if (event.type === 'mousedown') onMousedown.call(this, event)
    else if (event.type === 'click') {
      const btn = this.id && closest(event.target, `[for="${this.id}"],[data-for="${this.id}"]`)
      if (btn && dispatchEvent(this, 'scroll.click', { move: btn.value })) this.scroll(btn.value)
    } else {
      // We floor all values to handle potential decimal leftovers if browser is zoomed in or out
      const scroll = {
        up: Math.floor(this.scrollTop),
        right: Math.floor(this.scrollRight),
        down: Math.floor(this.scrollBottom),
        left: Math.floor(this.scrollLeft)
      }
      const cursor = (scroll.left || scroll.right || scroll.up || scroll.down) ? 'grab' : ''
      queryAll(this.id && `[for="${this.id}"],[data-for="${this.id}"]`).forEach((el) => (el.disabled = !scroll[el.value]))
      dispatchEvent(this, 'scroll.change')

      if (!event.type) { // Do not change cursor while dragging
        this.style.cursor = `-webkit-${cursor}`
        this.style.cursor = cursor
      }
    }
  }

  scroll (point) {
    const { x, y } = parsePoint(this, point)
    const uuid = DRAG.animate = getUUID() // Giving the animation an ID to workaround IE timeout issues
    const friction = this.friction
    let moveX = requestJumps ? 1 : x - this.scrollLeft
    let moveY = requestJumps ? 1 : y - this.scrollTop

    const move = () => {
      if (DRAG.animate === uuid && (Math.round(moveX) || Math.round(moveY))) {
        this.scrollLeft = x - Math.round(moveX *= friction)
        this.scrollTop = y - Math.round(moveY *= friction)
        requestFrame(move)
      }
    }
    move()
  }

  get items () { return queryAll(this.getAttribute('items') || this.children, this) }

  // Ensure falsy values becomes ''
  set items (val) { this.setAttribute('items', val || '') }

  // ScrollLeft can return decimals when browser is zoomed, leading to unwanted negative values
  get scrollRight () { return Math.max(0, this.scrollWidth - this.clientWidth - this.scrollLeft) }

  // Safeguard for negative due to decimals for scrollTop similar to scrollLeft above
  get scrollBottom () { return Math.max(0, this.scrollHeight - this.clientHeight - this.scrollTop) }

  // Avoid friction 1 (infinite)
  get friction () { return Math.min(0.99, this.getAttribute('friction')) || 0.8 }

  set friction (val) { this.setAttribute('friction', val) }
}

function onMousedown (event) {
  if (closest(event.target, NEEDS_MOUSEDOWN)) return
  if (event.button !== 0) return // Only react to left clicking
  event.preventDefault() // Prevent text selection and enable nesting

  DRAG.pageX = event.pageX
  DRAG.pageY = event.pageY
  DRAG.diffSumX = 0
  DRAG.diffSumY = 0
  DRAG.animate = DRAG.diffX = DRAG.diffY = 0 // Reset
  DRAG.scrollX = this.scrollLeft
  DRAG.scrollY = this.scrollTop
  DRAG.target = this

  document.body.style.cursor = this.style.cursor = '-webkit-grabbing'
  document.body.style.cursor = this.style.cursor = 'grabbing'
  document.addEventListener('mousemove', onMousemove)
  document.addEventListener('mouseup', onMouseup)
}

function onMousemove (event) {
  DRAG.diffX = DRAG.pageX - (DRAG.pageX = event.pageX)
  DRAG.diffY = DRAG.pageY - (DRAG.pageY = event.pageY)
  DRAG.diffSumX += DRAG.diffX
  DRAG.diffSumY += DRAG.diffY
  DRAG.target.scrollLeft = DRAG.scrollX += DRAG.diffX
  DRAG.target.scrollTop = DRAG.scrollY += DRAG.diffY

  // Prevent links when we know there has been significant movement
  if (Math.max(Math.abs(DRAG.diffSumX), Math.abs(DRAG.diffSumY)) > MOVE_SIGNIFICANT) {
    DRAG.target.style.pointerEvents = 'none'
  }
}

function onMouseup (event) {
  const momentum = Math.abs(DRAG.diffX || DRAG.diffY) > MOVE_SIGNIFICANT ? 20 : 0
  document.removeEventListener('mousemove', onMousemove)
  document.removeEventListener('mouseup', onMouseup)
  document.body.style.cursor = ''

  if (momentum) {
    DRAG.target.scroll({
      x: DRAG.scrollX + DRAG.diffX * momentum,
      y: DRAG.scrollY + DRAG.diffY * momentum
    })
  }
  DRAG.target.style.pointerEvents = '' // Allow events again
  DRAG.target.style.cursor = '-webkit-grab'
  DRAG.target.style.cursor = 'grab'
  DRAG.target = null // Prevent memory leak
}

/**
 * Takes an element, coordinates or cardinal direction and returns x/y -coordinates
 * @param {CoreScroll} self CoreScroll HTMLElement
 * @param {scrollTarget} move
 * @returns {scrollPoint}
 */
function parsePoint (self, move) {
  const point = typeof move === 'object' ? move : { move }
  if (typeof point.x !== 'number') point.x = self.scrollLeft
  if (typeof point.y !== 'number') point.y = self.scrollTop
  if ((point.move = MOVE[point.move])) {
    const axis = point.move.x ? 'x' : 'y'
    const start = point.move.x ? 'left' : 'top'
    const bounds = self.getBoundingClientRect()
    const scroll = bounds[start] - self[point.move.x ? 'scrollLeft' : 'scrollTop']
    const edge = bounds[start] + bounds[point.move.x ? 'width' : 'height'] * point.move[axis]

    self.items.every((el) => { // Use .every as this loop stops on return false
      const rect = el.getBoundingClientRect()
      const marg = el.ownerDocument.defaultView.getComputedStyle(el)[`margin-${start}`]

      point[axis] = rect[start] - parseInt(marg, 10) - scroll // Update point to child axis coordinate
      return rect[point.move.prop || move] < edge
    })
  }
  return {
    x: Math.max(0, Math.min(point.x, self.scrollWidth - self.clientWidth)),
    y: Math.max(0, Math.min(point.y, self.scrollHeight - self.clientHeight))
  }
}
