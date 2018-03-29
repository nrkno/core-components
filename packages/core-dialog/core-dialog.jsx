import React from 'react'
import dialog from './core-dialog'
import {exclude} from '../utils'

const DEFAULTS = {open: null, hidden: null, ariaLabel: null}

export default class Dialog extends React.Component {
  componentDidMount () {
    dialog(this.dialogEl, {open: this.props.open})
    this.props.handleToggle && this.dialogEl.addEventListener('dialog.toggle', this.props.handleToggle)
  }
  componentWillUnmount () {
    this.props.handleToggle && this.dialogEl.removeEventListener('dialog.toggle', this.props.handleToggle)
  }
  componentWillReceiveProps (nextProps) {
    dialog(this.dialogEl, {open: nextProps.open})
  }
  render () {
    return React.createElement('div',
      exclude(this.props, DEFAULTS, {ref: el => (this.dialogEl = el)}),
      this.props.children)
  }
}
