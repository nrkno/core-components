// import {name, version} from './package.json'
import {queryAll, addEvent} from '../utils'

const KEY = 'core-datepicker' //`${name}-${version}`                    // Unique id of component

export default function datepicker (...args) {              // Expose component
  return new Datepicker(...args)
}

class Datepicker {
  constructor (elements) {
    this.elements = queryAll(elements, KEY)
    // tabindex="0" på datepicker kun lytte til events på disse
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
