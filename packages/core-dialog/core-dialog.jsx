import CoreDialog from './core-dialog.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDialog, {
  customEvents: ['dialog.toggle'],
  suffix: version
})
