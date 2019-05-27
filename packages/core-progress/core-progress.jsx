import CoreProgress from './core-progress.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreProgress, {
  customEvents: ['change']
})
