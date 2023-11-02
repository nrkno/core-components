import CoreDatepicker from './core-datepicker.js'
import packageInfo from './package.json' assert { type: 'json' };
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreDatepicker, {
  props: ['disabled'],
  customEvents: ['datepicker.change', 'datepicker.click.day'],
  suffix: packageInfo.version
})
