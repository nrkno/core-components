import CoreToggle from './core-toggle.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreToggle, {
  customEvents: ['toggle', 'toggle.select']
})
