import CoreTabs from './core-tabs.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreTabs, {
  props: ['tab'],
  customEvents: ['tabs.toggle']
})
