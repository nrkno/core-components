// import {name, version} from './package.json'
import {ariaConnect, dispatchEvent, registerElements, registerEvent} from '../utils'

const KEY = 'core-toggle' //`${name}-${version}` // Unique id of component

function ariaExpanded (master, slave, expanded) {
  master.setAttribute('aria-expanded', expanded)
  slave[expanded? 'removeAttribute' : 'setAttribute']('hidden', '')
}

/**
* toggle
* @param {String|NodeList|Array|Element} elements A CSS selector string, nodeList, element array, or single element
* @param {Boolean} [open] Optional. True will open, false will close, undefined just updates attribute
* @return {Array} Array of elements
*/
export default function toggle (elements, open = null) {
  return registerElements(KEY, elements).map((el) => {
    const slave = ariaConnect(el)
    const prevOpen = el.getAttribute('aria-expanded') === 'true'
    const wantOpen = open === null ? prevOpen : Boolean(open)
    ariaExpanded(el, slave, prevOpen)

    const nextOpen = (prevOpen !== wantOpen && dispatchEvent(el, 'toggle')) ? wantOpen : prevOpen

    ariaExpanded(el, slave, nextOpen)
    return el
  })
}

registerEvent(KEY, 'click', (el) => {
  toggle(el, el.getAttribute('aria-expanded') !== 'true')
})
