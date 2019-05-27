import CoreScroll from './core-scroll.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreScroll, {
  customEvents: ['scroll.change']
})
