import CoreScroll from './core-scroll.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreScroll, {
  customEvents: ['scroll.change'],
  suffix: version
})
