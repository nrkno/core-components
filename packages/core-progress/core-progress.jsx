import CoreProgress from './core-progress.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreProgress, {
  customEvents: ['change'],
  suffix: version
})
