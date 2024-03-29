import CoreTabs from './core-tabs.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreTabs, {
  customEvents: ['tabs.toggle'],
  suffix: version
})
