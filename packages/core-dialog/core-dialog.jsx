import React from 'react'
import dialog from './core-dialog'
import { exclude } from '../utils'

export default class Dialog extends React.Component {
  static get defaultProps () { return {strict: null, onToggle: null} }

  componentDidMount () {
    dialog(this.el, this.props)
    this.el.addEventListener('dialog.toggle', this.props.onToggle)
  }
  componentWillUnmount () {
    this.el.removeEventListener('dialog.toggle', this.props.onToggle)
  }
  componentWillReceiveProps (props) {
    dialog(this.el, props)
  }
  render () {
    return React.createElement('dialog',
      exclude(this.props, Dialog.defaultProps, {ref: el => (this.el = el)}),
      this.props.children)
  }
}
