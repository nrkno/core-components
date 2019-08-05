import CoreDatepicker from './core-datepicker.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDatepicker, {
  props: ['disabled'],
  customEvents: ['datepicker.change', 'datepicker.click.day'],
  suffix: version
})
