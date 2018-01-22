import {name, version} from './package.json'
import {getElements, on} from '../utils'
import 'polyfill-custom-event'

const KEY = `${name}-${version}`                    // Unique id of component

export function datepicker (...args) {              // Expose component
  return new Datepicker(...args)
}

class Datepicker {
  constructor (elements) {
    this.elements = getElements(elements, KEY)
  }
  open (open = true) {}
  close (open = false) {}
}


/* <table>
  <caption></caption>
  <thead></thead>
  <tbody></tbody>
  <tfoot></tfoot>
</table> */
