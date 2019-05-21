import CoreDatepicker from './core-datepicker.js'
import { elementToReact } from '../utils.js'

export default elementToReact(CoreDatepicker, 'datepicker.change', 'datepicker.click.day', 'disabled', 'months', 'days')
