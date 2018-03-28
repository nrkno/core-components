import React from 'react'
import dialog from './core-dialog'

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
    return (
      <div className='nrk-dialog'
        role='dialog'
        tabIndex='-1'
        ref={(el) => { this.dialogEl = el }}
      >
        {this.props.children}
      </div>
    )
  }
}
