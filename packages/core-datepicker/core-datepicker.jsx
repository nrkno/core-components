import CoreDatepicker from './core-datepicker.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDatepicker, {
  props: ['disabled', 'months', 'days'],
  customEvents: ['datepicker.change', 'datepicker.click.day']
})
