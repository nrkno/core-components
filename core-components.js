const components = {
  version: __VERSION__, // eslint-disable-line
  details: require('./details'),
  dialog: require('./dialog'),
  input: require('./input')
}

if (typeof window !== 'undefined') {
  require('custom-event-polyfill')
  window.dispatchEvent(new window.CustomEvent('core-components', {
    detail: components
  }))
}

module.exports = components
