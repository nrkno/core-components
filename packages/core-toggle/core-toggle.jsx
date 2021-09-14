import CoreToggle from './core-toggle.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreToggle, {
  props: ['popup'],
  customEvents: ['toggle', 'toggle.select'],
  suffix: version
})
