import CoreSuggest from './core-suggest.js'
import { elementToReact } from '../utils.js'

export default elementToReact(CoreSuggest, 'suggest.filter', 'suggest.select', 'suggest.ajax', 'suggest.ajax.beforeSend')
