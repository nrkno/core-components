import CoreDatepicker from './core-datepicker.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDatepicker, {
  customEvents: ['datepicker.change', 'datepicker.click.day', 'disabled', 'months', 'days']
})
