import CoreSuggest from './core-suggest.js'
import customElementToReact from '@nrk/custom-element-to-react'

export default customElementToReact(CoreSuggest, {
  customEvents: ['suggest.filter', 'suggest.select', 'suggest.ajax', 'suggest.ajax.beforeSend']
})
