import CoreSuggest from './core-suggest.js'
import { version } from './package.json'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreSuggest, {
  customEvents: ['suggest.filter', 'suggest.select', 'suggest.ajax', 'suggest.ajax.beforeSend', 'suggest.ajax.error'],
  suffix: version
})
