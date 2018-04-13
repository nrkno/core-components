import React from 'react'
import dialog from './core-dialog'
import { exclude } from '../utils'

const DEFAULTS = {hidden: null, onToggle: null}

export default class Dialog extends React.Component {
  componentDidMount () {
    dialog(this.el, this.props.open)
    this.el.addEventListener('dialog.toggle', this.props.onToggle)
  }
  componentWillUnmount () {
    this.el.removeEventListener('dialog.toggle', this.props.onToggle)
  }
  componentWillReceiveProps ({open}) {
    dialog(this.el, open)
  }
  render () {
    return React.createElement('dialog',
      exclude(this.props, DEFAULTS, {ref: el => (this.el = el)}),
      this.props.children)
  }
}
