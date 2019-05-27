import CoreDialog from './core-dialog.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDialog, {
  customEvents: ['dialog.toggle']
})
